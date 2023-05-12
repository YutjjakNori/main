package com.ssafy.yut.service;

import com.ssafy.yut.dto.ChatDto;
import com.ssafy.yut.dto.EventDto;
import com.ssafy.yut.dto.RequestDto;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

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
        public void occurrenceEvent () {
            gameService.occurrenceEvent(new RequestDto(USER_ID, ROOM_CODE));

            verify(kafkaTemplate, times(1)).send(eq("chat"), any(ChatDto.Request.class));
            verify(kafkaTemplate, times(1)).send(eq(TOPIC + ".event"), any(EventDto.response.class));
        }

        @Test
        @DisplayName("발생 보내기")
        public void sendEvent () {
            gameService.sendEvent(
                    EventDto.response.builder()
                            .userId(USER_ID)
                            .roomCode(ROOM_CODE)
                            .event(0)
                            .build());

            verify(template, times(1)).convertAndSend(eq("/topic/game/event/"+ROOM_CODE), any(EventDto.response.class));
        }
    }

}
