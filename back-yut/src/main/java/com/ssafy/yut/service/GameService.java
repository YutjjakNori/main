package com.ssafy.yut.service;

import com.ssafy.yut.dto.*;
import com.ssafy.yut.entity.Game;
import com.ssafy.yut.entity.GameUser;
import com.ssafy.yut.util.RedisMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 게임 관련 Service
 *
 * @author 이준
 * @author 김정은
 * @author 박소연
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GameService {

    private final RedisMapper redisMapper;
    private final String TOPIC = "game";
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final SimpMessageSendingOperations template;

    /**
     * 게임 시작 요청
     *
     * @param request 게임 시작
     */
    public void startGame(GameDto.Request request, Message<?> message) {
        String sessionId = StompHeaderAccessor.wrap(message).getSessionId();
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
        response.put("sessionId", sessionId);
        response.put("response", gameStartResponse);

        kafkaTemplate.send(TOPIC + ".start", response);
    }

    /**
     * 게임 시작 응답
     *
     * @param response
     */
    @KafkaListener(topics = TOPIC + ".start", groupId = "game-start")
    public void startGame(Map<String, Object> response) {
        log.info("Game Start Send To : " + response.get("roomCode"));
        template.convertAndSend("/topic/game/start/"+response.get("sessionId"), response.get("response"));
    }

    /**
     * kafka로 전송
     *
     * @param request
     */
    public void yut(YutDto.Request request){
        kafkaTemplate.send(TOPIC + ".yut", request);
    }

    /**
     * 윷 던지기
     *
     * @param request
     */
    @KafkaListener(topics = TOPIC + ".yut", groupId = "game-yut")
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
        } else if(random > 50 && random <= 90) {
            result = "걸";
        } else if(random > 90 && random <= 98) {
            result = "윷";
        } else {
            result = "모";
        }

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
        kafkaTemplate.send(TOPIC + ".turn", request);
    }

    /**
     * 턴 돌리기 응답
     *
     * @param request
     */
    @KafkaListener(topics = TOPIC + ".turn", groupId = "game-turn")
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
        // 말 상태
        Map<String, Object> response = new HashMap<>();
        PieceDto.Response pieceResponse;
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("userId", request.getUserId());

        // 이동 경로
        List<Integer> move = new ArrayList<>();
        // type : 1 말 이동, 2 말 잡기, 3 말 합치기, 4 말 동나기.
        int type = 1;

        String roomCode = request.getRoomCode();
        log.info("Piece Move From : " + roomCode);
        String key = "game:" + roomCode;

        // request
        int direction = request.getDirection();
        int plateNum = request.getPlateNum();
        int yut = request.getYut();
        List<Integer> selectPieces = request.getSelectPiece();

        Game game = redisMapper.getData(key, Game.class);
        List<GameUser> gameUsers = game.getUsers();
        int turnUserIndex = gameUsers.indexOf(GameUser.builder().userId(request.getUserId()).build());
        GameUser turnUser = game.getUsers().get(turnUserIndex);
        List<Integer> turnUserPieces = turnUser.getPieces();

        Set<Integer> event = game.getEvent();
        Map<Integer, List<Integer>> plate = game.getPlate();
        // 선택한 말이 있는 위치에서 말 지우기
        List<Integer> movePieces = plate.remove(plateNum);

        // 모서리에서 방향 선택하기
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
                            move.add(0);
                            continue;
                        }
                        // 말 동나기
                        else if((plateNum + path) > 20) {
                            move.add(-1);
                            break;
                        }
                        move.add(plateNum + path);
                    }
                    // 이동한 위치
                    plateNum = (plateNum + yut < 20) ? plateNum + yut : (plateNum + yut == 20) ? 0 : -1;
                    break;
                }

            // 좌하 ↙
            case 2:
                // 우상단 모서리
                if(plateNum == 5) {
                    plateNum += 14;
                    log.info("right down : " + String.valueOf(plateNum));
                    for(int path = 1; path <= yut; path++) {
                        move.add(plateNum + path);
                    }
                    // 이동한 위치
                    plateNum += yut;
                    log.info("Final PlateNum : " + String.valueOf(plateNum));
                    break;
                }

                // 중앙
                else if(plateNum == 27) {
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
                plateNum = plateNum + yut >= 25 ? (plateNum +yut) - 10  : plateNum + yut;
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
                else if(plateNum == 22) {
                    plateNum = 27;
                }

                for(int path = 1; path <= yut; path++) {
                    // 0번 도착
                    if((plateNum + path) == 30) {
                        move.add(0);
                        continue;
                    }
                    // 말 동나기
                    else if((plateNum + path) > 30) {
                        move.add(-1);
                        break;
                    }
                    move.add(plateNum + path);
                }
                // 이동한 위치
                plateNum = (plateNum + yut < 30) ? plateNum + yut : (plateNum + yut == 30) ? 0 : -1;
                break;
        }

        // 이동 끝 응답하기
        data.put("userId", request.getUserId());
        data.put("move", move);
        data.put("event", event.contains(plateNum));

        // 말 동나기
        if(plateNum == -1) {
            type = 4;
            data.put("selectPiece", selectPieces);
            boolean end = true;

            // 윷 판에서 말지우고 완주상태로 바꾸기
            for(Integer finishPiece : selectPieces) {
                turnUserPieces.set(finishPiece - 1, 0);
            }

            for(Integer piece : turnUserPieces) {
                if(piece != 0) {
                    end = false;
                    break;
                }
            }
            data.put("end", end);
        }
        // 말이 동나는 경우 아닐 때
        else {
            // 시작 전인 말 시작으로 바꿔주기
            if(selectPieces.size() == 1 && turnUserPieces.get(selectPieces.get(0) - 1) == -1) {
                turnUserPieces.set(selectPieces.get(0) - 1, 1);
            }

            List<Integer> piecesInPlate;
            // 윷판에 말이 있는 지 검사 -> get()은 없으면 NullPointException
            // 있으면 내 말인지 아닌지 판단
            if(plate.containsKey(plateNum)) {
                // 이동 위치의 말 정보 가져오기
                piecesInPlate = plate.get(plateNum);
                int pieceIndexInPlate = piecesInPlate.get(0) / 3;

                // 내 말이 아닐 때
                if(pieceIndexInPlate != turnUserIndex) {
                    type = 2;
                    String caughtUserId = gameUsers.get(pieceIndexInPlate).getUserId();
                    data.put("caughtUserId", caughtUserId);
                    List<Integer> caughtPieces = new ArrayList<>();
                    // 이동 위치의 말 시작 전 상태로 돌리기.
                    for(Integer pieceInPlate : piecesInPlate) {
                        int caughtPiece = pieceInPlate % 3;
                        gameUsers.get(pieceIndexInPlate).getPieces().set(caughtPiece, -1);
                        caughtPieces.add(caughtPiece + 1);
                    }

                    data.put("caughtPiece", caughtPieces);
                    piecesInPlate.clear();

                    // 선택된 말 이동 위치에 옮기기.
                    for(Integer selectPiece : selectPieces) {
                        piecesInPlate.add((turnUserIndex * 3) + (selectPiece - 1));
                    }
                }

                // 내 말일때
                else {
                    type = 3;
                    // 이동 위치에 선택한 말 합치기
                    for(Integer platePiece : piecesInPlate) {
                        selectPieces.add((platePiece % 3) + 1);
                    }
                    piecesInPlate.clear();

                    // 선택된 말 이동 위치에 옮기기.
                    for(Integer selectPiece : selectPieces) {
                        piecesInPlate.add((turnUserIndex * 3) + (selectPiece - 1));
                    }
                }
            }
            // 없으면 말 이동한다.
            else {
                piecesInPlate = new ArrayList<>();
                for(Integer selectPiece : selectPieces) {
                    piecesInPlate.add((turnUserIndex * 3) + (selectPiece - 1));
                }
            }
            data.put("selectPiece", selectPieces);
            plate.put(plateNum, piecesInPlate);

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
        kafkaTemplate.send(TOPIC + ".piece", response);
    }

    /**
     * 말 이동 응답
     *
     * @param response
     */
    @KafkaListener(topics = TOPIC + ".piece", groupId = "game-piece")
    public void movePiece(Map<String, Object> response) {
        log.info("Piece Move To : " + response.get("roomCode"));
        template.convertAndSend("/topic/game/piece/" + response.get("roomCode"), response.get("response"));
    }

    /**
     * 이벤트 발생하기
     *
     * @param request
     */
    public void occurrenceEvent(RequestDto request) {
        // 이벤트 종류 : 0:꽝, 1:한번 던지기, 2:말 업고가기, 3:출발했던 자리로, 4:처음으로 돌아가기
        log.info("Event - Occurrence : " + request.getRoomCode() + ", " + request.getUserId());

        // 이벤트 발생
        Random random = new Random();
        random.setSeed(System.currentTimeMillis());

        // TODO : 모든 이벤트 사용하기
        // 이벤트 종류 : 0:꽝, 1:한번 던지기, 4:처음으로 돌아가기
        int eventNum = random.nextInt(3);
        if (eventNum == 2) {
            eventNum = 4;
        }

        // 이벤트 발생한 것 카프카로 보내기
        kafkaTemplate.send(TOPIC + ".event",
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
    @KafkaListener(topics = TOPIC + ".event", groupId = "game-event")
    public void sendEvent(EventDto.response eventDto) {
        log.info("Event - Occurrence Send : roomCode(" + eventDto.getRoomCode() + "), userId(" + eventDto.getUserId() + "), eventNum(" + eventDto.getEvent() + ")");
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
        log.info("Event - Execute : " + request.getRoomCode() + ", " + request.getUserId());

        // 게임 데이터 들고오기
        String key = "game:" + request.getRoomCode();
        Game game = redisMapper.getData(key, Game.class);
        // 게임 이용자 중 해당 유저 들고오기
        List<GameUser> gameUsers = game.getUsers();
        GameUser gameUser = GameUser.builder().userId(request.getUserId()).build();
        int turnUserIndex = gameUsers.indexOf(gameUser);
        gameUser = gameUsers.get(turnUserIndex);    // 해당 turn의 유저

        List<Integer> resultPieceRedis = new ArrayList<>();   // 반환값 : selectPiece
        List<Integer> resultPieceKafka = new ArrayList<>();   // 반환값 : selectPiece
        int move = -1;  // 반환값 : move (이동 위치)

        if (request.getEvent() == 0) {
            // event == 0 -> 말 업고 가기

            int pieceIndex = -1;    // 얹힐 말의 인덱스
            // 말 업고가기 - 말 사용 상태 변경
            for (int i = 0; i < 3; i++) {
                if (gameUser.getPieces().get(i) == -1) {
                    // 말 상태가 사용전이라면
                    pieceIndex = i;
                    break;
                }
            }
            gameUser.getPieces().set(pieceIndex, 1);    // 해당 말 사용 중으로 변경
            int resultPieceIndex = turnUserIndex * 3 + pieceIndex;    // 말 인덱스를 사용해 실제 말 번호 가져오기

            // 말 업고가기 - 위치 변경 (Redis ver)
            resultPieceRedis = game.getPlate().get(request.getPlateNum()).stream().collect(Collectors.toList());
            resultPieceRedis.add(resultPieceIndex);

            // 변경 데이터 반영하기
            game.getPlate().replace(request.getPlateNum(), resultPieceRedis);
            gameUsers.set(turnUserIndex, gameUser);
            game.setUsers(gameUsers);

            // 말 업고가기 - 위치 변경 (Kafka ver)
            resultPieceKafka = request.getSelectPiece().stream().collect(Collectors.toList());
            resultPieceKafka.add(pieceIndex + 1);
        } else {
            // event == 1 -> 자리 이동

            if (request.getPrevPosition() == -1) {
                // 말 상태를 사용전으로 바꿔야 하는 경우

                // 말이 위치한 자리(이벤트 칸)를 삭제
                game.getPlate().remove(request.getPlateNum());
                // 해당 말의 상태를 시작 전으로 되돌리기
                resultPieceRedis = request.getSelectPiece();
                for (int piece : resultPieceRedis) {
                    gameUser.getPieces().set(piece - 1, -1); // 해당 말 시작 전으로 변경
                }
                // 변경 데이터 반영하기
                gameUsers.set(turnUserIndex, gameUser);
                game.setUsers(gameUsers);
            } else {
                // 말이 출발했던 자리로 이동하는 경우

                // 기존 이벤트 위치에서 말 없애기
                resultPieceRedis = game.getPlate().get(request.getPlateNum());
                game.getPlate().remove(request.getPlateNum());
                // 출발 했던 자리로 이동
                move = request.getPrevPosition();
                // 출발 했던 자리로 이동 (Redis ver)
                game.getPlate().put(move, resultPieceRedis);
            }
            // 처음으로 이동 (Kafka ver) || 출발 했던 자리로 이동 (Kafka ver)
            resultPieceKafka = request.getSelectPiece();
        }

        // 변경 데이터 redis로 저장하기
        redisMapper.saveData(key, game);
        // 변경 데이터 kafka로 보내기
        kafkaTemplate.send(TOPIC + ".eventResult",
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
    @KafkaListener(topics = TOPIC + ".eventResult", groupId = "game-eventResult")
    public void sendEventResult(EventDto.responseResult eventDto) {
        log.info("Event - Execute Send : roomCode(" + eventDto.getRoomCode() + "), userId(" + eventDto.getUserId() + "), eventNum(" + eventDto.getEvent() + ")");
        template.convertAndSend("/topic/game/event/result/" + eventDto.getRoomCode(), eventDto);
    }

}
