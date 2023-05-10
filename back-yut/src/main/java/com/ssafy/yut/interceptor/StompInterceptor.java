package com.ssafy.yut.interceptor;

import com.ssafy.yut.dto.ChatDto;
import com.ssafy.yut.dto.ChatType;
import com.ssafy.yut.dto.RoomDto;
import com.ssafy.yut.entity.Game;
import com.ssafy.yut.entity.GameUser;
import com.ssafy.yut.entity.User;
import com.ssafy.yut.service.RoomService;
import com.ssafy.yut.util.RedisMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.HashMap;
import java.util.Map;

/**
 * HandShake 인터셉터
 * 
 * @author 이준
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class StompInterceptor implements ChannelInterceptor {

    private final RedisMapper redisMapper;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT == accessor.getCommand()) {
            log.info(accessor.toString());
        }

        else if (StompCommand.SUBSCRIBE == accessor.getCommand()) {
            log.info(accessor.toString());
        }

        else if (StompCommand.DISCONNECT == accessor.getCommand()) {
            log.info(accessor.toString());
            Map<String, Object> response = new HashMap<>();
            String userId = (String) message.getHeaders().get("simpSessionId");
            User user = redisMapper.getData("user:" +  userId, User.class);
            String roomCode = user.getRoomCode();

            Game game = redisMapper.getData("game:" + roomCode, Game.class);

            if(game.getGameStatus().equals("start")) {
                game.getUsers().remove(new GameUser(userId, null));
            } else {
                game.getUsers().remove(new GameUser(userId, null));
            }

            redisMapper.deleteDate("user:" + userId);

            if(game.getUsers().size() == 0) {
                redisMapper.deleteDate(roomCode);
            }

            response.put("roomCode", roomCode);
            response.put("response", RoomDto.User.builder().userId(userId).build());
            kafkaTemplate.send("room" + ".exit", roomCode, response);
            kafkaTemplate.send("chat", roomCode,
                    ChatDto.Request.builder()
                            .type(ChatType.SYSTEM)
                            .userId(userId)
                            .roomCode(roomCode)
                            .content("님이 나갔습니다.")
                            .build());

        }
        return message;
    }

}
