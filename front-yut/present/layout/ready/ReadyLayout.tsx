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
import { UserInfoState } from "@/store/UserStore";
import { RoomCodeState } from "@/store/GameStore";
import { useRecoilState, useRecoilValue } from "recoil";
import ChatCompo from "@/present/component/ChatCompo/ChatCompo";
import {
  MemberListState,
  MemberReadyListState,
  Member,
} from "@/store/MemberStore";
import closeSvg from "@/public/icon/close.svg";
import copySvg from "@/public/icon/copy.svg";
import CircleButton, {
  CircleButtonProps,
} from "@/present/common/Button/Circle/CircleButton";
import * as style from "./ReadyLayout.style";
import { useRouter } from "next/router";
import { MessageLogProps, messageLogState } from "@/store/ChatStore";
import Image from "next/image";
import CherryBlossomImage from "@/public/image/cherryBlossom.png";
import CherryBlossomImage2 from "@/public/image/cherryBlossom2.png";
import CherryGif from "@/public/image/cherryGif.gif";
import CherryGif2 from "@/public/image/cherryGif.gif";
import CherryGif3 from "@/public/image/cherryGif.gif";
import RectButton, {
  RectButtonProps,
} from "@/present/common/Button/Rect/RectButton";
import audioModule from "@/utils/audioModule";
import { UserInteractionState } from "@/store/AudioStore";
import BGMAudioControl from "@/present/common/Audio/BGMAudioControl";
import { BgmMuteState } from "@/store/AudioStore";

import UnMute from "@/public/icon/music/UnMute.svg";
import Mute from "@/public/icon/music/Mute.svg";

