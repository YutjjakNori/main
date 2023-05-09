//게임 대기 페이지

import GameProfile from "@/present/common/GameProfile/GameProfile";
import Modal from "@/present/common/Modal/Modal";
import Timer from "@/present/common/Timer/Timer";
import useModal from "@/actions/hook/controlModal";
import { useCallback, useEffect, useState } from "react";
import {
  connect,
  onError,
  stompClient,
  sendEvent,
  subscribeTopic,
} from "@/actions/socket-api/socketInstance";
import { UserInfoState } from "@/store/UserStore";
import { RoomCodeState } from "@/store/GameStore";
import { useRecoilState, useRecoilValue } from "recoil";
import ChatCompo from "@/present/component/ChatCompo/ChatCompo";
import { MemberListState, MemberReadyListState } from "@/store/MemberStore";
import Svg from "@/public/icon/close.svg";
import CircleButton, {
  CircleButtonProps,
} from "@/present/common/Button/Circle/CircleButton";
import * as style from "./ReadyLayout.style";
import { useRouter } from "next/router";

const ReadyLayout = () => {
  const router = useRouter();
  const { openModal, closeModal } = useModal(); //모달 Hook
  const [userInfo, setUserInfo] = useRecoilState(UserInfoState); //내 정보 세팅
  const [memberList, setMemberList] = useRecoilState(MemberListState); //멤버 아이디 배열
  const [memberReadyList, setMemberReadyList] =
    useRecoilState(MemberReadyListState); //멤버아이디 + 레디상태 관리 배열
  const [isReadyState, setIsReadyState] = useState(Boolean);
  const roomCode = useRecoilValue(RoomCodeState);

  //나가기버튼
  const exitBtnInfo: CircleButtonProps = {
    Icon: Svg,
    fontSize: "",
    text: "",
    color: "#575757",
    backgroundColor: "#EA857C",
    borderColor: "transparent",
    margin: "1rem",
  };

  //준비 값이 모두 1이면 모달 실행
  const checkAllReady = (readyString: string): boolean => {
    for (const char of readyString) {
      if (char === "0") {
        return false;
      }
    }
    return true;
  };

  //TODO: 하나의 함수 안에 지금 enter, preparation 토픽을 한번에 하려고 하고 있음, 분리하셈
  //대기 - 방 입장 구독 콜백함수
  const settingMembers = async (data: any) => {
    const userIds = data.users.map((user: any) => user.userId);
    const newMemberList = [...userIds];
    await setMemberList(newMemberList); //유저 아이디만 저장한 배열

    const readyString = data.ready;
    const isAllReady = checkAllReady(readyString);

    // member 객체의 isReady 속성을 readyString 값에 따라 설정
    const members = userIds.map((userId: string, index: number) => ({
      userId: userId,
      isReady: readyString[index] === "1",
    }));
    await setMemberReadyList(members);
    // 모두 준비되어 있다면 openModal 함수 실행
    if (isAllReady) {
      openModal();
    }
  };

  //대기 - 준비 구독 콜백함수
  const preparation = async (data: any) => {
    const readyUserId = data.userId;
    const readyString = data.ready;
    const isAllReady = checkAllReady(readyString);

    // 모두 준비되어 있다면 openModal 함수 실행
    if (isAllReady) {
      openModal();
    }
  };

  //대기 - 나가기 구독 콜백함수
  const requestToLeave = useCallback(
    (data: any) => {
      const exitUserId = data.userId;
      // exitUserId가 null 또는 undefined가 아닌 경우 실행되는 코드
      if (exitUserId !== null && exitUserId !== undefined) {
        if (stompClient?.connected) {
          stompClient?.disconnect();
        }
        router.push("/lobby");
      }
    },
    [router]
  );

  const topics: any = {
    "/topic/room/enter/": settingMembers,
    "/topic/room/preparation/": preparation,
    "/topic/room/exit/": requestToLeave,
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

    //현재까지 들어온 멤버가 옴
    sendEvent(
      `/room/enter`,
      {},
      {
        userId: localStorage.getItem("userId"),
        roomCode: roomCode,
      }
    );

    // return () => {
    //   if (stompClient?.connected) {
    //     stompClient?.disconnect();
    //   }
    // };
  }

  //새로고침 시 소켓 해제
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
  }, []);

  useEffect(() => {
    console.log("useEffect memberReadyList >>>>  ", memberReadyList);
  }, [memberReadyList]);

  // function handleIsReady() {
  //   // isReady 값을 true로 변경
  //   if (isReady) {
  //     setIsReady(false);
  //   } else {
  //     setIsReady(true);
  //   }

  //   // 이벤트 전송
  //   sendEvent(
  //     "/room/preparation",
  //     {},
  //     {
  //       roomCode: roomCode,
  //       userId: userInfo.userId,
  //       ready: isReady,
  //     }
  //   );
  // }

  //준비|준비취소 send
  function handleIsReady() {
    // 이벤트 전송
    sendEvent(
      "/room/preparation",
      {},
      {
        roomCode: roomCode,
        userId: userInfo.userId,
        ready: true,
      }
    );
  }
  //나가기 send
  function handleIsExit() {
    // 이벤트 전송
    sendEvent(
      "/room/exit",
      {},
      {
        roomCode: roomCode,
        userId: userInfo.userId,
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

      <style.Container2
        onClick={() => {
          handleIsExit();
        }}
      >
        <style.Container>
          <div className="jb-title">
            <CircleButton
              Icon={exitBtnInfo.Icon}
              fontSize={exitBtnInfo.fontSize}
              text={exitBtnInfo.text}
              color={exitBtnInfo.color}
              backgroundColor={exitBtnInfo.backgroundColor}
              borderColor={exitBtnInfo.borderColor}
              margin={exitBtnInfo.margin}
            />
          </div>
          <div className="jb-text">방 나가기</div>
        </style.Container>
      </style.Container2>
    </>
  );
};

export default ReadyLayout;
