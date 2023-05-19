package com.ssafy.yut.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * 에러 코드 enum
 *
 * @author 이준
 */
@Getter
@AllArgsConstructor
public enum ErrorCode {

    // 방의 정원이 다 찼을 경우
    FULL_ROOM(HttpStatus.INTERNAL_SERVER_ERROR, "fullRoom"),
    // 게임 시작 중인 방인 경우
    GAME_ON(HttpStatus.INTERNAL_SERVER_ERROR, "gameOn"),
    // 방의 코드가 없거나 다른 경우
    NOT_FOUND_ROOM(HttpStatus.INTERNAL_SERVER_ERROR, "fail");

    private final HttpStatus httpStatus;
    private final String status;
}
