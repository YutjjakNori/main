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

interface GameLayoutProps {
  userList: Array<PlayerCompoProps>;
}

const GameLayout = ({ userList }: GameLayoutProps) => {
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
        <YutBoardCompo />
        {/* 윷 던지기, 채팅 */}
        <div>
          <RightLayout>
            <YutThrowCompo />
          </RightLayout>
        </div>
      </style.Container>
    </>
  );
};

const RightLayout = styled.div`
  position: relative;
  /* left: 0; */
  /* top: 0; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
`;

export default GameLayout;
