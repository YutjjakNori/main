//로비 페이지
import styled from "styled-components";
import CircleButton from "@/present/common/Button/Circle/CircleButton";
import RectButton from "@/present/common/Button/Rect/RectButton";
import { CircleButtonProps } from "@/present/common/Button/Circle/CircleButton";
import { RectButtonProps } from "@/present/common/Button/Rect/RectButton";

import { useRecoilState } from "recoil";
import { BgmMuteState, UserInteractionState } from "@/store/AudioStore";

import Svg from "@/public/icon/close.svg";
import UnMute from "@/public/icon/music/UnMute.svg";
import Mute from "@/public/icon/music/Mute.svg";

import BGMAudioControl from "@/present/common/Audio/BGMAudioControl";

const CompoTest = () => {
  // 만들고자 하는 컴포넌트의 정보를 여기에서 설정! (버튼 사이즈는 아래 container div에서 설정!)
  const makeRoomBtnInfo: RectButtonProps = {
    text: "게임 방법",
    fontSize: "15px",
    backgroundColor: "#3C3262",
  };
  const exitBtnInfo: CircleButtonProps = {
    Icon: Svg,
    fontSize: "",
    text: "",
    color: "#575757",
    backgroundColor: "#EA857C",
    borderColor: "transparent",
    margin: "1rem",
  };

  const musicBtnInfo: CircleButtonProps = {
    Icon: "",
    fontSize: "",
    text: "",
    color: "#575757",
    backgroundColor: "transparent",
    borderColor: "black",
    margin: "1rem",
  };

  const [userInteraction, setUserInteraction] =
    useRecoilState(UserInteractionState);
  const [bgmMute, setBgmMute] = useRecoilState(BgmMuteState);
  const bgmMuteToggle = () => {
    setBgmMute(!bgmMute);
  };

  const userInteract = () => {
    setUserInteraction(!userInteraction);
  };

  return (
    <StyledContainer onClick={userInteract}>
      <p> 아무곳을 클릭하여 bgm 음악을 재생하세요! </p>
      <BGMAudioControl />
      <StyledContainer1>
        <RectButton
          text={makeRoomBtnInfo.text}
          fontSize={makeRoomBtnInfo.fontSize}
          backgroundColor={makeRoomBtnInfo.backgroundColor}
        />
      </StyledContainer1>

      <StyledContainer2>
        <CircleButton
          Icon={exitBtnInfo.Icon}
          fontSize={exitBtnInfo.fontSize}
          text={exitBtnInfo.text}
          color={exitBtnInfo.color}
          backgroundColor={exitBtnInfo.backgroundColor}
          borderColor={exitBtnInfo.borderColor}
          margin={exitBtnInfo.margin}
        />
      </StyledContainer2>

      <StyledContainer3 onClick={bgmMuteToggle}>
        <CircleButton
          Icon={bgmMute ? Mute : UnMute}
          fontSize={musicBtnInfo.fontSize}
          text={musicBtnInfo.text}
          color={musicBtnInfo.color}
          backgroundColor={musicBtnInfo.backgroundColor}
          borderColor={musicBtnInfo.borderColor}
          margin={musicBtnInfo.margin}
        />
      </StyledContainer3>
    </StyledContainer>
  );
};
const StyledContainer = styled.div`
  margin: 10px;
`;

const StyledContainer1 = styled.div`
  margin-bottom: 10px;
  width: 110px;
`;

const StyledContainer2 = styled.div`
  width: 30px;
`;

const StyledContainer3 = styled.div`
  width: 30px;
`;

export default CompoTest;
