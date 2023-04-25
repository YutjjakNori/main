package com.ssafy.yut.controller;

import com.ssafy.yut.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 대기방 관련 Controller
 *
 * @author 김정은
 */

@RestController
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @GetMapping("/api/room/made")
    public ResponseEntity<?> createRoom(){
        return ResponseEntity.ok(roomService.createRoom());
    }
}
