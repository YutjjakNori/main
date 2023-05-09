package com.ssafy.yut.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Set;

/**
 * 게임 상태 DTO
 * 
 * @author 이준
 */
public class GameDto {

    /**
     * 게임 유저
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class User {
        private String userId;
        private List<Integer> pieceNum;
    }

    /**
     * 게임 방 요청
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        private String roomCode;
    }

    /**
     * 게임 방 응답
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private List<User> users;
        private Set<Integer> event;
    }
}
