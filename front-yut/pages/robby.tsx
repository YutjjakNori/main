//로비 페이지

import StyledCircleButton from "../present/component/StyledCircleButton";
import StyledLobbyButton from "../present/component/StyledLobbyButton";

export interface ButtonInfo {
  backgroundColor: string;
  text: string;
}

const Robby = () => {
  const makeRoomInfo: ButtonInfo = {
    backgroundColor: "#ea857c",
    text: "방 만들기",
  };
  // const participateRoomInfo: ButtonInfo = {
  //   backgroundColor: "#E2035C",
  //   text: "참여하기",
  // };
  return (
    <>
      <StyledLobbyButton
        backgroundColor={makeRoomInfo.backgroundColor}
        text={makeRoomInfo.text}
      />

      <StyledCircleButton />
    </>
  );
};

export default Robby;
