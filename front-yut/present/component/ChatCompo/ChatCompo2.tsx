//chatting component
import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import * as style from "./ChatCompo.style";
import {
  connect,
  sendEvent,
  stompClient,
  subscribeTopic,
} from "@/actions/socket-api/socketInstance";
import { userInfoState } from "@/store/UserStore";
import * as socketUtil from "@/utils/socketUtils";
import { roomCodeAtom } from "@/store/UserStore";

interface LogCompoProps {
  userId: string;
  message: string;
}
const ChatCompo2 = () => {
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const roomCode = useRecoilValue(roomCodeAtom);

  const chattingMessage = useCallback((value: any) => {
    if (stompClient) {
      console.log("chatting data:", value);
    }
  }, []);

  const topics: Array<(key: string, value: (a: any) => void) => void> = [
    (key, value) => {
      if (key === "/topic/chat/" + roomCode) {
        chattingMessage(value);
      }
    },
  ];

  useEffect(() => {
    if (topics) {
      for (const topic of topics) {
        if (typeof topic === "function") {
          subscribeTopic("/topic/chat/" + roomCode, topic);
        }
      }
    }
  }, []);

  const sendMessage = (e: any) => {
    e.preventDefault();
    if (message) {
      // stompClient?.send(
      //   `/chat`,
      //   {},
      //   JSON.stringify({
      //     type: "CHAT",
      //     userId: userInfo.userId,
      //     roomCode: "abcde",
      //     content: message,
      //   })
      // );

      sendEvent(
        `/chat`,
        {},
        {
          type: "CHAT",
          userId: userInfo.userId,
          // TODO: roomCode 변수로 바꾸기
          roomCode: roomCode,
          content: message,
        }
      );
      setMessage("");
      console.log(`${userInfo.userId} message:`, message);
    }
  };

  useEffect(() => {
    for (const topic of topics) {
      if (typeof topic === "function") {
        subscribeTopic("/topic/chat/" + roomCode, topic);
      }
    }
    let userId = userInfo.userId;
    //유저 전역 관리
    console.log("chatting userId: ", userId);
  }, []);

  return (
    <>
      <style.Container>
        {/* 채팅창 전체 */}
        <style.ChatBox>
          {/* 채팅창 로그 */}
          <style.ChatLogBox>
            <div>
              {messages.map((message, index) => (
                <div key={index}>{message}</div>
              ))}
            </div>
          </style.ChatLogBox>
          {/* 채팅 입력창 */}
          <style.ChatInoutBox>
            <form onSubmit={sendMessage}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="메시지를 입력하세요"
              ></input>
              <button type="submit">전송</button>
            </form>
          </style.ChatInoutBox>
        </style.ChatBox>
      </style.Container>
    </>
  );
};

export default ChatCompo2;
