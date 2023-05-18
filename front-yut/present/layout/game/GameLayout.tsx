import PlayerCompo, {
  PlayerCompoProps,
} from "@/present/component/PlayerCompo/PlayerCompo";
import YutBoardCompo from "@/present/component/YutBoardCompo/YutBoardCompo";
import Image from "next/image";
import * as style from "./GameLayout.style";
import HanokBackgroundImage from "@/public/image/GameBackgroundHanok.png";
import GameBackgroundCloudImage from "@/public/image/GameBackgroundCloud.png";

import YutThrowCompo from "@/present/component/YutThrowCompo/YutThrowCompo";

import styled from "styled-components";
import ChatCompo from "@/present/component/ChatCompo/ChatCompo";

interface GameLayoutProps {
  userList: Array<PlayerCompoProps>;
  eventPositionList: Array<number>;
}

const GameLayout = ({ userList, eventPositionList }: GameLayoutProps) => {
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
          </style.RightLayout>
        </div>
      </style.Container>
    </>
  );
};

export default GameLayout;
