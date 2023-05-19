package com.ssafy.yut.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * 대기방 관련 DTO
 *
 * @author 김정은
 */
public class RoomDto extends RequestDto{

    /**
     * 대기방 유저 정보
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class User {
        private String userId;
        private String nickName;
    }

    /**
     * 방 입장 요청
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RoomCode {
        private String roomCode;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WaitingRequest extends User{
        private String roomCode;
    }

    /**
     * 대기방 정보 응답
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WaitingResponse {
        private List<User> users;
        private String ready;
    }
}
