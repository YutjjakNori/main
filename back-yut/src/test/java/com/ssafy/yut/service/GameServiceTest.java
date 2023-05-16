package com.ssafy.yut.service;

import com.ssafy.yut.dto.ChatDto;
import com.ssafy.yut.dto.EventDto;
import com.ssafy.yut.dto.RequestDto;
import com.ssafy.yut.entity.Game;
import com.ssafy.yut.entity.GameUser;
import com.ssafy.yut.util.RedisMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;

import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // @Mock 어노테이션을 사용하려면 Mockito 테스트 실행을 확장
@DisplayName("Game 서비스 테스트")
public class GameServiceTest {
    private static final String TOPIC = "game", GROUP_ID = "yut", USER_ID = "userTest", ROOM_CODE = "codeTest";

    @Mock
    private RedisMapper redisMapper;
    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;
    @Mock
    private SimpMessageSendingOperations template;

    @InjectMocks
    private GameService gameService;

    @Nested
    @DisplayName("Event 발생")
    public class Event1 {

        @Test
        @DisplayName("발생하기")
        public void occurrenceEvent() {
            // when
            gameService.occurrenceEvent(new RequestDto(USER_ID, ROOM_CODE));

            // then
            verify(kafkaTemplate, times(1)).send(eq(TOPIC + ".event"), any(EventDto.response.class));
        }

        @Test
        @DisplayName("발생 보내기")
        public void sendEvent() {
            // when
            gameService.sendEvent(
                    EventDto.response.builder()
                            .userId(USER_ID)
                            .roomCode(ROOM_CODE)
                            .event(0)
                            .build());

            // then
            verify(template, times(1)).convertAndSend(eq("/topic/game/event/" + ROOM_CODE), any(EventDto.response.class));
        }
    }

    @Nested
    @DisplayName("Event 실행")
    public class Event2 {

        @Nested
        @DisplayName("실행하기")
        public class executeEvent {

            @Test
            @DisplayName("말 업고가기")
            public void executeEvent1() {
                // given
                List<Integer> pieces = new ArrayList<>();
                pieces.add(-1);
                pieces.add(-1);
                pieces.add(1);
                GameUser gameUser = GameUser.builder()
                        .userId(USER_ID)
                        .nickName("testUser")
                        .pieces(pieces)
                        .build();
                List<GameUser> users = new ArrayList<>();
                users.add(gameUser);
                Set<Integer> event = null;
                Map<Integer, List<Integer>> plate = new HashMap<>();
                plate.put(2, List.of(1, 2));
                Game game = Game.builder()
                        .users(users)
                        .gameStatus("start")
                        .event(event)
                        .plate(plate)
                        .build();

                doReturn(game).when(redisMapper).getData("game:"+ROOM_CODE, Game.class);

                // when
                gameService.executeEvent(EventDto.requestResult.builder()
                        .roomCode(ROOM_CODE)
                        .userId(USER_ID)
                        .event(0)
                        .plateNum(2)
                        .selectPiece(List.of(1, 2))
                        .prevPosition(1)
                        .build());

                // then
                verify(redisMapper, times(1)).saveData(eq(ROOM_CODE), any(Game.class));
                verify(kafkaTemplate, times(1)).send(eq(TOPIC + ".eventResult"), any(EventDto.responseResult.class));
            }

            @Test
            @DisplayName("자리 이동 - 출발했던 자리로")
            public void executeEvent2() {
                // given
                List<Integer> pieces = new ArrayList<>();
                pieces.add(-1);
                pieces.add(-1);
                pieces.add(1);
                GameUser gameUser = GameUser.builder()
                        .userId(USER_ID)
                        .nickName("testUser")
                        .pieces(pieces)
                        .build();
                List<GameUser> users = new ArrayList<>();
                users.add(gameUser);
                Set<Integer> event = null;
                Map<Integer, List<Integer>> plate = new HashMap<>();
                plate.put(2, List.of(1, 2));
                Game game = Game.builder()
                        .users(users)
                        .gameStatus("start")
                        .event(event)
                        .plate(plate)
                        .build();

                doReturn(game).when(redisMapper).getData("game:"+ROOM_CODE, Game.class);

                // when
                gameService.executeEvent(EventDto.requestResult.builder()
                        .roomCode(ROOM_CODE)
                        .userId(USER_ID)
                        .event(1)
                        .plateNum(2)
                        .selectPiece(List.of(1, 2))
                        .prevPosition(1)
                        .build());

                // then
                verify(redisMapper, times(1)).saveData(eq(ROOM_CODE), any(Game.class));
                verify(kafkaTemplate, times(1)).send(eq(TOPIC + ".eventResult"), any(EventDto.responseResult.class));
            }

            @Test
            @DisplayName("자리 이동 - 처음으로")
            public void executeEvent3() {
                // given
                List<Integer> pieces = new ArrayList<>();
                pieces.add(-1);
                pieces.add(-1);
                pieces.add(1);
                GameUser gameUser = GameUser.builder()
                        .userId(USER_ID)
                        .nickName("testUser")
                        .pieces(pieces)
                        .build();
                List<GameUser> users = new ArrayList<>();
                users.add(gameUser);
                Set<Integer> event = null;
                Map<Integer, List<Integer>> plate = new HashMap<>();
                plate.put(2, List.of(1, 2));
                Game game = Game.builder()
                        .users(users)
                        .gameStatus("start")
                        .event(event)
                        .plate(plate)
                        .build();

                doReturn(game).when(redisMapper).getData("game:"+ROOM_CODE, Game.class);

                // when
                gameService.executeEvent(EventDto.requestResult.builder()
                        .roomCode(ROOM_CODE)
                        .userId(USER_ID)
                        .event(1)
                        .plateNum(2)
                        .selectPiece(List.of(1, 2))
                        .prevPosition(-1)
                        .build());

                // then
                verify(redisMapper, times(1)).saveData(eq(ROOM_CODE), any(Game.class));
                verify(kafkaTemplate, times(1)).send(eq(TOPIC + ".eventResult"), any(EventDto.responseResult.class));
            }
            
        }

        @Test
        @DisplayName("실행 보내기")
        public void sendEventResult() {
            // when
            gameService.sendEventResult(
                    EventDto.responseResult.builder()
                            .roomCode(ROOM_CODE)
                            .build());

            // then
            verify(template, times(1)).convertAndSend(eq("/topic/game/event/result/" + ROOM_CODE), any(EventDto.responseResult.class));
        }
    }

}
