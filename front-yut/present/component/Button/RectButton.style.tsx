import styled from "styled-components";

const StyledButton = styled.button<{
  backgroundColor: string;
  fontSize: string;
}>`
  width: 100%;
  padding: 10px;
  font-size: ${({ fontSize }) => fontSize ?? "1em"};
  background-color: ${({ backgroundColor }) => backgroundColor ?? "black"};
  border-radius: 20px;
  border-style: none;
  color: white;
  position: relative;
  cursor: pointer;
  transition-duration: 0.1s;

  &:active {
    top: 3px;
    box-shadow: none;
  }
`;

export { StyledButton };
