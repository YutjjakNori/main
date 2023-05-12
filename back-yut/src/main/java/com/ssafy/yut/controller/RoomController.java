package com.ssafy.yut.controller;

import com.ssafy.yut.dto.ReadyDto;
import com.ssafy.yut.dto.RoomDto;
import com.ssafy.yut.service.RoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 대기방 관련 Controller
 *
 * @author 김정은
 * @author 이준
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

    /**
     * 방 입장 : 검사
     *
     * @param roomDto
     * @return
     */
    @PostMapping("/entry")
    public ResponseEntity<?> enterRoom(@RequestBody RoomDto.RoomCode roomDto) {
        return ResponseEntity.ok(roomService.enterRoom(roomDto));
    }

    /**
     * 방 입장 요청
     *
     * @param request
     */
    @MessageMapping("/enter")
    public void enterRoom(@RequestBody RoomDto.WaitingRequest request) {
        roomService.enterRoom(request);
    }

    /**
     * 준비 상태 변경
     *
     * @param request
     */
    @MessageMapping("/preparation")
    public void readyGame(@RequestBody ReadyDto.Request request) {
        roomService.readyGame(request);
    }
}
