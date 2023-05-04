//chatting component
import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import * as style from "./ChatCompo.style";
import { connect, stompClient } from "@/actions/socket-api/socketInstance";
import { userInfoState } from "@/store/UserStore";
import { readyTopic } from "@/actions/socket-api/readySocketInstance";
import * as socketUtil from "@/utils/socketUtils";

interface LogCompoProps {
  userId: string;
  message: string;
}
const ChatCompo = () => {
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  // const chatLog = useCallback((chats: Array<any>) => {
  //   const log: Array<LogCompoProps> = chats.map((chat, index) => {
  //     return {
  //       userId: chat.userId,
  //       message: chat.message,
  //     };
  //   });
  //   setMessages([...log]);
  // }, []);

  const subscribeTopics = useCallback(() => {
    console.log("chatting~~");
    if (stompClient) {
      socketUtil.subscribeEvent(
        readyTopic.chatSubscribe + "/abcde",
        socketUtil.obj
      );
      // socketUtil.subscribeEvent(readyTopic.chatSubscribe + "/abcde", chatLog);
      // socketUtil.obj;
      console.log("chatting:", socketUtil.obj);
    }
  }, []);

  useEffect(() => {
    connect(subscribeTopics);
    // subscribeTopics();
    let userId = localStorage.getItem("userId");
    //유저 전역 관리
    setUserInfo({ ...userInfo, userId: `${userId}` });
    console.log("chatting userId: ", userId);
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

      socketUtil.sendEvent(
        `/chat`,
        {},
        {
          type: "CHAT",
          userId: userInfo.userId,
          // TODO: roomCode 변수로 바꾸기
          roomCode: "abcde",
          content: message,
        }
      );
      setMessage("");
      console.log("message:", message);
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
