package com.ssafy.yut.dto;

import lombok.*;

import java.util.List;

/**
 * 이벤트 관련 DTO
 *
 * @author 박소연
 */
public class EventDto {

    /**
     * 이벤트 발생
     */
    @Getter
    @AllArgsConstructor
    @Builder
    public static class response {
        private String roomCode;
        private String userId;
        private int event;
    }

    /**
     * 이벤트 실행 requestDTO
     */
    @Getter
    @AllArgsConstructor
    public static class requestResult {
        private String roomCode;    // 방 코드
        private String userId;  // 해당 턴이 사용자 세션 아이디
        private List<Integer> selectPiece;  // 선택된 말
        private int plateNum;   // 현재 자리 위치
        private int event;  // 이벤트 종류 (0 : 말업기 / 1 : 자리이동)
        private int prevPosition;   // 자리 이동 시 이전 자리 위치
    }

    /**
     * 이벤트 실행 responseDTO
     */
    @AllArgsConstructor
    @Builder
    public static class responseResult {
        private String roomCode;
        private String userId;
        private List<Integer> selectPiece;
        private int event;
        private int move;
    }
}
