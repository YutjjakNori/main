//로비 페이지
import CircleButton from "@/present/common/Button/Circle/CircleButton";
import RectButton from "@/present/common/Button/Rect/RectButton";
import { CircleButtonProps } from "@/present/common/Button/Circle/CircleButton";
import { RectButtonProps } from "@/present/common/Button/Rect/RectButton";
import styled from "styled-components";

import Svg from "@/public/icon/close.svg";

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

  return (
    <StyledContainer>
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

export default CompoTest;
