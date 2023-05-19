package com.ssafy.yut.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 * 예외처리 핸들러
 *
 * @author 이준
 */
@ControllerAdvice
public class CustomExceptionHandler {

    /**
     * 에러 던지기
     *
     * @param e
     * @return
     */
    @ExceptionHandler(CustomException.class)
    protected ResponseEntity<ErrorResponseEntity> handleCustomException(CustomException e) {
        return ErrorResponseEntity.toResponseEntity(e.getErrorCode());
    }
}
