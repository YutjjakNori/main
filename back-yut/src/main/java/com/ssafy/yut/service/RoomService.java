package com.ssafy.yut.service;

import com.ssafy.yut.dto.ChatDto;
import com.ssafy.yut.dto.ChatType;
import com.ssafy.yut.dto.ReadyDto;
import com.ssafy.yut.dto.RoomDto;
import com.ssafy.yut.entity.Game;
import com.ssafy.yut.entity.GameUser;
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

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
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
    private final String TOPIC_ROOM = "room", TOPIC_CHAT = "chat";
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
        if (room == null || roomDto.getRoomCode().equals("")) {
            throw new CustomException(ErrorCode.NOT_FOUND_ROOM);
        }

        // 방이 있을 때
        else {
            // 게임 중인 경우
            if(room.getGameStatus().equals("start")) {
                throw new CustomException(ErrorCode.GAME_ON);
            }
            // 게임 중은 아니나, 정원 초과인 경우
            else if(room.getUsers().size() == 4) {
                throw new CustomException(ErrorCode.FULL_ROOM);
            }

        }

        return true;
    }

    /**
     * 방 입장 시 대기방 정보 Kafka로 보내기
     *
     * @param request 입장 정보
     */
    public void enterRoom(RoomDto.WaitingRequest request) {
        String userId = request.getUserId();
        String roomCode = request.getRoomCode();
        String nickName = request.getNickName();
        String userKey = "user:" + userId;
        String gameKey = "game:" + roomCode;

        List<GameUser> gameUsers = new ArrayList<>();
        List<Integer> pieces = new ArrayList<>();
        pieces.add(-1);
        pieces.add(-1);
        pieces.add(-1);

        GameUser gameUser = GameUser.builder().userId(userId).nickName(nickName).pieces(pieces).build();

        Game game = redisMapper.getData(gameKey, Game.class);
        if (game == null && !roomCode.equals("")) {
            gameUsers.add(gameUser);
            game = Game.builder()
                    .users(gameUsers)
                    .gameStatus("0")
                    .plate(new HashMap<>())
                    .build();

            User user = User.builder()
                    .userId(userId)
                    .roomCode(roomCode)
                    .build();

            redisMapper.saveData(userKey, user);
            redisMapper.saveData(gameKey, game);
        }
        else if(game != null && game.getUsers().size() < 4) {
            gameUsers = game.getUsers();
            gameUsers.add(gameUser);
            String ready = game.getGameStatus();
            game.setUsers(gameUsers);
            game.setGameStatus(ready + "0");

            User user = User.builder()
                    .userId(userId)
                    .roomCode(roomCode)
                    .build();

            redisMapper.saveData(userKey, user);
            redisMapper.saveData(gameKey, game);
        }
        // TODO: 2023/05/06 입장 요청을 그냥 보낼 경우
        else if(game == null || game.getUsers().size() == 4 || roomCode.equals("")) {
            //에러 처리
            return;
        }

        List<RoomDto.User> userResponse = new ArrayList<>();

        for (GameUser getUser : gameUsers) {
            userResponse.add(new RoomDto.User(getUser.getUserId(), getUser.getNickName()));
        }

        RoomDto.WaitingResponse waitingResponse = RoomDto.WaitingResponse.builder()
                .users(userResponse)
                .ready(game.getGameStatus())
                .build();

        ChatDto.Request chatRequestDto = ChatDto.Request.builder()
                .type(ChatType.SYSTEM)
                .userId(userId)
                .roomCode(roomCode)
                .content("입장했습니다.")
                .build();

        Map<String, Object> response = new HashMap<>();
        response.put("roomCode", roomCode);
        response.put("response", waitingResponse);
        log.info("Enter Room From : " + roomCode + " User : " + userId);
        kafkaTemplate.send(TOPIC_ROOM + ".enter", response);
        kafkaTemplate.send(TOPIC_CHAT, chatRequestDto);
    }

    /**
     * Kafka로 대기방 정보 클라이언트로 보내기
     *
     * @param response 대기방 정보
     */
    @KafkaListener(topics = TOPIC_ROOM + ".enter", groupId = "room-enter")
    public void sendRoomState(Map<String, Object> response) {
        log.info("Enter Send To : " + response.get("roomCode"));
        template.convertAndSend("/topic/room/enter/" + response.get("roomCode"), response.get("response"));
    }

    /**
     * 준비 변경 상태 Kafka로 보내기
     *
     * @param request 준비 변경
     */
    public void readyGame(ReadyDto.Request request) {
        String roomCode = request.getRoomCode();
        String readyChange = request.getReady();
        String key = "game:"+roomCode;
        Game game = redisMapper.getData(key, Game.class);
        List<GameUser> users = game.getUsers();
        int userSize = users.size();

        int userIndex = users.indexOf(GameUser.builder().userId(request.getUserId()).build());
        int readyStatus = Integer.parseInt(game.getGameStatus(), 2);
        int changeReady = 1 << userIndex;

        String ready = String.format("%s", Integer.toBinaryString(readyStatus ^ changeReady));
        game.setGameStatus(ready);

        boolean canStart = userSize > 1 && userSize < 5 && ((1 << userSize) - 1) == Integer.parseInt(ready, 2);
        if(canStart) {
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
        log.info("Ready From : " + roomCode + " User : " + request.getUserId());
        kafkaTemplate.send(TOPIC_ROOM + ".prepare", response);
    }

    /**
     * Kafka로 받은 준비 상태 클라이언트로 보내기
     *
     * @param response 준비상태 변경 및 대기방 상태
     */
    @KafkaListener(topics = TOPIC_ROOM + ".prepare", groupId = "room-prepare")
    public void sendReady(Map<String, Object> response) {
        log.info("Ready Send To : " + response.get("roomCode"));
        template.convertAndSend("/topic/room/preparation/" + response.get("roomCode"), response.get("response"));
    }

    /**
     * 방 나가기 응답
     *
     * @param response
     */
    @KafkaListener(topics = TOPIC_ROOM + ".exit", groupId = "room-exit")
    public void sendExit(Map<String, Object> response) {
        template.convertAndSend("/topic/room/exit/" + response.get("roomCode"), response.get("response"));
    }
}
