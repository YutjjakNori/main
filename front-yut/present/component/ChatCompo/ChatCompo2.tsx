//chatting component
import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import * as style from "./ChatCompo.style";
import {
  sendEvent,
  stompClient,
  subscribeTopic,
} from "@/actions/socket-api/socketInstance";
import { UserInfoState } from "@/store/UserStore";
import { RoomCodeState } from "@/store/GameStore";

interface LogCompoProps {
  userId: string;
  message: string;
}
const ChatCompo2 = () => {
  const [userInfo, setUserInfo] = useRecoilState(UserInfoState);
  const [message, setMessage] = useState("");
  // const [messages, setMessages] = useState<string[]>([]);
  const roomCode = useRecoilValue(RoomCodeState);
  const [messages, setMessages] = useState<{ [key: string]: string }>({});
  // 서버로 부터 받아온 내용
  const [chat, setChat] = useState([]);

  async function initConnection() {
    await subscribeTopic("/topic/chat/" + roomCode, chattingMessage);
    // //서버에 입장하겠다는 메시지 보내기
    // sendEvent(
    //   `/room/enter`,
    //   {},
    //   {
    //     userId: userInfo.userId,
    //     roomCode: roomCode,
    //   }
    // );
  }

  useEffect(() => {
    if (stompClient) {
      initConnection();
    }
  }, []);

  const sendMessage = (e: any) => {
    e.preventDefault();
    if (message) {
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

  const renderChat = () => {
    console.log(messages);
    return chat.map(({ userId, message }, index) => (
      <div key={index}>
        <>
          {userId}: <>{message}</>
        </>
      </div>
    ));
  };

  const chattingMessage = useCallback(
    (value: any) => {
      if (stompClient) {
        console.log("chatting data:", value);
        console.log("data.userId :", value.userId);
        console.log("data.content :", value.content);
        const nextMessages = { [value.userId]: value.content };
        setMessages((prevMessages) =>
          Object.assign({}, prevMessages, nextMessages)
        );
      }
    },
    [stompClient]
  );

  // function chattingMessage(data: any) {
  //   // const newMessage = JSON.parse(data.body);
  //   console.log("data.userId :", data.userId);
  //   console.log("data.content :", data.content);
  //   // setMessages((prevMessages) => {
  //   //   // return { ...prevMessages, [newMessage.userId]: newMessage.content };
  //   // });
  // }

  // const chattingLog = useCallback((value: any) => {
  //   if (stompClient) {
  //     console.log("chatting data:", value);
  //     return value.map(({ userId: string, message: string }, index:number) => (
  //       <div key={index}>
  //         <>
  //           {value.userId}: <>{value.message}</>
  //         </>
  //       </div>
  //     ));
  //   }
  // }, []);

  return (
    <>
      <style.Container>
        {/* 채팅창 전체 */}
        <style.ChatBox>
          {/* 채팅창 로그 */}
          <style.ChatLogBox>
            {/* <div>
              {Object.keys(messages).map(([userId, content], index) => (
                <li key={index}>
                  <>
                    <strong>{userId}:</strong> <>{content}</>
                  </>
                </li>
              ))}
            </div> */}
            <div>
              {Object.keys(messages).map((userId) => (
                <div key={userId}>
                  <strong>{userId}:</strong> {messages[userId]}
                </div>
              ))}
            </div>
            {/* <ul>
              {Object.entries(messages).map(([userId, content], index) => (
                <li key={index}>
                  <>
                    <strong>{userId}:</strong> <>{content}</>
                  </>
                </li>
                // <li key={userId}>
                //   <strong>{userId}: </strong>
                //   {content}
                // </li>
              ))}
            </ul> */}
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
