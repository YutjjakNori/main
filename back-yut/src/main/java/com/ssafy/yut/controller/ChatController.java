package com.ssafy.yut.controller;

import com.ssafy.yut.dto.ChatDto;
import com.ssafy.yut.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 채팅 관련 Controller
 *
 * @author 김정은
 */
@RestController
@RequiredArgsConstructor
@MessageMapping("/chat")
public class ChatController {

    private final ChatService chatService;

    /**
     * 대기방과 게임할 때 채팅
     *
     * @param message 유저가 보낸 메시지
     */
    // TODO: RoomID가 맞을 때 채팅할 수 있도록
    @MessageMapping()
    public void chat(ChatDto message){
        chatService.sendMessage(message);
    }
}
