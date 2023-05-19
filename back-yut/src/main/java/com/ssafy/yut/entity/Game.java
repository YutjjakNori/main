package com.ssafy.yut.entity;

import lombok.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * 방 정보 Entity
 *
 * @author 이준
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Game {
    private List<GameUser> users;
    // 대기 정보 및 게임 상태.
    private String gameStatus;
    private Set<Integer> event;
    private Map<Integer, List<Integer>> plate;
}
