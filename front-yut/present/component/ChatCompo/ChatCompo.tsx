//chatting component
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import * as style from "./ChatCompo.style";
import { sendEvent } from "@/actions/socket-api/socketInstance";
import { UserInfoState } from "@/store/UserStore";
import { RoomCodeState } from "@/store/GameStore";
import { MessageLogProps, messageLogState } from "@/store/ChatStore";
import Image from "next/image";
import RightArrow from "@/public/image/rightArrow.png";

const ChatCompo = () => {
  const userInfo = useRecoilValue(UserInfoState);
  const [message, setMessage] = useState("");
  const roomCode = useRecoilValue(RoomCodeState);
  const messageLog = useRecoilValue<MessageLogProps[]>(messageLogState);

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = (e: any) => {
    e.preventDefault();
    if (message) {
      if (message === "") return;
      sendEvent(
        `/chat`,
        {},
        {
          type: "CHAT",
          userId: userInfo.nickName,
          roomCode: roomCode,
          content: message,
        }
      );
      setMessage("");
    }
  };

  useEffect(() => {
    messageEndRef.current!.scrollIntoView({ behavior: "smooth" });
  }, [messageLog]);

  return (
    <>
      {/* 채팅창 전체 */}
      <style.Container>
        {/* 채팅창 로그 */}

        <style.ChatLogBox>
          <div>
            {messageLog.map((message: MessageLogProps, index: number) => (
              <style.ChatLogContent key={index}>
                <p
                  style={{
                    color:
                      message.chatName === userInfo.nickName
                        ? "#B778FF"
                        : message.chatName === "SYSTEM"
                        ? "#FF9436"
                        : "#575757",
                  }}
                >
                  {message.chatName} : {message.chatMessage}
                </p>
              </style.ChatLogContent>
            ))}
            <div ref={messageEndRef}></div>
          </div>
        </style.ChatLogBox>
        {/* 채팅 입력창 */}
        <style.ChatInoutBox>
          <style.FormDiv onSubmit={sendMessage}>
            <style.ChatInput
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="메시지를 입력하세요"
            ></style.ChatInput>
            <style.ArrowButton type="submit">
              <Image
                src={RightArrow}
                alt="오른쪽 화살표"
                style={{
                  width: "35px",
                  height: "35px",
                }}
              />
            </style.ArrowButton>
          </style.FormDiv>
        </style.ChatInoutBox>
      </style.Container>
    </>
  );
};
export default ChatCompo;
