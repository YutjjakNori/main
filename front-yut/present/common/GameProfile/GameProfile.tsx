import { colors } from "@/styles/theme";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
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
  const router = useRouter();

  const isLarge = useMemo<boolean>(() => {
    return router.isReady ? router.pathname === "/ready" : false;
  }, [router.pathname]);

  // isReady가 변경되면 색깔 변경
  useEffect(() => {
    if (
      (isReady === undefined || isReady === null) &&
      (color === undefined || color === null)
    )
      return;
    if (color) {
      setProfileColor(color);
      return;
    }
    if (isReady) {
      setProfileColor(colors.readyPage.ready);
      return;
    }
    setProfileColor(colors.readyPage.notReady);
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
      <style.Container color={profileColor} large={isLarge.toString()}>
        <style.ContainerPattern
          className="pattern"
          large={isLarge.toString()}
        />
        <style.ContainerPattern
          className="pattern"
          large={isLarge.toString()}
        />
        <style.ContainerPattern
          className="pattern"
          large={isLarge.toString()}
        />
        <style.ContainerPattern
          className="pattern"
          large={isLarge.toString()}
        />

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
