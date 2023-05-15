import BGMAudioControl from "./BGMAudioControl";
import type { Meta, StoryObj } from "@storybook/react";
import { RecoilRoot, useRecoilState } from "recoil";
import { BgmMuteState, UserInteractionState } from "@/store/AudioStore";
import CircleButton from "@/present/common/Button/Circle/CircleButton";
import { CircleButtonProps } from "@/present/common/Button/Circle/CircleButton";
import * as style from "./BGMAudioControl.style";

import UnMute from "@/public/icon/music/UnMute.svg";
import Mute from "@/public/icon/music/Mute.svg";

const TestBGMAudioControl = () => {
  const [userInteraction, setUserInteraction] =
    useRecoilState(UserInteractionState);

  const userInteract = () => {
    setUserInteraction(!userInteraction);
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

  const [bgmMute, setBgmMute] = useRecoilState(BgmMuteState);
  const bgmMuteToggle = () => {
    setBgmMute(!bgmMute);
  };

  return (
    <>
      <style.StyledContainer onClick={userInteract}>
        <p> 아무곳을 클릭하여 bgm 음악을 재생하세요! </p>
        <BGMAudioControl />
        <style.StyledContainer2 onClick={bgmMuteToggle}>
          <CircleButton
            Icon={bgmMute ? Mute : UnMute}
            fontSize={musicBtnInfo.fontSize}
            text={musicBtnInfo.text}
            color={musicBtnInfo.color}
            backgroundColor={musicBtnInfo.backgroundColor}
            borderColor={musicBtnInfo.borderColor}
            margin={musicBtnInfo.margin}
          />
        </style.StyledContainer2>
      </style.StyledContainer>
    </>
  );
};

const meta: Meta = {
  title: "BGMAudioControl", //storybook에서 보이는 실제 title
  component: TestBGMAudioControl, //rendering 할 componenet

  decorators: [
    (Story) => (
      <RecoilRoot>
        <Story />
      </RecoilRoot>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof TestBGMAudioControl>;

export const Default: Story = {};
