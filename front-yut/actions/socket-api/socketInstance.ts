import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";

// stomp 연결 객체
let stompClient: CompatClient | null = null;
let sessionId: string = "";
//닉네임 만들기
// const firstNames = ["평화주의자", "인성파탄자", "윷판지배자", "윷수호신"];
// const lastNames = ["개떡이", "철수", "유리", "짱구", "찰떡이", "맹구"];
// let playerName = "";

// function randomPlayerName() {
//   const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
//   const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
//   playerName = firstName + " " + lastName;
//   return playerName;
// }

//STOMP over SockJS 연결
async function connect(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    let socket = new SockJS(process.env.NEXT_PUBLIC_SERVER_URL + "/yut", null, {
      transports: ["websocket", "xhr-streaming", "xhr-polling"],
    });
    console.log("connect 연결시도!!!");
    stompClient = Stomp.over(socket);
    stompClient.connect(
      {},
      // onConnected
      () => {
        //@ts-ignore
        sessionId = socket._transport.url.split("/")[5];
        localStorage.setItem("userId", sessionId);
        // localStorage.setItem("playerName", randomPlayerName());
        console.log("connect 연결성공~~~~~!!!");
        resolve();
      },
      // onError
      (frame: any) => {
        onError(frame);
        reject(frame);
      }
    );
  });
}

/**
 * Socket 연결 후 Topic 구독할 때 실행하는 함수
 *
 * @param topic 원하는 topic 주소 parameter
 * @callback 서버에서 준 데이터를 돌려받을 함수
 */
function subscribeTopic(topic: string, callback?: any) {
  stompClient?.subscribe(topic, (body: any) => {
    // if (callback) callback(JSON.parse(body.body));
    if (typeof callback === "function") {
      callback(JSON.parse(body.body));
    }
  });
}

/**
 * Socket 연결 후 send 요청할 때 실행하는 함수
 */
function sendEvent(
  eventName: string,
  header: any,
  contents: any,
  callback?: any
) {
  stompClient?.send(eventName, header, JSON.stringify(contents));
  if (typeof callback === "function") {
    if (callback) callback();
  }
}

/**
 * Socket 연결 시 오류가 발생했을 때 실행하는 함수
 *
 * @param frame 연결 실패 시 반환하는 parameter
 */
function onError(frame: any) {
  console.log(frame.headers);
}

export { connect, onError, stompClient, subscribeTopic, sendEvent };
