import styled from "styled-components";
import { RectStyleInfo } from "@/present/component/YutThrowCompo/YutThrowCompo";
import YutBackIcon from "@/public/icon/yutImage/YutBack.svg";
import YutFrontIcon from "@/public/icon/yutImage/YutFront.svg";

const StyledContainer = styled.div`
  position: relative;
  text-align: center;
  background-color: #f0f6ff;
  width: 45%;
  right: 11%;
  /* margin: auto;  */
`;

const YutFront = styled(YutFrontIcon)`
  height: 10rem;
  width: auto;
`;
const YutBack = styled(YutBackIcon)`
  height: 10rem;
  width: auto;
`;

const StyledResultList = styled.div`
  position: relative;
  width: 100%;
  font-weight: bold;
  font-size: 1em;
  color: red;
  margin: auto;
  display: grid;
  gap: 0rem;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr; // 최대 5개
  justify-content: space-around;
`;

const ImgContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  gap: 5px;
  justify-content: center;
`;

// const RectContainer = styled.div<{ display: string }>`
const RectContainer = styled.div<RectStyleInfo>`
  position: absolute;
  width: 70%;
  height: 40%;
  top: 30%;
  left: 50%;
  transform: translateY(0%) translateX(-50%);
  display: ${(props) => props.display || "block"};
`;

const StyledResult = styled.div`
  position: relative;
  margin-top: 5%;
`;

export {
  StyledContainer,
  StyledResultList,
  ImgContainer,
  YutFront,
  YutBack,
  RectContainer,
  StyledResult,
};
