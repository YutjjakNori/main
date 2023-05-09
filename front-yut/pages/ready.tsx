//게임 대기 페이지

//게임 대기 페이지

import GameProfile from "@/present/common/GameProfile/GameProfile";
import Modal from "@/present/common/Modal/Modal";
import Timer from "@/present/common/Timer/Timer";
import useModal from "@/actions/hook/controlModal";
import { useEffect, useState } from "react";
import {
  connect,
  stompClient,
  sendEvent,
  subscribeTopic,
} from "@/actions/socket-api/socketInstance";
import { RoomCodeState, UserInfoState } from "@/store/UserStore";
import { useRecoilState, useRecoilValue } from "recoil";
import ChatCompo from "@/present/component/ChatCompo/ChatCompo";
import { MemberListState, MemberReadyListState } from "@/store/MemberStore";

const Ready = () => {
  const { openModal, closeModal } = useModal(); //모달 Hook
  const [userInfo, setUserInfo] = useRecoilState(UserInfoState); //내 정보 세팅
  const [memberList, setMemberList] = useRecoilState(MemberListState); //멤버 아이디 배열
  const [memberReadyList, setMemberReadyList] =
    useRecoilState(MemberReadyListState); //멤버아이디 + 레디상태 관리 배열
  const [isReadyState, setIsReadyState] = useState(Boolean);
  const roomCode = useRecoilValue(RoomCodeState);

  //준비 값 검사할 함수
  const checkAllReady = (readyString: string): boolean => {
    for (const char of readyString) {
      if (char === "0") {
        return false;
      }
    }
    return true;
  };

  //방 멤버 전역 설정
  const settingMembers = async (data: any) => {
    const userIds = data.users.map((user: any) => user.userId);
    const readyString = data.ready;

    const newMemberList = [...userIds];
    await setMemberList(newMemberList); //유저 아이디만 저장한 배열

    // member 객체의 isReady 속성을 readyString 값에 따라 설정
    const members = userIds.map((userId: string, index: number) => ({
      userId: userId,
      isReady: readyString[index] === "1",
    }));

    await setMemberReadyList(members);
  };

  //구독할 토픽 (방코드는 따로 입력)
  const topics: any = {
    "/topic/room/enter/": settingMembers,
    "/topic/room/preparation/": (a: any) => {},
    "/topic/room/exit/": (a: any) => {},
  };

  async function initConnection() {
    await connect();

    setUserInfo({
      ...userInfo,
      userId: localStorage.getItem("userId") ?? "",
    });

    const topicSubscriptions = Object.keys(topics).map((key) =>
      subscribeTopic(key + roomCode, topics[key])
    );

    await Promise.all(topicSubscriptions);

    //서버에 유저 입장
    sendEvent(
      `/room/enter`,
      {},
      {
        userId: localStorage.getItem("userId"),
        roomCode: roomCode,
      }
    );
  }

  //새로고침 시 소켓연결 해제
  useEffect(() => {
    if (!window) return;
    const disconnectSocket = () => {
      stompClient?.disconnect();
    };

    window?.addEventListener("beforeunload", disconnectSocket);

    return window?.removeEventListener("beforeunload", disconnectSocket);
  }, []);

  useEffect(() => {
    initConnection();
    console.log(
      "process.env.NEXT_PUBLIC_SERVER_URL >>> ",
      process.env.NEXT_PUBLIC_SERVER_URL
    );
    console.log("process.env.NEXT_PUBLIC_SERVER_URL >>> ");
    console.log(process.env.NEXT_PUBLIC_SERVER_URL);
  }, []);

  // 준비 이벤트 전송
  function handleIsReady() {
    // isReady 값을 true로 변경
    if (isReadyState) {
      setIsReadyState(false);
    } else {
      setIsReadyState(true);
    }

    // 이벤트 전송
    sendEvent(
      "/room/preparation",
      {},
      {
        roomCode: roomCode,
        userId: userInfo.userId,
        ready: isReadyState,
      }
    );
  }

  return (
    <>
      {memberReadyList.map((member, index) => (
        <GameProfile
          key={index}
          profileImage={
            "https://cdn.pixabay.com/photo/2023/04/07/06/42/bird-7905654__340.jpg"
          }
          isReady={member.isReady}
          playerName={member.userId}
        />
      ))}
      <button
        onClick={() => {
          handleIsReady();
        }}
        className="btn"
      >
        준비
      </button>
      <Modal title={"게임을 시작합니다"}>
        <Timer
          ss={5}
          size={65}
          color={"#000"}
          handleOver={() => {
            closeModal();
          }}
        />
      </Modal>
      <ChatCompo></ChatCompo>
    </>
  );
};

export default Ready;
