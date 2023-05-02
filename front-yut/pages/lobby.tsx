import styled, { keyframes } from "styled-components";

import backgroundImage from "../public/image/gyeungbokgung_sunset.jpg";

//로비 페이지
const lobby = () => {
  return (
    <>
      <StyledDiv>
        <StyledContainer>윷짝놀이</StyledContainer>
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

const StyledContainer = styled.div`
  font-size: 40vmin;
  font-weight: bold;
  text-align: center;
  padding: 15vh 0;
  background-image: url(${backgroundImage.src});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
`;

export default lobby;
