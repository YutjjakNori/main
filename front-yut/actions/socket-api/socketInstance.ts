import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";

// stomp 연결 객체
let stompClient: CompatClient | null = null;
// session ID
let sessionId: string = "";
// STOMP over SockJS 연결
export function connect() {
  let socket = new SockJS("http://localhost:8888/yut");
  stompClient = Stomp.over(socket);

  stompClient.connect(
    {},
    // onConnected
    () => {
      //@ts-ignore
      sessionId = socket._transport.url.split("/")[5];
      onConnected(sessionId);
    },
    // onError
    (frame: any) => {
      onError(frame);
    }
  );
}

// 연결에 성공했을 때
function onConnected(sessionId: string) {
  console.log("success");
  console.log();
  // TODO: roomCode를 변수로 바꾸기!
  stompClient?.subscribe("/topic/chat/{roomCode}", (body: any) => {
    const data = JSON.parse(body.body);
    console.log(data);
  });

  // 서버에 입장한다는 메시지 전송
  stompClient?.send(
    `/room/enter`,
    {},
    JSON.stringify({
      userId: sessionId,
      roomCode: "abcde",
    })
  );
}

// 오류가 발생했을 때
function onError(frame: any) {
  console.log(frame.headers);
}

// 채팅 메시지 보내기
export function sending(content: string) {
  stompClient?.send(
    // TOPIC
    `/chat`,
    {},
    // CONTENT
    JSON.stringify({
      type: "CHAT",
      userId: sessionId,
      // TODO: roomCode 변수로 바꾸기
      roomCode: "abcde",
      content: content,
    })
  );
}
