import { colors } from "@/styles/theme";
import styled from "styled-components";

const Container = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 25vw;
  height: 30vh;
  border-radius: 50px;
  background-color: ${colors.achromaticColor.white};
  border: 1px solid ${colors.achromaticColor.black};

  display: ${({ visible }) => (visible ? "block" : "none")};
`;

const TextBox = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export { Container, TextBox };
