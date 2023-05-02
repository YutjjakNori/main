package com.ssafy.yut.dto;

import lombok.*;

/**
 * 이벤트 관련 DTO
 *
 * @author 박소연
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventDto {
    private String userId;
    private String roomCode;
    private int event;
}
