package com.ssafy.yut.service;

import com.ssafy.yut.dto.ChatDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

/**
 * 채팅 관련 Service
 *
 * @author 김정은
 */

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatService {

    private static final String TOPIC = "chat", GROUP_ID = "yut";
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final SimpMessageSendingOperations template;

    /**
     * STOMP로 받은 메시지를 Kafka로 보내기
     *
     * @param message 유저가 작성한 매시지
     */
    public void sendMessage(ChatDto.Request message){
        kafkaTemplate.send(TOPIC, message.getRoomCode(), message);
    }

    /**
     * Kafka로 받은 메시지를 클라이언트로 보내기
     *
     * @param message 유저가 받은 메시지
     */
    @KafkaListener(topics = TOPIC, groupId = GROUP_ID)
    public void readMessage(ChatDto.Request message){
        template.convertAndSend("/topic/chat/" + message.getRoomCode(),
                ChatDto.Response.builder()
                        .type(message.getType())
                        .userId(message.getUserId())
                        .content(message.getContent())
                        .build());
    }
}
