import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";

// stomp 연결 객체
let readySocketObject: CompatClient | null = null;
// session ID
let sessionId: string = "";

const readyTopic = {
  chatStart: "/yut/chat",
  ready: "/yut/room/preparation",
  roomExit: "/yut/room/exit",
};

/**
 * STOMP over SockJS 연결
 */
const connect = (successFunc: (sessionId: string) => void) => {
  if (readySocketObject !== null) {
    return;
  }
  const socket = new SockJS(`${process.env.NEXT_PUBLIC_SERVER_URL}/yut`);
  readySocketObject = Stomp.over(socket);

  readySocketObject.connect(
    {},
    () => {
      //@ts-ignore
      sessionId = socket._transport.url.split("/")[5];
      successFunc(sessionId);
      localStorage.setItem("userId", sessionId);
      console.log("userId: ", sessionId);
    },
    (frame: any) => {
      console.log(frame);
    }
  );
};

export { readySocketObject, connect, readyTopic };
