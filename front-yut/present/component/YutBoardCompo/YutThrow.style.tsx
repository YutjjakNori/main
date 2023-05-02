import styled from "styled-components";
import { RectStyleInfo } from "@/component/YutBoardCompo/YutThrow";

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
  font-size: 1em;
  color: red;
  margin: auto;
  display: grid;
  gap: 1rem;
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

export {
  StyledContainer,
  StyledResultList,
  ImgContainer,
  RectContainer,
  StyledResult,
};
