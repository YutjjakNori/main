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

const ChatCompo = () => {
  const [userInfo, setUserInfo] = useRecoilState(UserInfoState);
  const [message, setMessage] = useState("");
  const roomCode = useRecoilValue(RoomCodeState);
  const [messages, setMessages] = useState<{ [key: string]: string }>({});

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
    }
  };

  const chattingMessage = useCallback(
    (value: any) => {
      console.log("채팅 구독 성공 후 콜백 함수 호출");
      if (stompClient) {
        const nextMessages = { [value.userId]: value.content };
        setMessages((prevMessages) =>
          Object.assign({}, prevMessages, nextMessages)
        );
      }
    },
    [stompClient]
  );

  // const chattingMessage = async (data: any) => {
  //   const userIds = data.users.map((user: any) => user.userId);
  //   const newMemberList = [...userIds];
  //   await setMemberList(newMemberList); //유저 아이디만 저장한 배열

  //   const readyString = data.ready;
  //   const isAllReady = checkAllReady(readyString);

  //   // member 객체의 isReady 속성을 readyString 값에 따라 설정
  //   const members = userIds.map((userId: string, index: number) => ({
  //     userId: userId,
  //     isReady: readyString[index] === "1",
  //   }));
  //   await setMemberReadyList(members);
  //   // 모두 준비되어 있다면 openModal 함수 실행
  //   if (isAllReady) {
  //     openModal();
  //   }
  // };

  // async function initConnection() {
  //   await subscribeTopic("/topic/chat/" + roomCode, chattingMessage);
  // }

  const initConnection = async () => {
    await subscribeTopic("/topic/chat/" + roomCode, chattingMessage);
  };

  useEffect(() => {
    initConnection();
    // if (stompClient) {
    //   initConnection();
    // }
  }, []);

  return (
    <>
      <style.Container>
        {/* 채팅창 전체 */}
        <style.ChatBox>
          {/* 채팅창 로그 */}
          <style.ChatLogBox>
            <div>
              {Object.keys(messages).map((userId) => (
                <div key={userId}>
                  <strong>{userId}:</strong> {messages[userId]}
                </div>
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
