package com.ssafy.yut.service;

import com.ssafy.yut.dto.ChatDto;
import com.ssafy.yut.dto.ChatType;
import com.ssafy.yut.dto.ReadyDto;
import com.ssafy.yut.dto.RequestDto;
import com.ssafy.yut.dto.RoomDto;
import com.ssafy.yut.entity.Game;
import com.ssafy.yut.entity.GameUser;
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

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

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

    /**
     * 방 입장
     *
     * @param roomDto
     * @return
     */
    public boolean enterRoom(RoomDto.RoomCode roomDto) {
        Game room = redisMapper.getData("game:"+roomDto.getRoomCode(), Game.class);

        // 방이 없을 때
        if (room == null) {
            throw new CustomException(ErrorCode.NOT_FOUND_ROOM);
        }

        // 방이 있을 때
        else {
            // 게임 중인 경우
            if(room.getGameStatus().equals("start")) {
                // TODO: 2023-05-01 게임 중
                throw new CustomException(ErrorCode.GAME_ON);
            }
            // 게임 중은 아니나, 정원 초과인 경우
            else if(room.getUsers().size() == 4) {
                // TODO: 2023-05-01 정원 초과
                throw new CustomException(ErrorCode.FULL_ROOM);
            }

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
        String key = "game:"+roomCode;
        log.info("Enter Room : " + roomCode + " USER : " + userId);

        List<GameUser> users = new ArrayList<>();
        List<Integer> pieces = new ArrayList<>();
        pieces.add(-1);
        pieces.add(-1);
        pieces.add(-1);

        GameUser user = GameUser.builder().userId(userId).pieces(pieces).build();

        Game game = redisMapper.getData(key, Game.class);

        if (game == null) {
            users.add(user);
            game = Game.builder()
                    .users(users)
                    .gameStatus("0")
                    .plate(new LinkedHashMap<>())
                    .build();
            redisMapper.saveData(key, game);
        } else {
            users = game.getUsers();
            users.add(user);
            String ready = game.getGameStatus();
            game.setUsers(users);
            game.setGameStatus(ready + "0");

            redisMapper.saveData(key, game);
        }

        List<RoomDto.User> userResponse = new ArrayList<>();

        for (GameUser getUser : users) {
            userResponse.add(new RoomDto.User(getUser.getUserId()));
        }

        RoomDto.EnterResponse enterResponse = RoomDto.EnterResponse.builder()
                .users(userResponse)
                .ready(game.getGameStatus())
                .build();

        ChatDto.Request chatRequestDto = ChatDto.Request.builder()
                .type(ChatType.SYSTEM)
                .userId(userId)
                .roomCode(roomCode)
                .content("[" + userId + "]님이 입장했습니다.")
                .build();

        Map<String, Object> response = new HashMap<>();
        response.put("roomCode", roomCode);
        response.put("response", enterResponse);

        kafkaTemplate.send(TOPIC_ROOM + ".enter", roomCode, response);
        kafkaTemplate.send(TOPIC_CHAT, roomCode, chatRequestDto);
    }

    /**
     * Kafka로 대기방 정보 클라이언트로 보내기
     *
     * @param response 대기방 정보
     */
    @KafkaListener(topics = TOPIC_ROOM + ".enter", groupId = GROUP_ID)
    public void sendRoomState(Map<String, Object> response) {
        log.info("Announce Enter Room : " + response.get("roomCode"));
        template.convertAndSend("/topic/room/enter/" + response.get("roomCode"), response.get("response"));
    }

    /**
     * 준비 변경 상태 Kafka로 보내기
     *
     * @param request 준비 변경
     */
    public void readyGame(ReadyDto.Request request) {
        String roomCode = request.getRoomCode();
        String readyChange = request.isReady() ? "1" : "0";
        String key = "game:"+roomCode;
        Game game = redisMapper.getData(key, Game.class);
        List<GameUser> users = game.getUsers();
        int userSize = users.size();

        int userIndex = 0;
        for(int i=0; i < userSize; i++) {
            if(users.get(i).getUserId().equals(request.getUserId())) {
                userIndex = i;
            }
        }
        String[] readyArray = game.getGameStatus().split("");

        readyArray[userIndex] = readyChange;

        String ready = String.join("", readyArray);

        game.setGameStatus(ready);

        boolean canStart = ((1 << userSize) - 1) == Integer.parseInt(ready,2);
        if((userSize > 1 && userSize < 5) && canStart) {
            Collections.shuffle(users);
            game.setUsers(users);
            game.setGameStatus("start");
            Set<Integer> event = new HashSet<>();
            while(event.size() < 2) {
                event.add((int)((Math.random()*28)+1));
            }

        }

        redisMapper.saveData(key, game);

        ReadyDto.Response readyResponse = ReadyDto.Response.builder()
                .userId(request.getUserId())
                .ready(readyChange)
                .start(canStart)
                .build();

        Map<String, Object> response= new HashMap<>();
        response.put("roomCode", roomCode);
        response.put("response", readyResponse);

        kafkaTemplate.send(TOPIC_ROOM + ".prepare", response);
    }

    /**
     * Kafka로 받은 준비 상태 클라이언트로 보내기
     *
     * @param response 준비상태 변경 및 대기방 상태
     */
    @KafkaListener(topics = TOPIC_ROOM + ".prepare", groupId = GROUP_ID)
    public void sendReady(Map<String, Object> response) {
        template.convertAndSend("/topic/room/prepare/" + response.get("roomCode"), response.get("response"));
    }
}
