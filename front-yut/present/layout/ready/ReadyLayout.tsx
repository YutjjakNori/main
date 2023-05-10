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
import closeSvg from "@/public/icon/close.svg";
import copySvg from "@/public/icon/copy.svg";
import voiceOnSvg from "@/public/icon/voiceOn.svg";
import voiceOffSvg from "@/public/icon/voiceOff.svg";
import CircleButton, {
  CircleButtonProps,
} from "@/present/common/Button/Circle/CircleButton";
import * as style from "./ReadyLayout.style";
import { useRouter } from "next/router";
import { MessageLogProps, messageLogState } from "@/store/ChatStore";

const ReadyLayout = () => {
  //나가기버튼
  const exitBtnInfo: CircleButtonProps = {
    Icon: closeSvg,
    fontSize: "",
    text: "",
    color: "#575757",
    backgroundColor: "#EA857C",
    borderColor: "transparent",
    margin: "1rem",
  };
  //소리버튼
  const soundBtnInfo: CircleButtonProps = {
    Icon: voiceOffSvg,
    fontSize: "",
    text: "",
    color: "#575757",
    backgroundColor: "#FFF",
    borderColor: "gray",
    margin: "1rem",
  };
  //복사버튼
  const copyBtnInfo: CircleButtonProps = {
    Icon: copySvg,
    fontSize: "",
    text: "",
    color: "#575757",
    backgroundColor: "#FFF",
    borderColor: "gray",
    margin: "1rem",
  };

  const router = useRouter();
  const { openModal, closeModal } = useModal(); //모달 Hook
  const [userInfo, setUserInfo] = useRecoilState(UserInfoState); //내 정보 세팅
  // const [isReady, setIsReady] = useState(false); //내 레디상태 관리
  const [isReady, setIsReady] = useState("0"); //내 레디상태 관리

  //멤버 아이디 배열
  const [memberList, setMemberList] = useRecoilState(MemberListState);
  //멤버아이디 + 레디상태 관리 배열
  const [memberReadyList, setMemberReadyList] =
    useRecoilState(MemberReadyListState);
  //채팅
  const [messageLog, setMessageLog] =
    useRecoilState<MessageLogProps>(messageLogState);

  const roomCode = useRecoilValue(RoomCodeState);

  //대기 - 방 입장 구독 콜백함수
  const settingMembers = (data: any) => {
    const userIds = data.users.map((user: any) => user.userId);
    const newMemberList = [...userIds];
    setMemberList(newMemberList); //유저 아이디만 저장한 배열

    const readyString = data.ready;

    // member 객체의 isReady 속성을 readyString 값에 따라 설정
    const members = userIds.map((userId: string, index: number) => ({
      userId: userId,
      isReady: readyString[index] === "1",
    }));
    setMemberReadyList(members);
  };

  //대기 - 준비 구독 콜백함수
  const preparation = (data: any) => {
    console.log("준비구독 데이터:", data);

    const readyUserId = data.userId;
    const ready = data.ready;
    const start = data.start;

    setMemberReadyList((prev) => {
      // 이전 상태(prev)에서 해당 유저의 정보를 찾아 isReady 값을 업데이트합니다.
      return prev.map((member) => {
        if (member.userId === readyUserId) {
          return {
            ...member,
            isReady: ready,
          };
        } else {
          return member;
        }
      });
    });

    // 모두 준비되어 있다면 openModal 함수 실행
    if (start) {
      setTimeout(() => {
        openModal();
      }, 1000);
    }
  };

  //채팅 구독
  const chattingMessage = useCallback(
    (value: any) => {
      console.log("채팅 구독 성공 후 콜백 함수 호출");
      console.log("chatting data", value);
      if (stompClient) {
        const nextMessages = { [value.userId]: value.content };
        setMessageLog((prevMessages) =>
          Object.assign({}, prevMessages, nextMessages)
        );
      }
    },
    [stompClient]
  );

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
    "/topic/chat/": chattingMessage,
    "/topic/room/exit/": requestToLeave,
  };

  async function initConnection() {
    await connect();

    setUserInfo({
      ...userInfo,
      userId: localStorage.getItem("userId") ?? "",
    });
    setMessageLog({});

    const topicSubscriptions = Object.keys(topics).map((key) =>
      subscribeTopic(key + roomCode, topics[key])
    );

    await Promise.all(topicSubscriptions);

    //서버에 입장한다고 전송
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

  useEffect(() => {
    initConnection();
  }, []);

  useEffect(() => {
    console.log("useEffect memberReadyList >>>>  ", memberReadyList);
  }, [memberReadyList]);

  //새로고침 시 소켓 해제
  useEffect(() => {
    if (!window) return;
    const disconnectSocket = () => {
      stompClient?.disconnect();
    };

    window?.addEventListener("beforeunload", disconnectSocket);

    return window?.removeEventListener("beforeunload", disconnectSocket);
  }, []);
  function consoleIsReady() {
    console.log("consoleIsReady", isReady);
  }
  //준비 or 준비취소 send
  async function handleIsReady() {
    let ready;

    // isReady 값을 true로 변경
    if (isReady === "1") {
      setIsReady("0");
      ready = "0";
      console.log("준비 취소");
    } else {
      setIsReady("1");
      ready = "1";
      console.log("준비");
    }
    console.log("ready:", ready);
    await setIsReady(ready);

    sendEvent(
      `/room/preparation`,
      {},
      {
        roomCode: roomCode,
        userId: localStorage.getItem("userId"),
        ready: ready,
      }
    );
  }

  //나가기 send
  function handleIsExit() {
    if (stompClient !== null && stompClient !== undefined) {
      stompClient.disconnect();
      router.push("/lobby");
    }
  }

  return (
    <>
      <div>
        <h1>방코드</h1>
        <h2>{roomCode}</h2>
        <h2>{userInfo.userId}님</h2>
      </div>
      <style.Container>
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
        >
          준비
        </button>
        <button
          onClick={() => {
            consoleIsReady();
          }}
        >
          준비로그찍기
        </button>
        <style.SoundContainer
          onClick={() => {
            handleIsExit();
          }}
        >
          <CircleButton
            Icon={soundBtnInfo.Icon}
            fontSize={soundBtnInfo.fontSize}
            text={soundBtnInfo.text}
            color={soundBtnInfo.color}
            backgroundColor={soundBtnInfo.backgroundColor}
            borderColor={soundBtnInfo.borderColor}
            margin={soundBtnInfo.margin}
          />
        </style.SoundContainer>
        <style.CopyContainer
          onClick={() => {
            handleIsExit();
          }}
        >
          <CircleButton
            Icon={copyBtnInfo.Icon}
            fontSize={copyBtnInfo.fontSize}
            text={copyBtnInfo.text}
            color={copyBtnInfo.color}
            backgroundColor={copyBtnInfo.backgroundColor}
            borderColor={copyBtnInfo.borderColor}
            margin={copyBtnInfo.margin}
          />
        </style.CopyContainer>
        <style.ExitContainer
          onClick={() => {
            handleIsExit();
          }}
        >
          <style.ExitAlertContainer>
            <div className="btn-alert">
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
            <div className="btn-alert-text">방 나가기</div>
          </style.ExitAlertContainer>
        </style.ExitContainer>
        <Modal title={"게임을 시작합니다"}>
          <Timer
            ss={5}
            size={65}
            color={"#000"}
            handleOver={() => {
              closeModal();
              router.push("game");
            }}
          />
        </Modal>
        <ChatCompo />
      </style.Container>
    </>
  );
};

export default ReadyLayout;
