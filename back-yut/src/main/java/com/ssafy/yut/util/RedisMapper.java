package com.ssafy.yut.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

/**
 * Redis 데이터 관련 Mapper
 *
 * @author 이준
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RedisMapper {

    private final RedisTemplate<String, String> redisTemplate;

    /**
     * Redis에 데이터 저장
     * 
     * @param key
     * @param data
     * @return
     * @param <T>
     */
    public <T> boolean saveData(String key, T data) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            String value = mapper.writeValueAsString(data);
            redisTemplate.opsForValue().set(key,value);
            return true;
        } catch (Exception e) {
            log.error(e.getMessage());
            return false;
        }
    }

    /**
     * Redis에서 데이터 불러오기
     * 
     * @param key
     * @param classType
     * @return
     * @param <T>
     */
    public <T> T getData(String key, Class<T> classType) {
        String value = redisTemplate.opsForValue().get(key);

        if(value == null) {
            return null;
        }
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(value, classType);
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }

    /**
     * Redis에서 데이터 삭제
     *
     * @param key
     * @return
     */
    public boolean deleteData(String key) {
        try {
            redisTemplate.delete(key);
            return true;
        }
        catch(Exception e) {
            return false;
        }
    }
}
