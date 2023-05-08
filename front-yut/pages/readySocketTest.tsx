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
import { UserIsReadyProps } from "@/store/ReadyStore";
import { roomCodeAtom, userInfoState } from "@/store/UserStore";
import { useRecoilState, useRecoilValue } from "recoil";
import ChatCompo from "@/present/component/ChatCompo/ChatCompo";
import { memberListAtom } from "@/store/MemberStore";

const Ready = () => {
  const { openModal, closeModal } = useModal(); //모달 열기
  const [userList, setUserList] = useState<Array<UserIsReadyProps>>([]);
  const [userIsReadyList, setUserIsReadyList] = useState<Array<number>>([]);
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const [memberList, setMemberList] = useRecoilState(memberListAtom);
  const roomCode = useRecoilValue(roomCodeAtom);

  // const settingMembers = (data: any) => {
  //   setMemberList([]);
  //   console.log("현재까지 들어온 멤버: ", data);
  //   const userIds = data.users.map((users: any) => users.userId);
  //   const newMemberList = [...memberList, userInfo.userId, ...userIds];
  //   setMemberList(newMemberList);
  // };
  const settingMembers = async (data: any) => {
    const userIds = data.users.map((users: any) => users.userId);
    console.log("현재까지 들어온 멤버: ", userIds);
    const newMemberList = [...userIds];
    // console.log("나 포함 : ", newMemberList);
    await setMemberList(newMemberList);
    // console.log("memberList : ", memberList);
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

    // console.log("localStorage 안에 userId", localStorage.getItem("userId"));

    //현재까지 들어온 멤버가 옴
    sendEvent(
      `/room/enter`,
      {},
      {
        userId: localStorage.getItem("userId"),
        roomCode: roomCode,
      }
    );
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

  return (
    <>
      <GameProfile
        profileImage={
          "https://cdn.pixabay.com/photo/2023/04/07/06/42/bird-7905654__340.jpg"
        }
        isReady={true}
        playerName={userInfo.userId ?? ""}
      />
      <button onClick={() => openModal()} className="btn">
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
      <p>----------</p>
      {/* <ChatCompo2></ChatCompo2> */}
    </>
  );
};

export default Ready;
