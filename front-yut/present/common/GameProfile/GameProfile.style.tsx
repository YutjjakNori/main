import styled from "styled-components";
import PatternSvg from "@/public/icon/ProfilePattern.svg";
import DefaultProfile from "@/public/icon/DefaultProfile.svg";
import { colors } from "@/styles/theme";

const Container = styled.div<{ color: string }>`
  display: inline-block;
  position: relative;
  border: 3px solid ${({ color }) => color ?? "white"};
  width: 10rem;
  height: auto;
  aspect-ratio: 4/3;
  box-sizing: border-box;
  .pattern {
    path {
      fill: ${({ color }) => color ?? "white"};
    }
    &:first-child {
      left: 1px;
      top: 1px;
    }
    &:nth-child(2) {
      right: 1px;
      top: 1px;
      transform: scaleX(-1);
    }
    &:nth-child(3) {
      right: 1px;
      bottom: 1px;
      transform: scaleX(-1) scaleY(-1);
    }
    &:nth-child(4) {
      left: 1px;
      bottom: 1px;
      transform: scaleY(-1);
    }
  }
`;

//경첩 문양
const ContainerPattern = styled(PatternSvg)`
  position: absolute;
  width: 1.5em;
  height: auto;
`;

// 프로필
const ProfileImage = styled.div`
  position: absolute;
  width: 50%;
  height: auto;
  aspect-ratio: 1/1;
  top: 50%;
  left: 50%;
  border-radius: 100%;
  transform: translateX(-50%) translateY(-50%);

  img {
    border-radius: inherit;
  }
`;

const DefaultProfileIcon = styled(DefaultProfile)<{ color: string }>`
  width: 80%;
  height: 80%;
  border-radius: inherit;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  path {
    fill: ${({ color }) => color ?? "black"};
  }
`;

const PlayerName = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  padding-top: 2%;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  background-color: ${colors.achromaticColor.white};
  color: ${colors.achromaticColor.darkBlack};
  width: 80%;
  height: 30%;
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
`;

const Timer = styled.div<{ isShow: boolean }>`
  background-color: rgb(200, 200, 200, 0.8);
  position: absolute;
  top: 0;
  border-radius: inherit;
  width: 100%;
  height: 100%;
  z-index: 2;
  display: ${({ isShow }) => (isShow ? "block" : "none")};

  span {
    position: absolute;
    left: 50%;
    top: 45%;
    transform: translateX(-50%) translateY(-50%);
    font-size: 1.5em;
    font-weight: bold;
  }
`;

export {
  Container,
  ContainerPattern,
  ProfileImage,
  DefaultProfileIcon,
  PlayerName,
  Timer,
};
