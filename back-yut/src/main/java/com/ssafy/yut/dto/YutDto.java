package com.ssafy.yut.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 윷 던지기 DTO
 *
 * @author 김정은
 */
public class YutDto {

    /**
     * 윷 던지기 요청
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request extends RequestDto{
        private boolean last;
    }

    /**
     * 윷 던진 후 응답
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response{
        private String userId;
        private String result;
    }
}
