package com.ssafy.yut.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 게임 턴 관련 DTO
 *
 * @author 김정은
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TurnDto {

    private String userId;
}
