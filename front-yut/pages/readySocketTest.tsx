//게임 대기 페이지

import GameProfile from "@/present/common/GameProfile/GameProfile";
import Modal from "@/present/common/Modal/Modal";
import Timer from "@/present/common/Timer/Timer";
import useModal from "@/actions/hook/controlModal";
import ChatCompo from "@/present/component/ChatCompo/ChatCompo";
import { useCallback, useEffect, useState } from "react";
import * as socketUtil from "@/utils/socketUtils";
import { readyTopic } from "@/actions/socket-api/readySocketInstance";
import {
  connect,
  onError,
  stompClient,
} from "@/actions/socket-api/socketInstance";
import { UserIsReadyProps } from "@/store/ReadyStore";

const Ready = () => {
  const { openModal, closeModal } = useModal(); //모달 열기
  const [userList, setUserList] = useState<Array<UserIsReadyProps>>([]);
  const [userIsReadyList, setUserIsReadyList] = useState<Array<number>>([]);

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

  const subscribeTopics = useCallback(() => {
    if (stompClient) {
      socketUtil.subscribeEvent(readyTopic.roomExit);
      socketUtil.subscribeEvent(readyTopic.readyState);
      // socketUtil.subscribeEvent(readyTopic.readyUserList, saveUser);
    }
  }, []);

  useEffect(() => {
    connect(subscribeTopics);
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
      <ChatCompo></ChatCompo>
    </>
  );
};

export default Ready;
