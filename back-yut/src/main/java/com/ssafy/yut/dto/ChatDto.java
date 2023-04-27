package com.ssafy.yut.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 채팅 DTO
 *
 * @author 김정은
 */

public class ChatDto {
    /**
     * 채팅 요청 메시지
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        private ChatType type;
        private String userId;
        private String roomCode;
        private String content;
    }

    /**
     * 채팅 응답 메시지
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response{
        private ChatType type;
        private String userId;
        private String content;
    }
}
