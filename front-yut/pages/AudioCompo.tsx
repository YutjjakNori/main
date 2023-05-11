import React from "react";
import { useRecoilValue } from "recoil";
import { BgmAutoPlayState } from "@/store/GameStore";

const AudioToggleCompo = () => {
  const bgmAutoPlay = useRecoilValue(BgmAutoPlayState);
  console.log(bgmAutoPlay);

  

  return (
    <>
      <audio
        src="/music/lobbyBGM.mp3"
        muted={bgmAutoPlay}
        autoPlay={true}
        loop={true}
      />
    </>
  );
};

export default AudioToggleCompo;
