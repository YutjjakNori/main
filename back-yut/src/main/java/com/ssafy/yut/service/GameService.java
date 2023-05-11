package com.ssafy.yut.service;

import com.ssafy.yut.dto.ChatDto;
import com.ssafy.yut.dto.ChatType;
import com.ssafy.yut.dto.EventDto;
import com.ssafy.yut.dto.GameDto;
import com.ssafy.yut.dto.PieceDto;
import com.ssafy.yut.dto.RequestDto;
import com.ssafy.yut.dto.UserDto;
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
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Random;

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
        log.info("Game Start From : " + roomCode);
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
        log.info("Game Start Send To : " + response.get("roomCode"));
        template.convertAndSend("/topic/game/start/"+response.get("roomCode"), response.get("response"));
    }

    /**
     * kafka로 전송
     *
     * @param request
     */
    public void yut(YutDto.Request request){
        kafkaTemplate.send(TOPIC + ".yut", request.getRoomCode(), request);
    }

    /**
     * 윷 던지기
     *
     * @param request
     */
    @KafkaListener(topics = TOPIC + ".yut", groupId = GROUP_ID)
    public void throwYut(YutDto.Request request){
        int number = 100;
        if(request.isLast()){
            number = 85;
        }
        int random = (int)(Math.random() * number);

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
                UserDto.builder()
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
        // 말 상태
        Map<String, Object> response = new HashMap<>();
        PieceDto.Response pieceResponse;
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("userId", request.getUserId());
        List<Integer> move = new ArrayList<>();
        int type = 1;

        String roomCode = request.getRoomCode();
        log.info("Piece Move From : " + roomCode);
        String key = "game:" + roomCode;
        int direction = request.getDirection();
        int plateNum = request.getPlateNum();
        int yut = request.getYut();
        List<Integer> selectPieces = request.getSelectPiece();

        Game game = redisMapper.getData(key, Game.class);
        List<GameUser> gameUsers = game.getUsers();
        GameUser turnUser = new GameUser(request.getUserId(), null);
        int turnUserIndex = gameUsers.indexOf(turnUser);
        turnUser.setPieces(gameUsers.get(turnUserIndex).getPieces());
        List<Integer> pieces = turnUser.getPieces();
        Set<Integer> event = game.getEvent();
        Map<Integer, List<Integer>> plate = game.getPlate();
        List<Integer> movePieces = plate.remove(plateNum);

        switch (direction) {
            // 순행
            case 1:
                // 선택된 말이 시작 전일 때
                if(plateNum == -1) {
                    for(int path = 0; path <= yut; path++) {
                        move.add(path);
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
        data.put("move", move);
        data.put("event", event.contains(plateNum));

        if(event.contains(plateNum)) {
            kafkaTemplate.send("chat", roomCode,
                    ChatDto.Request.builder()
                    .type(ChatType.SYSTEM)
                    .userId(request.getUserId())
                    .roomCode(roomCode)
                    .content("님이 이벤트 칸으로 이동했습니다.")
                    .build());
        }

        data.put("userId", request.getUserId());

        // 말 동나기
        if(plateNum == -1) {
            type = 4;
            data.put("selectPiece", selectPieces);
            boolean end = true;

            // 윷 판에서 말지우고 완주상태로 바꾸기
            for(Integer finishPiece : movePieces) {
                pieces.set(finishPiece - 1, 0);
            }

            for(Integer piece : pieces) {
                if(piece != 0) {
                    end = false;
                    break;
                }
            }


            data.put("end", end);
            if(end) {
                game.setGameStatus("end");
                kafkaTemplate.send("chat", roomCode,
                        ChatDto.Request.builder()
                        .type(ChatType.SYSTEM)
                        .userId(request.getUserId())
                        .roomCode(roomCode)
                        .content("님이 승리했습니다!")
                        .build());
            }
        }
        // 말이 동나는 경우 아닐 때
        else {
            // 시작 전인 말 시작으로 바꿔주기
            if(selectPieces.size() == 1 && pieces.get(selectPieces.get(0) - 1) == -1) {
                pieces.set(0, 1);
            }

            List<Integer> platePieces;
            // 윷판에 말이 있는 지 검사 -> get()은 없으면 NullPointException
            // 있으면 내 말인지 아닌지 판단
            if(plate.containsKey(plateNum)) {
                // 이동 위치의 말 정보 가져오기
                platePieces = plate.get(plateNum);
                int platePieceIndex = platePieces.get(0) / 3;

                // 내 말이 아닐 때
                if(platePieceIndex != turnUserIndex) {
                    type = 2;
                    String caughtUserId = gameUsers.get(platePieceIndex).getUserId();
                    data.put("caughtUserId", caughtUserId);
                    List<Integer> caughtPieces = new ArrayList<>();
                    // 이동 위치의 말 시작 전 상태로 돌리기.
                    for(Integer platePiece : platePieces) {
                        int caughtPiece = platePiece % 3;
                        gameUsers.get(platePieceIndex).getPieces().set(caughtPiece, -1);
                        caughtPieces.add(caughtPiece + 1);
                    }

                    data.put("caughtPiece", caughtPieces);
                    platePieces.clear();

                    // 선택된 말 이동 위치에 옮기기.
                    for(Integer selectPiece : selectPieces) {
                        platePieces.add((turnUserIndex * 3) + (selectPiece - 1));
                    }
                    data.put("selectPiece", selectPieces);
                    plate.put(plateNum, platePieces);

                    kafkaTemplate.send("chat", roomCode,
                            ChatDto.Request.builder()
                            .type(ChatType.SYSTEM)
                            .userId(request.getUserId())
                            .roomCode(roomCode)
                            .content("님의 말이 " + caughtUserId+ "님의 말을 잡았습니다!")
                            .build());
                }

                // 내 말일때
                else {
                    type = 3;
                    // 이동 위치에 선택한 말 합치기
                    for(Integer platePiece : platePieces) {
                        selectPieces.add((platePiece % 3) + 1);
                    }
                    platePieces.clear();

                    // 선택된 말 이동 위치에 옮기기.
                    for(Integer selectPiece : selectPieces) {
                        platePieces.add((turnUserIndex * 3) + (selectPiece - 1));
                    }
                    data.put("selectPiece", selectPieces);
                    plate.put(plateNum, platePieces);
                }
            }
            // 없으면 말 이동한다.
            else {
                platePieces = new ArrayList<>();
                for(Integer selectPiece : selectPieces) {
                    platePieces.add((turnUserIndex * 3) + (selectPiece - 1));
                }
                data.put("selectPiece", selectPieces);
                plate.put(plateNum, platePieces);
            }

        }

        game.setUsers(gameUsers);
        game.setPlate(plate);
        redisMapper.saveData(key, game);

        pieceResponse = PieceDto.Response.builder()
                .type(type)
                .data(data)
                .build();
        response.put("roomCode", roomCode);
        response.put("response", pieceResponse);
        kafkaTemplate.send(TOPIC + ".piece", roomCode, response);
    }

    /**
     * 말 이동 응답
     *
     * @param response
     */
    @KafkaListener(topics = TOPIC + ".piece", groupId = GROUP_ID)
    public void movePiece(Map<String, Object> response) {
        log.info("Piece Move To : " + response.get("roomCode"));
        template.convertAndSend("/topic/game/piece/" + response.get("roomCode"), response.get("responsemd" +
                ""));
    }

    /**
     * 이벤트 발생하기
     *
     * @param request
     */
    public void occurrenceEvent(RequestDto request) {
        // 이벤트 종류 : 0:꽝, 1:한번 던지기, 2:말 업고가기, 3:출발했던 자리로, 4:처음으로 돌아가기

        // 이벤트 발생
        Random random = new Random();
        random.setSeed(System.currentTimeMillis());

        int eventNum = random.nextInt(4);

        // 이벤트 발생한 것 카프카로 보내기
        kafkaTemplate.send(TOPIC + ".event", request.getRoomCode(),
                EventDto.response.builder()
                        .userId(request.getUserId())
                        .roomCode(request.getRoomCode())
                        .event(eventNum)
                        .build());
    }

    /**
     * 이벤트 발생 보내기
     *
     * @param eventDto
     */
    @KafkaListener(topics = TOPIC + ".event", groupId = GROUP_ID)
    public void sendEvent(EventDto.response eventDto) {
        template.convertAndSend("/topic/game/event/" + eventDto.getRoomCode(), eventDto);
    }

    /**
     * 이벤트 실행하기
     *
     * @param request
     */
    public void executeEvent(EventDto.requestResult request) {
        // 이벤트 실행하기
        // 0 : 말 업고가기 / 1 : 자리 이동 (출발했던 자리로, 시작 전으로)

        // 게임 데이터 들고오기
        Game game = redisMapper.getData(request.getRoomCode(), Game.class);
        // 게임 이용자 중 해당 유저 들고오기
        List<GameUser> gameUsers = game.getUsers();
        GameUser gameUser = new GameUser(request.getUserId(), null);
        int turnUserIndex = gameUsers.indexOf(gameUser);
        gameUser = gameUsers.get(turnUserIndex);    // 해당 turn의 유저
        List<Integer> resultPieceRedis = null;   // 반환값 : selectPiece
        List<Integer> resultPieceKafka = null;   // 반환값 : selectPiece
        int move = -1;  // 반환값 : move (이동 위치)

        if (request.getEvent() == 0) {
            // event == 0 -> 말 업고 가기

            int pieceIndex = -1;    // 얹힐 말의 인덱스
            // 말 업고가기 - 말 사용 상태 변경
            for (int i = 2; i >= 0; i--) {
                if (gameUser.getPieces().get(i) == -1) {
                    // 말 상태가 사용전이라면
                    pieceIndex = i;
                    break;
                }
            }
            gameUser.getPieces().set(pieceIndex, 1);    // 해당 말 사용 중으로 변경
            int resultPieceIndex = turnUserIndex * 3 + pieceIndex;    // 말 인덱스를 사용해 실제 말 번호 가져오기

            // 말 업고가기 - 위치 변경 (Redis ver)
            resultPieceRedis = game.getPlate().get(request.getPlateNum());
            resultPieceRedis.add(resultPieceIndex);

            // 변경 데이터 반영하기
            game.getPlate().replace(request.getPlateNum(), resultPieceRedis);
            gameUsers.set(turnUserIndex, gameUser);
            game.setUsers(gameUsers);

            // 말 업고가기 - 위치 변경 (Kafka ver)
            resultPieceKafka = request.getSelectPiece();
            resultPieceKafka.add(pieceIndex);
        } else {
            // event == 1 -> 자리 이동

            if (request.getPrevPosition() == -1) {
                // 말 상태를 사용전으로 바꿔야 하는 경우

                // 말이 위치한 자리(이벤트 칸)를 삭제
                game.getPlate().remove(request.getPlateNum());
                // 해당 말의 상태를 시작 전으로 되돌리기
                resultPieceRedis = request.getSelectPiece();
                for (int piece : resultPieceRedis) {
                    gameUser.getPieces().set(piece, -1); // 해당 말 시작 전으로 변경
                }
            } else {
                // 말이 출발했던 자리로 이동하는 경우

                // 기존 이벤트 위치에서 말 없애기
                resultPieceRedis = game.getPlate().get(request.getPlateNum());
                game.getPlate().remove(request.getPlateNum());
                // 출발 했던 자리로 이동 (Redis ver)
                game.getPlate().put(move, resultPieceRedis);
                // 출발 했던 자리로 이동 (Kafka ver)
                resultPieceKafka = request.getSelectPiece();
                // 출발 했던 자리로 이동
                move = request.getPrevPosition();
            }
        }

        // 변경 데이터 redis로 저장하기
        redisMapper.saveData(request.getRoomCode(), game);
        // 변경 데이터 kafka로 보내기
        kafkaTemplate.send(TOPIC + ".eventResult", request.getRoomCode(),
                EventDto.responseResult.builder()
                        .roomCode(request.getRoomCode())
                        .userId(request.getUserId())
                        .selectPiece(resultPieceKafka)
                        .event(request.getEvent())
                        .move(move)
                        .build());
    }

    /**
     * 이벤트 실행 보내기
     *
     * @param eventDto
     */
    @KafkaListener(topics = TOPIC + ".eventResult", groupId = GROUP_ID)
    public void sendEventResult(EventDto.responseResult eventDto) {
        template.convertAndSend("/topic/game/event/result/" + eventDto.getRoomCode(), eventDto);
    }

}
