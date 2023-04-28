import { useState } from "react";
import styled from "styled-components";
import CircleButton from "@/present/common/Button/CircleButton";
import { CircleButtonProps } from "@/present/common/Button/CircleButton";

import Do from "@/public/icon/do.svg";
import Gae from "@/public/icon/gae.svg";
import RectButton, {
  RectButtonProps,
} from "@/present/common/Button/RectButton";

interface RectStyleInfo {
  display: string;
}

const YutThrow = () => {
  const images = [<Do></Do>, <Gae></Gae>];
  const [currentImage, setCurrentImage] = useState(images[0]);

  // const [name, setName] = useState("aaa");
  const [resList, setResList] = useState<Array<string>>([
    "윷",
    "모",
    "윷",
    "윷",
    "모",
  ]);
  const [btnDisplay, setBtnDisplay] = useState<"block" | "none">("block");
  // const [yutResult, setYutResult] = useState<string>("");

  const yutResultInfo: CircleButtonProps = {
    text: "윷",
    fontSize: "",
    color: "black",
    backgroundColor: "#D9D9D9",
    borderColor: "transparent",
    margin: "0rem",
  };

  const yutThrowBtnInfo: RectButtonProps = {
    text: "윷 던지기",
    fontSize: "18px",
    backgroundColor: "#6EBA91",
  };

  function throwYut() {
    setBtnDisplay(btnDisplay === "block" ? "none" : "block");
    // 여기서 소켓 통신하여 얻어낸 윷 결과를 치환.
    setCurrentImage(images[1]);
  }

  return (
    <StyledContainer>
      {/* <StyledName>{name}님의 차례</StyledName> */}
      <StyledResultList>
        {resList.map((data) => {
          return (
            <CircleButton
              text={data}
              fontSize={yutResultInfo.fontSize}
              color={yutResultInfo.color}
              backgroundColor={yutResultInfo.backgroundColor}
              borderColor={yutResultInfo.borderColor}
              margin={yutResultInfo.margin}
            />
          );
        })}
      </StyledResultList>

      <StyledResult>
        {/* <ImgContainer>{currentImage}</ImgContainer> */}
        <ImgContainer>
          <Do></Do>
        </ImgContainer>
        {/* <RectContainer ref={btnThrowYutRef} onClick={throwYut}> */}
        <RectContainer
          onClick={() => {
            throwYut();
          }}
          display={btnDisplay}
        >
          <RectButton
            text={yutThrowBtnInfo.text}
            fontSize={yutThrowBtnInfo.fontSize}
            backgroundColor={yutThrowBtnInfo.backgroundColor}
          />
        </RectContainer>
      </StyledResult>
      {/* <StyledThrow2>
      </StyledThrow2> */}
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  position: relative;
  text-align: center;
  background-color: #f0f6ff;
  width: 30%;
  margin: auto;
`;

// const StyledContainer2 = styled.div`
//   width: 50%;33
//   margin: auto;
// `;

const StyledResultList = styled.div`
  position: relative;
  width: 100%;
  font-weight: bold;
  font-size: 1.2em;
  color: red;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr; // 최대 5개
  justify-content: space-around;
`;

const ImgContainer = styled.div`
  position: relative;
`;

// const RectContainer = styled.div<{ display: string }>`
const RectContainer = styled.div<RectStyleInfo>`
  position: absolute;
  width: 70%;
  height: 40%;
  top: 35%;
  left: 50%;
  transform: translateY(0%) translateX(-50%);
  display: ${(props) => props.display || "block"};
`;

const StyledResult = styled.div`
  position: relative;
  margin-top: 5%;
`;

// const StyledName = styled.h2`
//   /* font-family: */
//   margin-bottom: 1%;
// `;

export default YutThrow;
