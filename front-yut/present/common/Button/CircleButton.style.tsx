import styled from "styled-components";
import { CircleButtonProps } from "@/present/common/Button/CircleButton";

const StyledButton = styled.button<CircleButtonProps>`
  width: 100%; //${(props) => props.width || "10rem"};
  aspect-ratio: 1/1;
  border-radius: 50%;
  font-size: ${(props) =>
    props.fontSize || "1em"}; // 부모 요소에서 font-size를 지정해줘야함
  color: ${(props) => props.color || "#black"};
  background-color: ${(props) => props.backgroundColor || "#fff"};
  border: 1px solid ${(props) => props.borderColor || "#fff"};
  text-align: center;
  /* padding-top: 10%; */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  margin: 1rem;

  svg {
    width: 50%;
    height: 50%;
  }
`;

export { StyledButton };
