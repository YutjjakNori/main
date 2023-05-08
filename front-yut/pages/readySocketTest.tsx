//게임 대기 페이지

import GameProfile from "@/present/common/GameProfile/GameProfile";
import Modal from "@/present/common/Modal/Modal";
import Timer from "@/present/common/Timer/Timer";
import useModal from "@/actions/hook/controlModal";
import ChatCompo2 from "@/present/component/ChatCompo/ChatCompo";
import { useCallback, useEffect, useState } from "react";
import {
  connect,
  onError,
  stompClient,
  sendEvent,
  subscribeTopic,
} from "@/actions/socket-api/socketInstance";
import { roomCodeAtom, userInfoState } from "@/store/UserStore";
import { useRecoilState, useRecoilValue } from "recoil";
import ChatCompo from "@/present/component/ChatCompo/ChatCompo";
import { memberListAtom } from "@/store/MemberStore";

const Ready = () => {
  const { openModal, closeModal } = useModal(); //모달 Hook
  const [userInfo, setUserInfo] = useRecoilState(userInfoState); //내 정보 세팅
  const [memberList, setMemberList] = useRecoilState(memberListAtom);
  const [isReady, setIsReady] = useState(Boolean);
  const roomCode = useRecoilValue(roomCodeAtom);

  //준비 값이 모두 1이면 모달 실행
  const checkAllReady = (readyString: string): boolean => {
    for (const char of readyString) {
      if (char === "0") {
        return false;
      }
    }
    return true;
  };
  // const settingMembers = async (data: any) => {
  //   const userIds = data.users.map((users: any) => users.userId);
  //   console.log("현재까지 들어온 멤버: ", userIds);
  //   const newMemberList = [...userIds];
  //   console.log("나 포함 : ", newMemberList);
  //   await setMemberList(newMemberList);
  //   console.log("memberList : ", memberList);
  // };
  // const settingMembers = async (data: any) => {
  //   const userIds = data.users.map((users: any) => users.userId);
  //   console.log("현재까지 들어온 멤버: ", userIds);
  //   // const ready = data.ready.map((readys: any) => readys.ready);
  //   const newMemberList = [...userIds];
  //   await setMemberList(newMemberList);

  //   // await setMemberList((prevList) => [
  //   //   ...prevList,
  //   //   { userId: "newUser", isReady: false },
  //   // ]);
  // };

  //하나의 함수 안에 지금 enter, preparation 토픽을 한번에 하려고 하고 있음
  //분리하셈
  const settingMembers = async (data: any) => {
    const userIds = data.users.map((user: any) => user.userId);
    const readyString = data.ready;
    const isAllReady = checkAllReady(readyString);
    // member 객체의 isReady 속성을 readyString 값에 따라 설정
    const members = userIds.map((userId: string, index: number) => ({
      userId: userId,
      isReady: readyString[index] === "1",
    }));
    await setMemberList(members);
    // 모두 준비되어 있다면 openModal 함수 실행
    if (isAllReady) {
      openModal();
    }
  };
  const topics: any = {
    "/topic/room/enter/": settingMembers,
    "/topic/room/exit/": (a: any) => {},
    "/topic/room/preparation/": (a: any) => {},
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

  useEffect(() => {
    initConnection();
  }, []);

  useEffect(() => {
    console.log("useEffect memberList >>>>  ", memberList);
  }, []);

  useEffect(() => {
    console.log(memberList);
  }, [memberList]);

  function handleIsReady() {
    // isReady 값을 true로 변경
    setIsReady(true);

    // 이벤트 전송
    sendEvent(
      "/room/preparation",
      {},
      {
        roomCode: roomCode,
        userId: userInfo.userId,
        isReady: true,
      }
    );
  }

  return (
    <>
      {memberList.map((member, index) => (
        <GameProfile
          key={index}
          profileImage={
            "https://cdn.pixabay.com/photo/2023/04/07/06/42/bird-7905654__340.jpg"
          }
          isReady={member.isReady}
          playerName={member.userId}
        />
      ))}

      {/* <GameProfile
        profileImage={
          "https://cdn.pixabay.com/photo/2023/04/07/06/42/bird-7905654__340.jpg"
        }
        isReady={true}
        playerName={userInfo.userId ?? ""}
      /> */}
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
