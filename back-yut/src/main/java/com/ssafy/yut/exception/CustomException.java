package com.ssafy.yut.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 예외처리
 *
 * @author 이준
 */
@Getter
@AllArgsConstructor
public class CustomException extends RuntimeException{
    ErrorCode errorCode;
}
