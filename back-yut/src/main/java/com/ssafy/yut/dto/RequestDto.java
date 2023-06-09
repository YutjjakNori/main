package com.ssafy.yut.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 요청 메시지 클래스
 *
 * @author 김정은
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RequestDto {
    private String userId;
    private String roomCode;
}
