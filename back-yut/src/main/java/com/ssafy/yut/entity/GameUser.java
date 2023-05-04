package com.ssafy.yut.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private List<Integer> pieces;

    @Override
    public boolean equals(Object obj) {
        return ((GameUser)obj).getUserId().equals(userId);
    }
}