const ReadyLayout = () => {
  //준비 버튼
  const readyBtnInfo: RectButtonProps = {
    text: "준비",
    fontSize: "20px",
    backgroundColor: "#6EBA91",
  };

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

  //복사버튼
  const copyBtnInfo: CircleButtonProps = {
    Icon: copySvg,
    fontSize: "",
    text: "",
    color: "#575757",
    backgroundColor: "#FFF",
    borderColor: "gray",
    margin: "0.5rem 0.5rem 0.5rem 2rem ",
  };

  // bgm버튼
  const musicBtnInfo: CircleButtonProps = {
    Icon: "",
    fontSize: "",
    text: "",
    color: "#575757",
    backgroundColor: "transparent",
    borderColor: "black",
    margin: "1rem",
  };

  const router = useRouter();
  const { openModal, closeModal } = useModal(); //모달 Hook
  const [userInfo, setUserInfo] = useRecoilState(UserInfoState); //내 정보 세팅
  const [isReady, setIsReady] = useState("0"); //내 레디상태 관리
  //새로 추가된 유저 파악 용도
  let simpleMemberList: Member[] = [];
  //멤버 아이디 배열
  const [memberList, setMemberList] = useRecoilState(MemberListState);
  //멤버아이디 + 레디상태 관리 배열
  const [memberReadyList, setMemberReadyList] =
    useRecoilState(MemberReadyListState);
  //채팅
  const [messageLog, setMessageLog] =
    useRecoilState<MessageLogProps[]>(messageLogState);

  const roomCode = useRecoilValue(RoomCodeState);

  //채팅메시지 추가 함수
  const printMessage = (name: string, message: string) => {
    setMessageLog((prev) => {
      return [
        ...prev,
        {
          chatName: name,
          chatMessage: message,
        },
      ];
    });
  };

  //대기 - 방 입장 구독 콜백함수
  const settingMembers = (data: { users: Member[]; ready: string }) => {
    const newMembers: Member[] = data.users.filter(
      (member) => !isExistMember(member)
    );
    newMembers.forEach((member) => {
      printMessage("SYSTEM", `${member.nickName}님이 입장하셨습니다.`);
    });
    const filePath = "/audio/userInput.mp3";
    const volume = 0.5;
    audioModule(filePath, volume);

    const newMemberList = [...data.users];
    setMemberList(newMemberList); //유저 아이디와 닉네임 저장
    simpleMemberList = newMemberList;

    const userIds = data.users.map((user: Member) => user.userId);
    // member 객체의 isReady 속성을 readyString 값에 따라 설정
    setMemberReadyList(
      userIds.map((userId: string, index: number) => ({
        userId: userId,
        nickName: data.users[index].nickName,
        isReady: data.ready[index] === "1",
      }))
    );
  };

  //추가된 멤버 찾기
  const isExistMember = (member: Member) => {
    for (let i = 0; i < simpleMemberList.length; i++) {
      const nowMember = simpleMemberList[i];
      if (nowMember.userId === member.userId) return true;
    }
    return false;
  };

  //대기 - 준비 구독 콜백함수
  const preparation = (data: any) => {
    const readyUserId = data.userId;
    const ready = data.ready;
    const start = data.start;

    setMemberReadyList((prev) => {
      // 이전 상태(prev)에서 해당 유저의 정보를 찾아 isReady 값을 업데이트
      return prev.map((member) => {
        if (member.userId === readyUserId) {
          return {
            ...member,
            isReady: ready === "1",
          };
        } else {
          return member;
        }
      });
    });

    // 모두 준비되어 있다면 1초 뒤 openModal 함수 실행
    if (start) {
      setTimeout(() => {
        openModal();
      }, 1000);
    }
  };

  //채팅 구독
  const chattingMessage = (data: any) => {
    let name: string;
    let message: string;

    name = data.userId;
    message = data.content;

    printMessage(name, message);
  };

  const findMember = (userId: string) => {
    for (let i = 0; i < simpleMemberList.length; i++) {
      const nowMember = simpleMemberList[i];
      // 찾으면 멤버 반환
      if (nowMember.userId === userId) return nowMember;
    }
  };

  //대기 - 나가기 구독 콜백함수
  const requestToLeave = (data: any) => {
    const exitUserId = data.userId;

    const filePath = "/audio/userOutput.mp3";
    const volume = 0.6;
    audioModule(filePath, volume);

    printMessage(
      "SYSTEM",
      `${findMember(data.userId)?.nickName || "#알수없음"}님이 퇴장하셨습니다.`
    );
    setMemberReadyList((prev) => {
      // 이전 상태(prev)에서 해당 유저의 정보를 찾아 삭제
      return prev.filter((member) => member.userId !== exitUserId);
    });
    setMemberList((prev) => {
      return prev.filter((member) => member !== exitUserId);
    });
  };

  //구독할 토픽들
  const topics: any = {
    "/topic/room/enter/": settingMembers,
    "/topic/room/preparation/": preparation,
    "/topic/chat/": chattingMessage,
    "/topic/room/exit/": requestToLeave,
  };

  //웹소켓 연결 및 초기 세팅
  async function initConnection() {
    await connect();

    setUserInfo({
      ...userInfo,
      userId: localStorage.getItem("userId") ?? "",
    });
    setMessageLog([]);

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
        nickName: userInfo.nickName,
        roomCode: roomCode,
      }
    );

    return () => {
      if (stompClient?.connected) {
        stompClient?.disconnect();
      }
    };
  }

  useEffect(() => {
    initConnection();
  }, []);

  useEffect(() => {}, [memberReadyList, isReady]);

  //새로고침 시 소켓 해제
  useEffect(() => {
    if (!window) return;
    const disconnectSocket = () => {
      stompClient?.disconnect();
    };

    window?.addEventListener("beforeunload", disconnectSocket);

    return window?.removeEventListener("beforeunload", disconnectSocket);
  }, []);

  //준비 or 준비취소 send
  const handleIsReady = (): void => {
    let ready;
    // isReady 값을 true로 변경
    if (isReady === "1") {
      setIsReady("0");
      ready = "0";
    } else {
      setIsReady("1");
      ready = "1";
    }
    setIsReady(ready);

    sendEvent(
      `/room/preparation`,
      {},
      {
        roomCode: roomCode,
        userId: userInfo.userId,
        ready: ready,
      }
    );
    const filePath = "/audio/readyAudio.mp3";
    const volume = 0.4;
    audioModule(filePath, volume);
  };

  //나가기
  const handleIsExit = (): void => {
    if (stompClient !== null && stompClient !== undefined) {
      stompClient.disconnect();
      router.push("/lobby");
    }
  };

  //방코드 복사
  const copyTextToClipboard = (roomCode: string): void => {
    navigator.clipboard
      .writeText(roomCode)
      .then(() => {
        alert(`방코드 "${roomCode}"가 복사되었습니다!`);
      })
      .catch((error) => {
        console.error(`Could not copy roomCode: ${error}`);
      });
  };

  // BGM 실행
  const [userInteraction, setUserInteraction] =
    useRecoilState(UserInteractionState);

  const userInteract = () => {
    setUserInteraction(!userInteraction);
  };

  const [bgmMute, setBgmMute] = useRecoilState(BgmMuteState);
  const bgmMuteToggle = () => {
    setBgmMute(!bgmMute);
  };

  return (
    <>
      <style.BackgroundImage>
        <Image
          className="cherryBlossom1"
          src={CherryBlossomImage}
          alt="벚꽃1"
        />
      </style.BackgroundImage>
      <style.BackgroundImage>
        <Image className="cherryGif" src={CherryGif} alt="벚꽃gif" />
      </style.BackgroundImage>
      <style.BackgroundImage>
        <Image className="cherryGif3" src={CherryGif3} alt="벚꽃gif3" />
      </style.BackgroundImage>

      <style.BackgroundImage>
        <Image
          className="cherryBlossom2"
          src={CherryBlossomImage2}
          alt="벚꽃2"
        />
      </style.BackgroundImage>
      <style.BackgroundImage>
        <Image className="cherryGif2" src={CherryGif2} alt="벚꽃gif2" />
      </style.BackgroundImage>

      <style.Container>
        <style.RoomInfo>
          <p className="roomCodeTitle">방코드</p>
          <p className="roomCode">{roomCode}</p>
        </style.RoomInfo>
        <style.CopyContainer
          onClick={() => {
            copyTextToClipboard(roomCode);
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

        <style.Container2>
          <style.Container3>
            {memberReadyList.map((member, index) => (
              <GameProfile
                key={index}
                isReady={member.isReady}
                playerName={member.nickName}
              />
            ))}
          </style.Container3>

          <style.RightContainer>
            <ChatCompo />
            <div onClick={handleIsReady}>
              <RectButton
                text={isReady === "0" ? "준비" : "준비 취소"}
                fontSize={readyBtnInfo.fontSize}
                backgroundColor={isReady === "0" ? "#6EBA91" : "#F07F7F"}
              />
            </div>
          </style.RightContainer>

          <style.CopyContainer
            onClick={() => {
              copyTextToClipboard(roomCode);
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

          {/* 모달 */}
          <Modal title={"게임을 시작합니다"}>
            <style.modalBackGround>
              <Timer
                ss={5}
                size={65}
                color={"#000"}
                handleOver={() => {
                  closeModal();
                  router.push("game");
                }}
              />
            </style.modalBackGround>
          </Modal>

          <style.BgmBtnContainer onClick={userInteract}>
            <BGMAudioControl />
            <style.BgmBtnContainer2 onClick={bgmMuteToggle}>
              <CircleButton
                Icon={bgmMute ? Mute : UnMute}
                fontSize={musicBtnInfo.fontSize}
                text={musicBtnInfo.text}
                color={musicBtnInfo.color}
                backgroundColor={musicBtnInfo.backgroundColor}
                borderColor={musicBtnInfo.borderColor}
                margin={musicBtnInfo.margin}
              />
            </style.BgmBtnContainer2>
          </style.BgmBtnContainer>
        </style.Container2>
      </style.Container>
    </>
  );
};

export default ReadyLayout;
