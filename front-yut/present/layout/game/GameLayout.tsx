import PlayerCompo, {
  PlayerCompoProps,
} from "@/present/component/PlayerCompo/PlayerCompo";
import YutBoardCompo from "@/present/component/YutBoardCompo/YutBoardCompo";
import Image from "next/image";
import * as style from "./GameLayout.style";
import HanokBackgroundImage from "@/public/image/GameBackgroundHanok.png";
import GameBackgroundCloudImage from "@/public/image/GameBackgroundCloud.png";

import YutThrowCompo from "@/present/component/YutThrowCompo/YutThrowCompo";

import ChatCompo from "@/present/component/ChatCompo/ChatCompo";
import RectButton, {
  RectButtonProps,
} from "@/present/common/Button/Rect/RectButton";
import audioModule from "@/utils/audioModule";
import { useRecoilState } from "recoil";
import { MessageLogProps, messageLogState } from "@/store/ChatStore";
import { Member, MemberListState } from "@/store/MemberStore";
import { stompClient } from "@/actions/socket-api/socketInstance";
import router from "next/router";

interface GameLayoutProps {
  userList: Array<PlayerCompoProps>;
  eventPositionList: Array<number>;
}

const GameLayout = ({ userList, eventPositionList }: GameLayoutProps) => {
  let simpleMemberList: Member[] = [];
  const [memberList, setMemberList] = useRecoilState(MemberListState);
  //채팅
  const [messageLog, setMessageLog] =
    useRecoilState<MessageLogProps[]>(messageLogState);
  const exitBtnInfo: RectButtonProps = {
    text: "나가기",
    fontSize: "19px",
    backgroundColor: "#EA857C",
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

    setMemberList((prev) => {
      return prev.filter((member) => member !== exitUserId);
    });
  };
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
  const findMember = (userId: string) => {
    for (let i = 0; i < simpleMemberList.length; i++) {
      const nowMember = simpleMemberList[i];
      // 찾으면 멤버 반환
      if (nowMember.userId === userId) return nowMember;
    }
  };
  //나가기
  const handleIsExit = (): void => {
    if (stompClient !== null && stompClient !== undefined) {
      stompClient.disconnect();
      router.push("/lobby");
    }
  };
  return (
    <>
      <style.BackgroundImage>
        <Image className="hanok" src={HanokBackgroundImage} alt="한옥 처마" />
      </style.BackgroundImage>
      <style.BackgroundImage>
        <Image className="cloud1" src={GameBackgroundCloudImage} alt="구름1" />
      </style.BackgroundImage>
      <style.BackgroundImage>
        <Image className="cloud2" src={GameBackgroundCloudImage} alt="구름2" />
      </style.BackgroundImage>
      <style.BackgroundImage>
        <Image className="cloud3" src={GameBackgroundCloudImage} alt="구름3" />
      </style.BackgroundImage>
      <style.Container>
        <style.LeftLayout>
          {userList.map((user) => (
            <PlayerCompo key={user.playerName} {...user} />
          ))}
        </style.LeftLayout>
        <YutBoardCompo eventPositionList={eventPositionList} />
        {/* 윷 던지기, 채팅 */}
        <div>
          <style.RightLayout>
            <YutThrowCompo />
            <style.ChatContainer>
              <ChatCompo />
            </style.ChatContainer>
            <style.ButtonContainer
              onClick={() => {
                handleIsExit();
              }}
            >
              <RectButton
                text={exitBtnInfo.text}
                fontSize={exitBtnInfo.fontSize}
                backgroundColor={exitBtnInfo.backgroundColor}
              />
            </style.ButtonContainer>
          </style.RightLayout>
        </div>
      </style.Container>
    </>
  );
};

export default GameLayout;
