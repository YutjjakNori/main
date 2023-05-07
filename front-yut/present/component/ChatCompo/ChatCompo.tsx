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
import { roomCodeAtom } from "@/store/UserStore";

interface LogCompoProps {
  userId: string;
  message: string;
}
const ChatCompo = () => {
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const roomCode = useRecoilValue(roomCodeAtom);

  const chattingMessage = useCallback((value: any) => {
    if (stompClient) {
      console.log("chatting data:", value);
    }
  }, []);

  function initConnection() {
    subscribeTopic("/topic/chat/" + roomCode, chattingMessage);
  }

  useEffect(() => {
    initConnection();
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
      //     roomCode: roomCode,
      //     content: message,
      //   })
      // );

      sendEvent(
        `/chat`,
        {},
        {
          type: "CHAT",
          userId: userInfo.userId,
          roomCode: roomCode,
          content: message,
        }
      );
      setMessage("");
      console.log(userInfo.userId + " message:", message);
    }
  };

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

export default ChatCompo;
