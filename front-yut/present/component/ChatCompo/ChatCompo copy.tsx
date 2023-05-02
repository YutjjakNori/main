//chatting component
import { useEffect, useState, useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import * as style from "./ChatCompo.style";
import { userInfoState } from "@/store/UserStore";
import {
  connect,
  readySocketObject,
  readyTopic,
} from "@/actions/socket-api/readySocketInstance";
import * as socketUtil from "@/utils/socketUtils";

// interface ChatCompoProps {
//   userId: string;
// }

const ChatCompo = () => {
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const chatStart = useCallback((users: Array<any>) => {
    initPlayerTurn(users.map((user) => user.userId));
  }, []);
  const subscribeTopics = useCallback(() => {
    socketUtil.subscribeEvnet(
      readySocketObject,
      readyTopic.chatStart,
      chatStart
    );
  }, []);

  useEffect(() => {
    connect(subscribeTopics);
    let userId = localStorage.getItem("userId");
    //유저 전역 관리
    setUserInfo({ ...userInfo, userId: `${userId}` });
    console.log("ready userId: ", userId);
  }, []);

  const sendMessage = (e: any) => {
    e.preventDefault();
    if (message) {
      sending(`/chat`, {
        type: "CHAT",
        userId: userInfo.userId,
        // TODO: roomCode 변수로 바꾸기
        roomCode: "abcde",
        content: message,
      });
      setMessage("");
      console.log("message:", message);

      // inputRef.current.focus();
    }
  };

  useEffect(() => {
    //전역으로 관리할 변수,
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
              // ...
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
