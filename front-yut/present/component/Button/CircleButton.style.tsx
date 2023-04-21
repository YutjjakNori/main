import styled from "styled-components";
import { CircleButtonProps } from "@/pages/compoTest";

const StyledButton = styled.button<CircleButtonProps>`
  width: 100%; //${(props) => props.width || "10rem"};
  aspect-ratio: 1/1;
  border-radius: 50%;
  color: #575757;
  background-color: ${(props) => props.backgroundColor || "#fff"};
  border: 1px solid ${(props) => props.borderColor || "#fff"};
  text-align: center;
  padding-top: 10%;

  svg {
    width: 50%;
    height: 50%;
  }
`;

export { StyledButton };
