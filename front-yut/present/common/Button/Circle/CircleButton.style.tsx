import styled from "styled-components";
import { CircleButtonProps } from "./CircleButton";

const StyledButton = styled.button<CircleButtonProps>`
  width: 100%; //${(props) => props.width || "0.5 em"};
  aspect-ratio: 1/1;
  border-radius: 50%;
  font-size: ${(props) =>
    props.fontSize || "1em"}; // 부모 요소에서 font-size를 지정해줘야함
  color: ${(props) => props.color || "#black"};
  background-color: ${(props) => props.backgroundColor || "#fff"};
  border: 1px solid ${(props) => props.borderColor || "#fff"};
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  margin: ${(props) => props.margin || "0.4rem"};

  svg {
    width: 50%;
    height: 50%;
  }
`;

export { StyledButton };
