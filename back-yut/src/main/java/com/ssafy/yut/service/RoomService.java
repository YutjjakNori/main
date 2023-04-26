package com.ssafy.yut.service;

import com.ssafy.yut.dto.RoomDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * 대기방 관련 Service
 *
 * @author 김정은
 */

@Service
@Slf4j
@RequiredArgsConstructor
public class RoomService {

    private static final String TOPIC = "room", GROUP_ID = "yut";
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

    public boolean enterRoom(RoomDto.RoomCode roomDto) {
        return true;
    }

    public void enterRoom(RoomDto.RequestEnter enterDto) {
        log.info("Enter Room: " + enterDto);
        // TODO: Redis 조회 후 대기방 정보(대기인원, 준비 상태) 넘겨주기
        kafkaTemplate.send(TOPIC, enterDto);
    }

    @KafkaListener(topics = TOPIC, groupId = GROUP_ID)
    public void announceRoom(RoomDto.RequestEnter enterDto) {
        log.info("Announce Enter Room : " + enterDto);
        template.convertAndSend("/topic/room/"+enterDto.getRoomCode(), enterDto);
    }
}
