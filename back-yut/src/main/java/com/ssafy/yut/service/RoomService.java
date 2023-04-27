package com.ssafy.yut.service;

import com.ssafy.yut.dto.ChatDto;
import com.ssafy.yut.dto.ReadyDto;
import com.ssafy.yut.dto.RequestDto;
import com.ssafy.yut.dto.RoomDto;
import com.ssafy.yut.entity.Game;
import com.ssafy.yut.entity.Room;
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

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

/**
 * 대기방 관련 Service
 *
 * @author 김정은
 */

@Service
@Slf4j
@RequiredArgsConstructor
public class RoomService {

    private final RedisMapper redisMapper;
    private final String TOPIC_ROOM = "room", TOPIC_CHAT = "chat", TOPIC_GAME = "GAME", GROUP_ID = "yut";
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
        Optional<Room> room = redisMapper.getData(roomDto.getRoomCode(), Room.class);

        if (room.isEmpty()) {
            throw new CustomException(ErrorCode.NOT_FOUND_ROOM);
        }

        else {
            Optional<Game> game = redisMapper.getData(roomDto.getRoomCode(), Game.class);

            // TODO: 게임 중, 종료 되었을 때 에러 던지기
        }

        return true;
    }

    public void enterRoom(RequestDto enterDto) {
        log.info("Enter Room: " + enterDto);
        // TODO: Redis 조회 후 대기방 정보(대기인원, 준비 상태) 넘겨주기
        kafkaTemplate.send(TOPIC_ROOM, enterDto);
        kafkaTemplate.send(TOPIC_CHAT, new ChatDto());
    }

    public void readyGame(ReadyDto.ReadyRequest readyRequest) {
        Optional<Room> room = redisMapper.getData(readyRequest.getRoomCode(), Room.class);
        List<?> users = room.get().getUsers();
//        users.
    }

    @KafkaListener(topics = TOPIC_ROOM, groupId = GROUP_ID)
    public void announceRoomInfo(RequestDto enterDto) {
        log.info("Announce Enter Room : " + enterDto);
        template.convertAndSend("/topic/room/"+enterDto.getRoomCode(), enterDto);
    }
}
