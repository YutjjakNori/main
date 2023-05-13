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
    printMessage(
      "SYSTEM",
      `${
        data.users.filter((member) => !isExistMember(member))[0].nickName
      }님이 입장하셨습니다.`
    );

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
      else return false;
    }
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
    if (data.type === "SYSTEM") {
      name = "SYSTEM";
      message = `${
        simpleMemberList.find((member) => member.userId === data.userId)
          ?.nickName || data.userId
      }님이 ${data.content}`;
    } else {
      name = data.userId;
      message = data.content;
    }
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

  return (
    <>
      <div>
        <h1>방코드</h1>
        <h2>{roomCode}</h2>
        <h2>{userInfo.nickName}님</h2>
      </div>
      <style.Container>
        {memberReadyList.map((member, index) => (
          <GameProfile
            key={index}
            profileImage={
              "https://cdn.pixabay.com/photo/2023/04/07/06/42/bird-7905654__340.jpg"
            }
            isReady={member.isReady}
            playerName={member.nickName}
          />
        ))}
        <button
          onClick={() => {
            handleIsReady();
          }}
        >
          준비
        </button>

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
