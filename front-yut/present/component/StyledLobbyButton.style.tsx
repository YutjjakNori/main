import styled from "styled-components";

const StyledDiv = styled.div`
  padding: 10px;
  /* height: 500px; */
`;

const StyledButton = styled.button<{ backgroundColor: string }>`
  width: 100%;
  /* height: fit-content; */
  padding: 0px 10px;
  font-size: medium;
  background-color: ${({ backgroundColor }) => backgroundColor ?? "black"};
  border-radius: 20px;
  border-style: none;
  color: white;
  position: relative;
  cursor: pointer;
  transition-duration: 0.1s;
  /* -webkit-box-shadow: 0 2px 0 #ea857cb7;
  box-shadow: 0 2px 0 #ea857cb7; */

  &:active {
    top: 3px;
    box-shadow: none;
  }
`;

export { StyledDiv, StyledButton };
