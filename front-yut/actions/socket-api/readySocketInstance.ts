import { CompatClient } from "@stomp/stompjs";

// stomp 연결 객체
let readySocketObject: CompatClient | null = null;

const readyTopic = {
  //구독 토픽
  chatSubscribe: `/topic/chat`, //채팅
  roomExit: "/topic/room/exit", //방 나가기
  readyState: "/topic/room/preparation", //유저 준비, 취소
  readyUserList: "/topic/room/enter", //방에 있는 유저 리스트
  // chatSubscribe: `/topic/chat/${roomCode}`,
  // roomExit: `/topic/room/exit/${roomCode}`,
  // ready: `/topic/room/preparation/${roomCode}`,
  // readyUserList: `/topic/room/enter/${roomCode}`,
};

export { readySocketObject, readyTopic };
