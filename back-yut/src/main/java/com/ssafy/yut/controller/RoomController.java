package com.ssafy.yut.controller;

import com.ssafy.yut.service.RoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 대기방 관련 Controller
 *
 * @author 김정은
 */

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/room")
@MessageMapping("/room")
@Slf4j
public class RoomController {

    private final RoomService roomService;

    /**
     * 방 생성하기
     *
     * @return 생성한 RoomCode
     */
    @GetMapping("/made")
    public ResponseEntity<?> createRoom(){
        return ResponseEntity.ok(roomService.createRoom());
    }
}
