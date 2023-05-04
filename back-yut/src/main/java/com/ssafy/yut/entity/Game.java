package com.ssafy.yut.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.LinkedHashMap;
import java.util.List;
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
    private String gameStatus;
    private Set<Integer> event;
    private LinkedHashMap<Integer, List<Integer>> plate;
}
