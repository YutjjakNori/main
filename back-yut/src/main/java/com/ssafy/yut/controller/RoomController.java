package com.ssafy.yut.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 대기방 관련 컨트롤러
 *
 * @author 이준
 */
@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/room")
public class RoomController {

    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/entry")
    public void enterRoom(@RequestBody String roomCode) {

        simpMessagingTemplate.convertAndSend("/sub/");

    }
}
