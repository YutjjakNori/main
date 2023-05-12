import LobbyLayout from "@/present/layout/lobby/LobbyLayout";
import { useRecoilState } from "recoil";
import { BgmMuteState } from "@/store/GameStore";
import CircleButton from "@/present/common/Button/Circle/CircleButton";
import { CircleButtonProps } from "@/present/common/Button/Circle/CircleButton";
import UnMute from "@/public/icon/music/UnMute.svg";
import Mute from "@/public/icon/music/Mute.svg";
import styled from "styled-components";
import { useCallback } from "react";

//로비 페이지
const lobby = () => {
  // console.log(
  //   "process.env.NEXT_PUBLIC_SERVER_URL >>> ",
  //   process.env.NEXT_PUBLIC_SERVER_URL
  // );
  // console.log("process.env.NEXT_PUBLIC_SERVER_URL >>> ");
  // console.log(process.env.NEXT_PUBLIC_SERVER_URL);

  const [bgmMute, setBgmMute] = useRecoilState(BgmMuteState);
  const bgmMuteToggle = () => {
    setBgmMute(!bgmMute);
  };

  const musicBtnInfo: CircleButtonProps = {
    Icon: UnMute,
    fontSize: "",
    text: "",
    color: "#575757",
    backgroundColor: "transparent",
    borderColor: "black",
    margin: "1rem",
  };

  return (
    <>
      {/* <button onClick={autoPlayToggle}>autoPlay Toggle 버튼</button> */}
      <StyledBtnContainer onClick={bgmMuteToggle}>
        <CircleButton
          Icon={bgmMute ? Mute : UnMute}
          fontSize={musicBtnInfo.fontSize}
          text={musicBtnInfo.text}
          color={musicBtnInfo.color}
          backgroundColor={musicBtnInfo.backgroundColor}
          borderColor={musicBtnInfo.borderColor}
          margin={musicBtnInfo.margin}
        />
      </StyledBtnContainer>

      <LobbyLayout />

      {/* <button onClick={play}>Play</button>
      <audio ref={audioRef} src='/static/src.mp3' /> */}
    </>
  );
};

const StyledBtnContainer = styled.div`
  width: 30px;
`;

export default lobby;
