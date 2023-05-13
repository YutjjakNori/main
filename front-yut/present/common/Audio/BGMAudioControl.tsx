import React, { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { BgmMuteState, UserInteractionState } from "@/store/AudioStore";

const BGMAudioControl = () => {
  const bgmMute = useRecoilValue(BgmMuteState);
  const userInteract = useRecoilValue(UserInteractionState);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (audioElement && userInteract === true) {
      audioElement.play();
    }
  }, [userInteract]);

  return (
    <audio
      // controls
      ref={audioRef}
      src="../../../public/audio/lobbyBGM.mp3"
      muted={bgmMute}
      loop
      id="playAudio"
    />
  );
};

export default BGMAudioControl;
