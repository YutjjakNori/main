package com.ssafy.yut.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

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
        GameUser user = (GameUser) obj;
        return user.getUserId().equals(userId);
    }
}
