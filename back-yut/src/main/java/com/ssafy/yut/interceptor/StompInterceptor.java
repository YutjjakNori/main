package com.ssafy.yut.interceptor;

import com.ssafy.yut.dto.ChatDto;
import com.ssafy.yut.dto.ChatType;
import com.ssafy.yut.dto.RoomDto;
import com.ssafy.yut.entity.Game;
import com.ssafy.yut.entity.GameUser;
import com.ssafy.yut.entity.User;
import com.ssafy.yut.util.RedisMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * STOMP 인터셉터
 * 
 * @author 이준
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class StompInterceptor implements ChannelInterceptor {

    private final RedisMapper redisMapper;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    /**
     * 들어오는 메시지 인터셉터.
     *
     * @param message
     * @param channel
     * @return
     */
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT == accessor.getCommand()) {
            log.info(accessor.toString());
        }

        else if (StompCommand.SUBSCRIBE == accessor.getCommand()) {
            log.info(accessor.toString());
        }

        else if (StompCommand.DISCONNECT == accessor.getCommand()) {
            log.info(accessor.toString());
            Map<String, Object> response = new HashMap<>();
            String userId = (String) message.getHeaders().get("simpSessionId");
            String userKey = "user:" + userId;

            User user = redisMapper.getData(userKey, User.class);
            redisMapper.deleteData(userKey);

            String roomCode = user.getRoomCode();
            String gameKey = "game:" + roomCode;

            Game game = redisMapper.getData(gameKey, Game.class);
            List<GameUser> gameUsers = game.getUsers();
            int exitUser = gameUsers.indexOf(new GameUser(userId, null));
            String gameStatus = game.getGameStatus();

            // 게임 시작
            if(gameStatus.equals("start")) {
                gameUsers.set(exitUser, null);
                boolean exitAll = true;
                for(GameUser gameUser : gameUsers) {
                    if(gameUser != null) {
                        exitAll = false;
                        break;
                    }
                }
                // 모두 나감
                if(exitAll) {
                    redisMapper.deleteData(gameKey);
                    return message;
                } else {
                    Map<Integer, List<Integer>> plate = game.getPlate();

                    for(Integer point : plate.keySet()) {
                        List<Integer> piecesInPlate = plate.get(point);
                        int piece = piecesInPlate.get(0);
                        if(exitUser == (piece / 3)) {
                            plate.remove(point);
                        }
                    }
                    game.setUsers(gameUsers);
                    game.setPlate(plate);
                }
            }
            // 게임 종료
            else if(gameStatus.equals("end")) {
                redisMapper.deleteData(gameKey);
                return message;
            }
            // 게임 대기
            else {
                gameUsers.remove(exitUser);
                // 모두 나감
                if(gameUsers.size() == 0) {
                    redisMapper.deleteData(gameKey);
                    return message;
                }
                gameStatus = gameStatus.substring(0, exitUser) + gameStatus.substring(exitUser + 1);
                game.setGameStatus(gameStatus);
            }

            redisMapper.saveData(gameKey, game);

            response.put("roomCode", roomCode);
            response.put("response", RoomDto.User.builder().userId(userId).build());
            kafkaTemplate.send("room" + ".exit", roomCode, response);
            kafkaTemplate.send("chat", roomCode,
                    ChatDto.Request.builder()
                            .type(ChatType.SYSTEM)
                            .userId(userId)
                            .roomCode(roomCode)
                            .content("나갔습니다.")
                            .build());
        }
        return message;
    }

}
