package com.ssafy.yut.controller;

import com.ssafy.yut.dto.*;
import com.ssafy.yut.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 게임 관련 Controller
 *
 * @author 김정은
 * @author 이준
 * @author 박소연
 */
@RestController
@RequiredArgsConstructor
@MessageMapping("/game")
public class GameController {

    private final GameService gameService;

    /**
     * 게임 시작
     * 
     * @param request
     */
    @MessageMapping("/start")
    public void startGame(GameDto.Request request, Message<?> message) {
        gameService.startGame(request, message);
    }

    /**
     * 윷 던지기
     *
     * @param request
     */
    @MessageMapping("/stick")
    public void throwYut(YutDto.Request request){
        gameService.yut(request);
    }

    /**
     * 턴 돌리기
     *
     * @param request
     */
    @MessageMapping("/turn")
    public void turn(RequestDto request){
        gameService.getTurn(request);
    }

    /**
     * 말 이동
     * 
     * @param request
     */
    @MessageMapping("/piece")
    public void movePiece(PieceDto.Request request) {
        gameService.actPiece(request);
    }

    /**
     * 이벤트 발생하기
     *
     * @param request
     */
    @MessageMapping("/event")
    public void event(RequestDto request) { gameService.occurrenceEvent(request); }

    /**
     * 이벤트 실행하기
     *
     * @param request
     */
    @MessageMapping("/event/result")
    public void eventResult(EventDto.requestResult request) { gameService.executeEvent(request); }

}
