//chatting component
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import * as style from "./ChatCompo.style";
import { sendEvent } from "@/actions/socket-api/socketInstance";
import { UserInfoState } from "@/store/UserStore";
import { RoomCodeState } from "@/store/GameStore";
import { MessageLogProps, messageLogState } from "@/store/ChatStore";

const ChatCompo = () => {
  const [userInfo, setUserInfo] = useRecoilState(UserInfoState);
  const [message, setMessage] = useState("");
  const roomCode = useRecoilValue(RoomCodeState);
  const [messageLog, setMessageLog] =
    useRecoilState<MessageLogProps>(messageLogState);

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

  return (
    <>
      <style.Container>
        {/* 채팅창 전체 */}
        <style.ChatBox>
          {/* 채팅창 로그 */}
          <style.ChatLogBox>
            <div>
              {Object.keys(messageLog).map((userId, index) => (
                <div key={index}>
                  <strong>{userId}:</strong> {messageLog[userId]}
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
