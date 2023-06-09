import styled from "styled-components";

const Container = styled.div`
  background-color: #f0f6ff;
  margin: 0;
  width: 100vw;
  height: 100vh;
`;

const RoomInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 20vh;
  opacity: 1;
  .roomCodeTitle {
    font-size: 36px;
    font-weight: 400;
  }
  .roomCode {
    font-weight: 600;
    font-size: 48px;
  }
`;
const CherryBlossomImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 439px;
  height: 439px;
  object-fit: cover;
`;

const Container2 = styled.div`
  position: relative;
  margin: 0;
  width: 100vw;
  height: 50vh;
`;

const CopyContainer = styled.div`
  position: fixed;
  top: 9.5vh;
  left: 55vw;
  width: 35px;
`;

const ExitContainer = styled.div`
  display: flex;
  position: fixed;
  top: 10px;
  right: 45px;
  align-items: center;
`;

const ExitAlertContainer = styled.div`
  position: relative;
  margin-left: 10px;

  .btn-alert-text {
    width: 110px;
    height: 48px;
    padding: 15px 19px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 15px;
    color: #ffffff;
    position: absolute;
    opacity: 0;
    transition: all ease 0.5s;
    right: 0px;
    top: 100%;
    pointer-events: none; /* 클릭 이벤트 비활성화 */
  }

  .btn-alert:hover + .btn-alert-text {
    opacity: 1;
    position: absolute;
  }
`;

const BackgroundImage = styled.div`
  position: fixed;
  .cherryBlossom1 {
    left: 0;
    top: 0;
    width: 23vw;
    height: auto;
    opacity: 0.6;
  }
  .cherryBlossom2 {
    position: inherit;
    right: 0;
    top: 15vh;
    z-index: 0;
    width: 25vw;
    height: auto;
    opacity: 0.6;
  }
  .cherryGif {
    position: inherit;
    top: 31vh;
    left: 10px;
    width: 30vw;
    opacity: 0.3;
  }
  .cherryGif2 {
    position: inherit;
    top: 40vh;
    right: 10px;
    width: 30vw;
    opacity: 0.3;
  }
  .cherryGif3 {
    position: inherit;
    top: 5vh;
    left: 35vw;
    width: 30vw;
    opacity: 0.3;
  }
`;

const RightContainer = styled.div`
  position: absolute;
  right: 3%;
  display: grid;
  width: 20%;
  gap: 1rem;
`;

const ChatingContatiner = styled.div`
  display: flex;
  position: fixed;
  top: 20vh;
  right: 0;
  align-items: center;
  width: 28%;
`;

const Container3 = styled.div`
  position: absolute;
  left: 25vw;
  top: 5vh;

  display: grid;
  place-items: center;
  grid-template-rows: repeat(2, 200px);
  grid-template-columns: repeat(2, 200px);
  grid-row-gap: 17px;
  grid-column-gap: 120px;
`;

const BgmBtnContainer = styled.div``; // BGMAudio 컴포넌트 실행을 위한 컨테이너

const BgmBtnContainer2 = styled.div`
  width: 2vw;
  position: fixed;
  top: 12%;
  right: 6%;
`;

const modalBackGround = styled.div`
  margin-top: 75px;
`;

export {
  Container3,
  Container2,
  Container,
  CherryBlossomImg,
  ExitContainer,
  CopyContainer,
  ExitAlertContainer,
  BackgroundImage,
  RoomInfo,
  ChatingContatiner,
  BgmBtnContainer,
  BgmBtnContainer2,
  modalBackGround,
  RightContainer,
};
