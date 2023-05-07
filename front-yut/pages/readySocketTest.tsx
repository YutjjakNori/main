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

const Ready = () => {
  const { openModal, closeModal } = useModal(); //모달 열기
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const [userList, setUserList] = useState<Array<UserIsReadyProps>>([]);
  const [userIsReadyList, setUserIsReadyList] = useState<Array<number>>([]);
  const roomCode = useRecoilValue(roomCodeAtom);
  // const saveUser = useCallback((users: Array<any>, isReady: Array<number>) => {
  //   const isReadyList: Array<number> = isReady.map((ready, index) => {
  //     return {
  //       isReady: ready,
  //     };
  //   });
  //   const saveUserList: Array<UserIsReadyProps> = users.map((user, index) => {
  //     return {
  //       userId: user.userId,
  //       playerName: user.userId,
  //       isReady: user.ready,
  //     };
  //   });
  //   setUserList([...saveUserList]);
  //   setUserIsReadyList([...isReadyList]);
  // }, []);

  const settingMembers = (data: any) => {
    console.log("현재까지 들어온 멤버: ", data);
    data.users.userId;
  };

  const topics: any = {
    "/topic/room/enter/": settingMembers,
    "/topic/room/exit/": (a: any) => {},
    "/topic/room/preparation/": (a: any) => {},
  };

  async function initConnection() {
    await connect();

    for (let key in topics) {
      subscribeTopic(key + roomCode, topics[key]);
    }

    setUserInfo({
      ...userInfo,
      userId: localStorage.getItem("userId") ?? "",
      playerName: localStorage.getItem("playerName") ?? "",
    });

    sendEvent(
      `/room/enter`,
      {},
      {
        userId: userInfo.userId,
        roomCode: roomCode,
      }
    );
  }

  useEffect(() => {
    initConnection();
  }, []);

  return (
    <>
      <GameProfile
        profileImage={
          "https://cdn.pixabay.com/photo/2023/04/07/06/42/bird-7905654__340.jpg"
        }
        isReady={true}
        playerName={"박재희"}
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
      <ChatCompo2></ChatCompo2>
    </>
  );
};

export default Ready;
