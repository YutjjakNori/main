package com.ssafy.yut.service;

import com.ssafy.yut.dto.YutDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

/**
 * 게임 관련 Service
 *
 * @author 김정은
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GameService {

    private static final String TOPIC = "game", GROUP_ID = "yut";
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final SimpMessageSendingOperations template;

    /**
     * kafka로 전송
     *
     * @param request
     */
    public void yut(YutDto.Request request){
        kafkaTemplate.send(TOPIC, request.getRoomCode(), request);
    }

    /**
     * 윷 던지기
     *
     * @param request
     */
    @KafkaListener(topics = TOPIC, groupId = GROUP_ID)
    public void throwYut(YutDto.Request request){
        int random = (int)(Math.random() * 100);
        log.info(String.valueOf(random));

        // 도 15%, 개 35%, 걸 35%, 윷 13%, 모 3%
        int result = 0;
        if(random > 0 && random <= 15){
            result = 1;
        } else if(random > 15 && random <= 50) {
            result = 2;
        } else if(random > 50 && random <= 85) {
            result = 3;
        } else if(random > 85 && random <= 98) {
            result = 4;
        } else {
            result = 5;
        }
        template.convertAndSend("/topic/game/stick/" + request.getRoomCode(),
                YutDto.Response.builder().userId(request.userId).result(result).build());
    }

}
