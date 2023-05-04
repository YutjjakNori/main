package com.ssafy.yut.controller;

import com.ssafy.yut.dto.GameDto;
import com.ssafy.yut.dto.PieceDto;
import com.ssafy.yut.dto.RequestDto;
import com.ssafy.yut.dto.YutDto;
import com.ssafy.yut.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 게임 관련 Controller
 *
 * @author 김정은
 * @author 이준
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
    @MessageMapping("start")
    public void startGame(GameDto.Request request) {
        gameService.startGame(request);
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
     * 이벤트 실행하기
     *
     * @param request
     */
    @MessageMapping("/event")
    public void event(RequestDto request) { gameService.occurrenceEvent(request); }

}
