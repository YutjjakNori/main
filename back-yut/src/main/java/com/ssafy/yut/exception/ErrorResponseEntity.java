package com.ssafy.yut.exception;

import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;

/**
 * 예외 응답
 *
 * @author 이준
 */
@Slf4j
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponseEntity {
    private int value;
    private String name;
    private String status;

    /**
     * 받은 에러 코드 응답
     *
     * @param e
     * @return
     */
    public static ResponseEntity<ErrorResponseEntity> toResponseEntity(ErrorCode e) {
        return ResponseEntity
                .status(e.getHttpStatus())
                .body(ErrorResponseEntity.builder()
                        .value(e.getHttpStatus().value())
                        .name(e.name())
                        .status(e.getStatus())
                        .build()
                );
    }
}
