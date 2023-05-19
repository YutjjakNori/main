package com.ssafy.yut.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 웹 설정
 *
 * @author 이준
 */
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    /**
     * Cors 설정
     *
     * @param registry
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns(
                        "https://k8d109.p.ssafy.io",
                        "https://www.yutjjak.com",
                        "https://yutjjak.com",
                        "http://localhost:3000",
                        "http://192.168.100.184:3000",
                        "http://192.168.100.130:3000",
                        "http://192.168.100.89:3000",
                        "http://192.168.123.119:3000",
                        "http://192.168.123.107:3000",
                        "http://192.168.123.110:3000")
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
