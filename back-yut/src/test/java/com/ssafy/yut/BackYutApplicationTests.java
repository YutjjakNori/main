package com.ssafy.yut;

import com.ssafy.yut.entity.Game;
import com.ssafy.yut.util.RedisMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BackYutApplicationTests {

	@Autowired
	RedisMapper redisMapper;
	@Test
	void contextLoads() {
		Game game = redisMapper.getData("game:qwerty2", Game.class);
		System.out.println(game);


	}

}
