package com.ssafy.yut.service;

import com.ssafy.yut.dto.RoomDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoomService {
    private final int RANDOM_LEN = 5;
    private final boolean USE_LETTERS = true, USE_NUMBERS = true;

    public RoomDto createRoom(){
        String code = RandomStringUtils.random(RANDOM_LEN, USE_LETTERS, USE_NUMBERS);
        return new RoomDto(code);
    }
}
