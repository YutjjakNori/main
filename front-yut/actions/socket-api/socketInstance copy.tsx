import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
// import * as socketUtil from "@/utils/socketUtils";

// stomp 연결 객체
let stompClient: CompatClient | null = null;
// session ID
let sessionId: string = "";
//닉네임 만들기
const firstNames = ["평화주의자", "인성파탄자", "윷판지배자", "윷수호신"];
const lastNames = ["개떡이", "철수", "유리", "짱구", "찰떡이", "맹구"];
let playerName = "";

//TODO: 방코드는 atom으로 받아서 처리해야함
const roomCode = "abcabc";

function randomPlayerName() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  playerName = firstName + " " + lastName;
  return playerName;
}

//STOMP over SockJS 연결
function connect(callback: () => void) {
  // let socket = new SockJS("https://k8d109.p.ssafy.io:8888/yut");
  let socket = new SockJS("https://k8d109.p.ssafy.io/yut");
  //stomp.js를 사용하여 SockJS와 웹 소켓 통신을 수행
  stompClient = Stomp.over(socket);
  stompClient.connect(
    {},
    // onConnected
    () => {
      //@ts-ignore
      sessionId = socket._transport.url.split("/")[5];
      localStorage.setItem("userId", sessionId);
      localStorage.setItem("playerName", randomPlayerName());
      onConnected(sessionId);
      console.log("socket connection success!");

      console.log(
        "userId:",
        localStorage.getItem("userId"),
        "playerName:",
        localStorage.getItem("playerName")
      );
    },
    // onError
    (frame: any) => {
      onError(frame);
    }
  );
}

/**
 * Socket 연결 시 오류가 발생했을 때 실행하는 함수
 *
 * @param frame 연결 실패 시 반환하는 parameter
 */
function onError(frame: any) {
  console.log(frame.headers);
}

function onConnected(sessionId: string) {
  console.log("success");
  chatSubscribe(sessionId);

  //chatting 구독
  // stompClient?.subscribe("/topic/chat/abcde", (body: any) => {
  //   const data = JSON.parse(body.body);
  //   console.log(data);
  // });

  //서버에 입장한다는 메시지 전송
  stompClient?.send(
    `/room/enter`,
    {},
    JSON.stringify({
      userId: sessionId,
      roomCode: roomCode,
    })
  );
}

const chatSubscribe = (sessionId: string) => {
  stompClient?.subscribe(`/topic/chat/${roomCode}`, (body: any) => {
    const data = JSON.parse(body.body);
    console.log("topic/chat/abcde의 데이터:", data);
  });
  // socketUtil.sendEvent(
  //   `/chat/abcde`,
  //   {},
  //   {
  //     type: "CHAT",
  //     userId: sessionId,
  //     // TODO: roomCode 변수로 바꾸기
  //     roomCode: "abcde",
  //     content: "message보내요~",
  //   }
  // );
};

const socketSetting = () => {
  return <></>;
};

export { socketSetting, connect, onError, stompClient, chatSubscribe };
