import { colors } from "@/styles/theme";
import Image, { StaticImageData } from "next/image";
import React, { useEffect, useState } from "react";
import Timer from "../Timer/Timer";
import * as style from "./GameProfile.style";

interface GameProfileProps {
  profileImage?: string | StaticImageData;
  playerName: string;
  isReady?: boolean;
  color?: string;
  timerSeconds?: number;
}

const GameProfile = ({
  profileImage,
  isReady,
  playerName,
  color,
  timerSeconds,
}: GameProfileProps) => {
  const [profileColor, setProfileColor] = useState<string>(
    colors.readyPage.notReady
  );
  const [seconds, setSeconds] = useState<number>(0);

  // isReady가 변경되면 색깔 변경
  useEffect(() => {
    if (!isReady && !color) return;
    if (color) {
      setProfileColor(color);
      return;
    }
    if (isReady) {
      setProfileColor(colors.readyPage.ready);
      return;
    }
  }, [isReady]);

  useEffect(() => {
    if (!timerSeconds) {
      setSeconds(0);
      return;
    }
    setSeconds(timerSeconds);
  }, [timerSeconds]);

  function resetTimer() {
    setSeconds(0);
  }

  return (
    <>
      <style.Container color={profileColor}>
        <style.ContainerPattern className="pattern" />
        <style.ContainerPattern className="pattern" />
        <style.ContainerPattern className="pattern" />
        <style.ContainerPattern className="pattern" />

        <style.ProfileImage>
          <style.Timer isShow={seconds > 0}>
            <Timer
              ss={seconds}
              size={30}
              color={"#fff"}
              handleOver={resetTimer}
            />
          </style.Timer>
          {profileImage ? (
            <Image src={profileImage} alt="사용자 프로필 이미지" fill />
          ) : (
            <style.DefaultProfileIcon color={profileColor} />
          )}
        </style.ProfileImage>
        <style.PlayerName>{playerName}</style.PlayerName>
      </style.Container>
    </>
  );
};

export default React.memo(GameProfile);
export type { GameProfileProps };
