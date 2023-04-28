import { useState, useRef } from "react";
import styled from "styled-components";
import CircleButton from "@/present/common/Button/CircleButton";
import { CircleButtonProps } from "@/present/common/Button/CircleButton";

import Do from "@/public/icon/do.svg";
import Gae from "@/public/icon/gae.svg";
import Gul from "@/public/icon/gul.svg";
import Yut from "@/public/icon/yut.svg";
import Mo from "@/public/icon/mo.svg";
import BackDo from "@/public/icon/backDo.svg";

import { YutImageProps } from "./StyledThrow";
import RectButton, {
  RectButtonProps,
} from "@/present/common/Button/RectButton";

interface RectStyleInfo {
  display: string;
}
const YutThrow = () => {
  // const [name, setName] = useState("aaa");
  const images = [
    <Do></Do>,
    <Gae></Gae>,
    <Gul></Gul>,
    <Yut></Yut>,
    <Mo></Mo>,
    <BackDo></BackDo>,
  ];
  const [currentImage, setCurrentImage] = useState(images[0]);

  const [resList, setResList] = useState<Array<string>>([
    "윷",
    "모",
    "윷",
    "윷",
    "모",
  ]);
  const [btnDisplay, setBtnDisplay] = useState<"block" | "none">("block");

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
    // {btnDisplay === "block" ? setBtnDisplay}
    // if (btnThrowYutRef.current?.style.display == "block") {
    //   btnThrowYutRef.current.style.display = "none";
    // }
    // if (btnThrowYutRef.current?.style.display == "block") {
    //   btnThrowYutRef.current.style.display = "none";
    // } else {
    //   btnThrowYutRef.current.style.display = "block";
    // }
    // setBtnDisplay(!btnDisplay);
    setBtnDisplay(btnDisplay === "block" ? "none" : "block");
    // if (btnDisplay === "none") {
    //   btnThrowYutRef.current!.style.display = "none";
    // } else {
    //   btnThrowYutRef.current!.style.display = "block";
    // }
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
        <ImgContainer>
          {currentImage === images[0] ? (
            <Do width={"100%"} height={"100%"}></Do>
          ) : currentImage === images[1] ? (
            <Gae width={"100%"} height={"100%"}></Gae>
          ) : // ) : currentImage === images[2] ? (
          //   <Gul width={"100%"} height={"100%"}></Gul>
          // ) : currentImage === images[3] ? (
          //   <Yut width={"100%"} height={"100%"}></Yut>
          // ) : currentImage === images[4] ? (
          //   <Mo width={"100%"} height={"100%"}></Mo>
          // ) : currentImage === images[5] ? (
          //   <BackDo width={"100%"} height={"100%"}></BackDo>
          null}
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

export default YutThrow;
