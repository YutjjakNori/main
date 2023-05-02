import styled, { keyframes } from "styled-components";

import backgroundImage from "../public/image/gyeungbokgung_sunset.jpg";

//로비 페이지
const lobby = () => {
  return (
    <>
      <StyledDiv>
        <StyledLogo>윷짝놀이</StyledLogo>
        <StyledContainer>
          <RectButton mainColor="#825A92">방 만들기</RectButton>
          <RectButton mainColor="#F07F7F">참여하기</RectButton>
          <RectButton mainColor="#D8C6AD">게임설명</RectButton>
        </StyledContainer>
      </StyledDiv>
    </>
  );
};
const StyledDiv = styled.div`
  position: relative;
  margin: 0;
  width: 100vw;
  height: 100vh;
`;

const StyledLogo = styled.div`
  font-size: 40vmin;
  font-weight: bold;
  text-align: center;
  padding: 85px 0;
  background-image: url(${backgroundImage.src});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
`;

const StyledContainer = styled.div`
  width: 70vw;
  display: flex;
  justify-content: space-between;
  width: fit-contents;
  margin: auto;
`;

const RectButton = styled.button<{ mainColor: string }>`
  width: 250px;
  padding: 10px;
  font-size: 1.6em;
  font-weight: bold;
  background-color: #ffffff;
  border: ${({ mainColor }) => mainColor ?? "black"} 3px solid;
  border-radius: 30px;
  color: ${({ mainColor }) => mainColor ?? "black"};
  box-shadow: 0px 2px 3px grey;
  position: relative;
  cursor: pointer;
  transition-duration: 0.1s;

  &:active {
    top: 3px;
    box-shadow: none;
  }

  &:hover{
    background-color: ${({ mainColor }) => mainColor ?? "black"};
    color: #ffffff;
  }
`;

export default lobby;
