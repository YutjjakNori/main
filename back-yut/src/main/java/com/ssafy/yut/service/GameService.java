package com.ssafy.yut.service;

import com.ssafy.yut.dto.ChatDto;
import com.ssafy.yut.dto.ChatType;
import com.ssafy.yut.dto.GameDto;
import com.ssafy.yut.dto.PieceDto;
import com.ssafy.yut.dto.RequestDto;
import com.ssafy.yut.dto.TurnDto;
import com.ssafy.yut.dto.YutDto;
import com.ssafy.yut.entity.Game;
import com.ssafy.yut.entity.GameUser;
import com.ssafy.yut.util.RedisMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 게임 관련 Service
 *
 * @author 이준
 * @author 김정은
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GameService {

    private final RedisMapper redisMapper;
    private final String TOPIC = "game", GROUP_ID = "yut";
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final SimpMessageSendingOperations template;

    /**
     * 게임 시작 요청
     *
     * @param request 게임 시작
     */
    public void startGame(GameDto.Request request) {
        Map<String, Object> response = new HashMap<>();
        String roomCode = request.getRoomCode();
        String key = "game:" + roomCode;

        Game game = redisMapper.getData(key, Game.class);

        List<GameUser> gameUsers = game.getUsers();
        List<GameDto.User> users = new ArrayList<>();
        for(GameUser gameUser : gameUsers) {
            users.add(GameDto.User.builder()
                    .id(gameUser.getUserId())
                    .pieceNum(gameUser.getPieces())
                    .build());
        }

        GameDto.Response gameStartResponse = GameDto.Response.builder()
                .users(users)
                .event(game.getEvent())
                .build();
        response.put("roomCode", roomCode);
        response.put("response", gameStartResponse);

        kafkaTemplate.send("chat", roomCode,
                ChatDto.Request.builder()
                        .type(ChatType.SYSTEM)
                        .userId("SYSTEM")
                        .roomCode(roomCode)
                        .content("게임을 시작합니다!")
                        .build());
        kafkaTemplate.send(TOPIC + ".start", roomCode, response);
    }

    /**
     * 게임 시작 응답
     *
     * @param response
     */
    @KafkaListener(topics = TOPIC + ".start", groupId = GROUP_ID)
    public void startGame(Map<String, Object> response) {
        template.convertAndSend("/topic/game/start"+response.get("roomCode"), response.get("response"));
    }

    /**
     * kafka로 전송
     *
     * @param request
     */
    public void yut(RequestDto request){
        kafkaTemplate.send(TOPIC + ".yut", request.getRoomCode(), request);
    }

    /**
     * 윷 던지기
     *
     * @param request
     */
    @KafkaListener(topics = TOPIC + ".yut", groupId = GROUP_ID)
    public void throwYut(RequestDto request){
        int random = (int)(Math.random() * 100);
        log.info(String.valueOf(random));

        // 도 15%, 개 35%, 걸 35%, 윷 13%, 모 3%
        String result = "";
        if(random > 0 && random <= 15){
            result = "도";
        } else if(random > 15 && random <= 50) {
            result = "개";
        } else if(random > 50 && random <= 85) {
            result = "걸";
        } else if(random > 85 && random <= 98) {
            result = "윷";
        } else {
            result = "모";
        }
        kafkaTemplate.send("chat", request.getRoomCode(),
                ChatDto.Request.builder()
                        .type(ChatType.SYSTEM)
                        .userId(request.getUserId())
                        .roomCode(request.getRoomCode())
                        .content("["+ result + "]을(를) 던졌습니다.")
                        .build());
        template.convertAndSend("/topic/game/stick/" + request.getRoomCode(),
                YutDto.Response.builder()
                        .userId(request.getUserId())
                        .result(result)
                        .build());
    }

    /**
     * 턴 돌리기 메시지 요청
     *
     * @param request
     */
    public void getTurn(RequestDto request){
        kafkaTemplate.send("chat", request.getRoomCode(),
                ChatDto.Request.builder()
                        .type(ChatType.SYSTEM)
                        .userId(request.getUserId())
                        .roomCode(request.getRoomCode())
                        .content("차례입니다.")
                        .build());
        kafkaTemplate.send(TOPIC + ".turn", request.getRoomCode(), request);
    }

    /**
     * 턴 돌리기 응답
     *
     * @param request
     */
    @KafkaListener(topics = TOPIC + ".turn", groupId = GROUP_ID)
    public void sendTurn(RequestDto request){
        template.convertAndSend("/topic/game/turn/" + request.getRoomCode(),
                TurnDto.builder()
                        .userId(request.getUserId())
                        .build());
    }

    /**
     * 말 이동
     *
     * @param request
     */
    public void actPiece(PieceDto.Request request) {
        // 1번 0, 1, 2 | 2번 3, 4, 5 | 3번 6, 7, 8 | 4번 9, 10, 11
        // type : 1 말 이동, 2 말 잡기, 3 말 합치기, 4 말 동나기.
        Map<String, Object> response = new HashMap<>();
        PieceDto.Response pieceResponse;
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("userId", request.getUserId());
        List<Integer> move = new ArrayList<>();
        int type = 1;

        String roomCode = request.getRoomCode();
        String key = "game:" + roomCode;
        int direction = request.getDirection();
        int plateNum = request.getPlateNum();
        int orgPlate = plateNum;
        int yut = request.getYut();
        List<Integer> selectPieces = request.getSelectPiece();

        Game game = redisMapper.getData(key, Game.class);
        List<GameUser> gameUsers = game.getUsers();
        Set<Integer> event = game.getEvent();
        Map<Integer, List<Integer>> plate = game.getPlate();
        GameUser gameUser = new GameUser(request.getUserId(), null);
        int index = gameUsers.indexOf(gameUser);
        List<Integer> pieces = gameUsers.get(index).getPieces();

        switch (direction) {
            // 순행
            case 1:
                // 선택된 말이 시작 전일 때
                if(plateNum == -1) {
                    plateNum = 0;
                    move.add(plateNum);
                    for(int path = 1; path <= yut; path++) {
                        move.add(plateNum + path);
                    }
                    // 이동한 위치
                    plateNum = yut;
                    break;
                }

                // 동나기 직전
                else if(plateNum == 0) {
                    // 이동한 위치
                    plateNum = -1;
                    move.add(-1);
                    break;
                }

                // 선택된 말이 시작 중 일때 1 ~ 14
                else if(plateNum > 0 && plateNum < 15){
                    for(int path = 1; path <= yut; path++) {
                        move.add(plateNum + path);
                    }
                    // 이동한 위치
                    plateNum += yut;
                    break;
                }

                // 선택된 말이 시작 중 일때 15 ~
                else if(plateNum >= 15) {
                    for(int path = 1; path <= yut; path++) {
                        // 0번 도착
                        if((plateNum + path) == 20) {
                            plateNum = 0;
                            move.add(0);
                            continue;
                        }
                        // 말 동나기
                        else if((plateNum + path) > 20) {
                            plateNum = -1;
                            move.add(-1);
                            break;
                        }
                        move.add(plateNum + path);
                    }
                }
                // 이동한 위치
                plateNum = (plateNum == 0 || plateNum == -1) ? plateNum : plateNum + yut;
                break;

            // 좌하 ↙
            case 2:
                // 우상단 모서리
                if(plateNum == 5) {
                    plateNum += 14;
                    for(int path = 1; path <= yut; path++) {
                        move.add(plateNum + path);
                    }
                    // 이동한 위치
                    plateNum += yut;
                    break;
                }

                // 중앙
                else if(plateNum == 22 || plateNum == 27) {
                    plateNum = 22;
                }

                for(int path = 1; path <= yut; path++) {
                    if((plateNum + path) >= 25) {
                        move.add((plateNum + path) - 10);
                        continue;
                    }
                    move.add(plateNum + path);
                }
                // 이동한 위치
                plateNum = plateNum + yut >= 25 ? (plateNum - 10) + yut  : plateNum + yut;
                break;

            // 우하 ↘
            case 3:
                // 좌상단 모서리
                if(plateNum == 10) {
                    plateNum += 14;
                    for(int path = 1; path <= yut; path++) {
                        move.add(plateNum + path);
                    }
                    // 이동한 위치
                    plateNum += yut;
                    break;
                }

                // 중앙
                else if(plateNum == 22 || plateNum == 27) {
                    plateNum = 27;
                }

                for(int path = 1; path <= yut; path++) {
                    // 0번 도착
                    if((plateNum + path) == 30) {
                        plateNum = 0;
                        move.add(0);
                        continue;
                    }
                    // 말 동나기
                    else if((plateNum + path) > 30) {
                        plateNum = -1;
                        move.add(-1);
                        break;
                    }
                    move.add(plateNum + path);
                }
                // 이동한 위치
                plateNum = (plateNum == 0 || plateNum == -1) ? plateNum : plateNum + yut;
                break;
        }
        // 이동 끝 응답하기

        // 말 동나기
        if(plateNum == -1) {
            List<Integer> finishPieces = plate.remove(orgPlate);

            type = 4;
            data.put("userId", request.getUserId());
            data.put("selectPiece", selectPieces);
            data.put("move", move);
            pieceResponse = PieceDto.Response.builder()
                    .type(type)
                    .data(data)
                    .build();
        }

        List<Integer> platePieces = plate.get(yut);
        // 이동할 윷판 위치에 말이 있는 경우
        if(platePieces != null) {
            int platePiece = platePieces.get(0);

            // 내 말이 아닐 때
            if((platePiece / 3) != index) {
                // 윷판에 있는 말 지우기 -> 시작 전 상태로 돌리기.
                for(Integer removePieces : platePieces) {
                    gameUsers.get(removePieces / 3).getPieces().set(removePieces % 3, -1) ;
                }
                platePieces.clear();
            }
        }
        // 이동할 윷판 위치에 말이 없는 경우
        else {
            // 윷판 위치에 말 추가.
            platePieces = new ArrayList<>();
        }
        platePieces.add((index * 3) + (selectPieces.get(0) - 1));
        plate.put(yut, platePieces);
    }
}
