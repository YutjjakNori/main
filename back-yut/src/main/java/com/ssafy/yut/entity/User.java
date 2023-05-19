package com.ssafy.yut.entity;

import lombok.*;

/**
 * 사용자 Entity
 * 
 * @author 이준
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    private String userId;
    private String roomCode;
}
