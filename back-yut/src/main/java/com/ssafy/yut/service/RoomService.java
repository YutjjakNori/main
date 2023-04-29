package com.ssafy.yut.service;

import com.ssafy.yut.dto.ChatDto;
import com.ssafy.yut.dto.ChatType;
import com.ssafy.yut.dto.ReadyDto;
import com.ssafy.yut.dto.RequestDto;
import com.ssafy.yut.dto.RoomDto;
import com.ssafy.yut.entity.Game;
import com.ssafy.yut.entity.Room;
import com.ssafy.yut.entity.User;
import com.ssafy.yut.exception.CustomException;
import com.ssafy.yut.exception.ErrorCode;
import com.ssafy.yut.util.RedisMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 대기방 관련 Service
 *
 * @author 김정은
 * @author 이준
 */

@Service
@Slf4j
@RequiredArgsConstructor
public class RoomService {

    private final RedisMapper redisMapper;
    private final String TOPIC_ROOM = "room", TOPIC_CHAT = "chat", TOPIC_GAME = "GAME", GROUP_ID = "yut";
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final SimpMessagingTemplate template;
    private final int RANDOM_LEN = 5;
    private final boolean USE_LETTERS = true, USE_NUMBERS = true;

    /**
     * 방 생성할 때 RoomCode 생성
     *
     * @return RoomCode
     */
    public RoomDto.RoomCode createRoom(){
        String code = RandomStringUtils.random(RANDOM_LEN, USE_LETTERS, USE_NUMBERS);
        return new RoomDto.RoomCode(code);
    }

    public boolean enterRoom(RoomDto.RoomCode roomDto) {
        Room room = redisMapper.getData(roomDto.getRoomCode(), Room.class);

        if (room == null) {
            throw new CustomException(ErrorCode.NOT_FOUND_ROOM);
        }

        else {
            Game game = redisMapper.getData(roomDto.getRoomCode(), Game.class);

            // TODO: 게임 중, 종료 되었을 때 에러 던지기
//            if(game.)
        }

        return true;
    }

    /**
     * 방 입장 시 대기방 정보 Kafka로 보내기
     *
     * @param enterDto 입장 정보
     */
    public void enterRoom(RequestDto enterDto) {
        // TODO: Redis 조회 후 대기방 정보(대기인원, 준비 상태) 넘겨주기
        String userId = enterDto.getUserId();
        String roomCode = enterDto.getRoomCode();
        String key = "room:"+roomCode;
        log.info("Enter Room : " + roomCode + " USER : " + userId);

        List<User> users = new ArrayList<>();

        User user = User.builder().userId(userId).build();

        Room room = redisMapper.getData(key, Room.class);

        if (room == null) {
            users.add(user);
            room = Room.builder()
                    .users(users)
                    .ready("0")
                    .build();
            redisMapper.saveData(key, room);
        } else {
            users = room.getUsers();
            users.add(user);
            String ready = room.getReady();
            room.setUsers(users);
            room.setReady(ready + "0");

            redisMapper.saveData(key, room);
        }
        List<RoomDto.User> userResponse = new ArrayList<>();

        for (User getUser : users) {
            userResponse.add(new RoomDto.User(getUser.getUserId()));
        }

        RoomDto.EnterResponse responseEnter = RoomDto.EnterResponse.builder()
                .users(userResponse)
                .ready(room.getReady())
                .build();

        ChatDto.Request chatRequestDto = ChatDto.Request.builder()
                .type(ChatType.SYSTEM)
                .userId(userId)
                .roomCode(roomCode)
                .content("[" + userId + "]님이 입장했습니다.")
                .build();
        Map<String, Object> response = new HashMap<>();
        response.put("roomCode", roomCode);
        response.put("responseEnter", responseEnter);

        kafkaTemplate.send(TOPIC_ROOM + ".enter", response);
        kafkaTemplate.send(TOPIC_CHAT, chatRequestDto);
    }

    /**
     * Kafka로 대기방 정보 클라이언트로 보내기
     *
     * @param response 대기방 정보
     */
    @KafkaListener(topics = TOPIC_ROOM + ".enter", groupId = GROUP_ID)
    public void sendRoomState(Map<String, Object> response) {
        log.info("Announce Enter Room : " + response.get("roomCode"));
        template.convertAndSend("/topic/room/" + response.get("roomCode"), response.get("responseEnter"));
    }

    /**
     * 준비 변경 상태 Kafka로 보내기
     *
     * @param readyRequest 준비 변경
     */
    public void readyGame(ReadyDto.ReadyRequest readyRequest) {
        String roomCode = readyRequest.getRoomCode();
        boolean isReady = readyRequest.isReady();
        String key = "room:"+roomCode;
        Room room = redisMapper.getData(key, Room.class);
        List<User> users = room.getUsers();
        int userSize = users.size();

        int userIndex = 0;
        for(int i=0; i < userSize; i++) {
            if(users.get(i).getUserId().equals(readyRequest.getUserId())) {
                userIndex = i;
            }
        }
        String[] readyArray = room.getReady().split("");

        readyArray[userIndex] = isReady ? "1" : "0";

        String ready = String.join("", readyArray);

        room.setReady(ready);

        redisMapper.saveData(key, room);


        ReadyDto.ReadyResponse readyResponse = ReadyDto.ReadyResponse.builder()
                .userId(readyRequest.getUserId())
                .ready(isReady)
                .start(((1 << userSize) - 1) == Integer.parseInt(ready,2))
                .build();

        Map<String, Object> response= new HashMap<>();
        response.put("roomCode", roomCode);
        response.put("readyResponse", readyResponse);

        kafkaTemplate.send(TOPIC_ROOM + ".prepare", response);
    }

    /**
     * Kafka로 받은 준비 상태 클라이언트로 보내기
     *
     * @param response 준비상태 변경 및 대기방 상태
     */
    @KafkaListener(topics = TOPIC_ROOM + ".prepare", groupId = GROUP_ID)
    public void sendReady(Map<String, Object> response) {
        template.convertAndSend("/topic/room/prepare/" + response.get("roomCode"), response.get("readyResponse"));
    }
}
