import { colors } from "@/styles/theme";
import styled from "styled-components";

const Container = styled.div`
  width: 80vw;
  height: auto;
  max-height: 80vh;
  aspect-ratio: 5/3;
  position: relative;
  z-index: 0;
`;

const StyledImgBox = styled.div`
  width: 50%;
  height: auto;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  img {
    width: 100%;
    height: auto;
  }
`;

const HoverContainer = styled.div<{ isHover: boolean }>`
  width: 80vw;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  display: ${({ isHover }) => (isHover ? "flex" : "none")};

  :hover {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
  }
`;

const SideBox = styled.div`
  width: 20%;
  height: 100%;
  background-color: rgb(225, 225, 225, 0.5);
  display: inherit;
  position: relative;
  justify-content: center;
  align-items: center;

  :hover {
    cursor: pointer;
  }
`;

const Button = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  position: relative;
  color: ${colors.achromaticColor.lightBlack};
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-use-select: none;
  user-select: none;
`;

const IndicatorBox = styled.div`
  width: 80vw;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
`;

const Indicator = styled.div<{ active: boolean }>`
  width: 1rem;
  height: auto;
  border-radius: 100%;
  aspect-ratio: 1/1;
  background-color: ${({ active }) =>
    active ? colors.gamePlayer[0] : "#E1E1E1"};
`;

export {
  Container,
  StyledImgBox,
  HoverContainer,
  SideBox,
  Button,
  IndicatorBox,
  Indicator,
};
