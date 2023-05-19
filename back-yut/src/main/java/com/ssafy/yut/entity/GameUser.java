package com.ssafy.yut.entity;

import lombok.*;

import java.util.List;

/**
 * 방 유저 Entity
 * 
 * @author 이준
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameUser {
    private String userId;
    private String nickName;
    private List<Integer> pieces;
    @Override
    public boolean equals(Object obj) {
        return ((GameUser)obj).getUserId().equals(userId);
    }
}
