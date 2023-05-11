import React from "react";
import { useRecoilValue } from "recoil";
import { BgmMuteState } from "@/store/GameStore";

const AudioToggleCompo = () => {
  const bgmMute = useRecoilValue(BgmMuteState);
  console.log(bgmMute);

  return (
    <>
      <audio
        playsInline={true}
        controls={true}
        src="/audio/lobbyBGM.mp3"
        muted={bgmMute}
        autoPlay={true}
        loop={true}
      />
    </>
  );
};

export default AudioToggleCompo;
