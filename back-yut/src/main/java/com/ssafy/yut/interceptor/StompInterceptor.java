package com.ssafy.yut.interceptor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

/**
 * HandShake 인터셉터
 * 
 * @author 이준
 */
@Slf4j
@Component
public class StompInterceptor implements ChannelInterceptor {

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        String sessionId = (String) message.getHeaders().get("simpSessionId");

        if (StompCommand.CONNECT == accessor.getCommand()) {
            // TODO: 연결 요청 시 토큰 검사. -> 스프링 시큐리티를 통해서 필터처리?
            log.info(accessor.toString());
        }

        else if (StompCommand.SUBSCRIBE == accessor.getCommand()) {
            // TODO: 구독 시 알림 메시지
            log.info(accessor.toString());
        }

        else if (StompCommand.DISCONNECT == accessor.getCommand()) {
            log.info(accessor.toString());
        }
        return message;
    }

}
