import BackgroundTextCompo from "@/present/component/BackgroundTextCompo/BackgroundTextCompo";
import LobbyButtonCompo from "@/present/component/LobbyButtonCompo/LobbyButtonCompo";
import { colors } from "@/styles/theme";
import * as style from "./LobbyLayout.style";

const LobbyLayout = () => {
  const buttonInfoList = [
    {
      color: colors.gamePlayer[0],
      text: "방 만들기",
      isEditable: false,
      handler: () => {},
    },
    {
      color: colors.gamePlayer[1],
      text: "참여하기",
      isEditable: true,
      handler: () => {},
    },
    {
      color: colors.gamePlayer[3],
      text: "게임 방법",
      isEditable: false,
      handler: () => {},
    },
  ];

  return (
    <>
      <style.Container>
        <BackgroundTextCompo />
        <style.ButtonContainer>
          {buttonInfoList.map((button) => (
            <LobbyButtonCompo key={button.text} {...button} />
          ))}
        </style.ButtonContainer>
      </style.Container>
    </>
  );
};

export default LobbyLayout;
