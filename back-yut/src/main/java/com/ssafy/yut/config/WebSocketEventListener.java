package com.ssafy.yut.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

/**
 * 웹소켓 이벤트 리스너
 *
 * @author 이준
 */
@Slf4j
@RequiredArgsConstructor
@Component
public class WebSocketEventListener {

    /**
     * 세션 연결 이벤트
     *
     * @param event
     */
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {

        log.info("핸드 쉐이크 후 작동 : 연결 시작 이벤트 작동");

    }

    /**
     * 세션 끊김 이벤트
     *
     * @param event
     */
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();

        log.info("연결 종료 이벤트 작동 : 연결 종료 이벤트 작동");

    }
}
