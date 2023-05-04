package com.ssafy.yut.dto;

import lombok.*;

/**
 * 준비 DTO
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
    public static class Request extends RequestDto{
        private boolean ready;
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
