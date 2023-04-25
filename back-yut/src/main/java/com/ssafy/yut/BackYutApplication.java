package com.ssafy.yut;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class BackYutApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackYutApplication.class, args);
	}

}
