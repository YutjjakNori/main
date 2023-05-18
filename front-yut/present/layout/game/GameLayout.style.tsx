import { colors } from "@/styles/theme";
import styled from "styled-components";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 3rem;
  background-color: ${colors.gamePage.background};
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr;
  justify-content: center;
  align-items: center;

  /* 사용자 프로필 */
  div:first-child {
    align-items: flex-start;
  }
  /* 채팅, 윷 던지기 */
  div:last-child {
    align-items: flex-end;
  }
`;

const ChatContainer = styled.div`
  width: 65%;
  height: 75%;
`;

const LeftLayout = styled.div`
  position: relative;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  gap: 2rem;
`;

const BackgroundImage = styled.div`
  position: fixed;
  .hanok {
    left: 0;
    top: 0;
    width: 23vw;
    height: auto;
    opacity: 0.8;
  }
  .cloud1 {
    position: inherit;
    left: 13vw;
    top: 30vh;
    z-index: 0;
    width: 25vw;
    height: auto;
    opacity: 0.5;
  }
  .cloud2 {
    position: inherit;
    left: 20vw;
    bottom: 0vh;
    z-index: 0;
    width: 24vw;
    height: auto;
    opacity: 0.5;
  }
  .cloud3 {
    position: inherit;
    right: 10vw;
    top: 15vh;
    z-index: 0;
    width: 25vw;
    height: auto;
    opacity: 0.5;
  }
`;

const RightLayout = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  height: calc(100vh - 4.5rem);
`;

export { Container, LeftLayout, BackgroundImage, ChatContainer, RightLayout };
