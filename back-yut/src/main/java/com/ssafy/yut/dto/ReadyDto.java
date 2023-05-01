package com.ssafy.yut.dto;

import lombok.*;

/**
 * 준비 상태
 *
 * @author 이준
 */
public class ReadyDto {


    /**
     * 준비 요청
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        private String userId;
        private boolean ready;
        private String roomCode;
    }

    /**
     * 준비 응답
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private String userId;
        private boolean ready;
        private boolean start;
    }
}
