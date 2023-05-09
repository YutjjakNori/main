import { colors } from "@/styles/theme";
import styled from "styled-components";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Header = styled.div`
  width: 100vw;
  background-color: ${colors.gamePlayer[0]};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
`;

const HeaderItem = styled.div<{ active: boolean; isLastIndex: boolean }>`
  font-size: 1.5rem;
  font-weight: ${({ active }) => (active ? "bold" : "400")};
  color: ${colors.achromaticColor.white};
  padding: 0 2rem;
  border-right: ${({ isLastIndex }) =>
    isLastIndex ? `3px solid ${colors.achromaticColor.white}` : `0`};
  border-left: 3px solid ${colors.achromaticColor.white};

  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-use-select: none;
  user-select: none;

  transition: transform 2.6s ease-in-out;

  :hover {
    cursor: pointer;
  }
`;

const CarouselContainer = styled.div`
  position: relative;
  dipslay: flex;
  justify-conten: center;
  align-items: center;
`;

export { Container, Header, HeaderItem, CarouselContainer };
