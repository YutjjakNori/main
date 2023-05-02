package com.ssafy.yut.service;

import com.ssafy.yut.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import java.util.Random;

/**
 * 게임 관련 Service
 *
 * @author 김정은
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GameService {

    private final String TOPIC = "game", GROUP_ID = "yut";
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final SimpMessageSendingOperations template;

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
                EventDto.builder()
                        .userId(request.getUserId())
                        .roomCode(request.getRoomCode())
                        .event(eventNum)
                        .build());
    }

    /**
     * 이벤트 보내기
     *
     * @param EventDto
     */
    @KafkaListener(topics = TOPIC + ".event", groupId = GROUP_ID)
    public void sendEvent(EventDto eventDto) {
        template.convertAndSend("/topic/game/event" + eventDto.getRoomCode(), eventDto);
    }

}
