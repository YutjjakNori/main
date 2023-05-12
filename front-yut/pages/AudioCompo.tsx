import React, { useCallback, useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { BgmMuteState, UserInteractionState } from "@/store/GameStore";
import styled from "styled-components";

const AudioToggleCompo = () => {
  const bgmMute = useRecoilValue(BgmMuteState);
  const userInteract = useRecoilValue(UserInteractionState);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    console.log(userInteract);
    const audioElement = audioRef.current;
    console.log(audioElement);

    if (audioElement && userInteract === true) {
      audioElement.play();
    }

    // return () => {
    //   if (audioElement) {
    //     audioElement.pause();
    //     audioElement.currentTime = 0;
    //   }
    // };
  }, [userInteract]);

  return (
    <>
      <StyledDiv>
        <audio
          ref={audioRef}
          src="/audio/lobbyBGM.mp3"
          muted={bgmMute}
          loop
          id="playAudio"
        />
      </StyledDiv>
    </>
  );
};

const StyledDiv = styled.div``;

export default AudioToggleCompo;
