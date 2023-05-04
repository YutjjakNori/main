package com.ssafy.yut.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

/**
 * 말 이동 DTO
 *
 * @author 이준
 */
public class PieceDto {

    /**
     * 말 이동 요청
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request extends RequestDto{
        private List<Integer> selectPiece;
        private int plateNum;
        private int yut;
        private int direction;
    }

    /**
     * 말 이동 응답
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private int type;
        private Map<String, Object> data;

    }

}
