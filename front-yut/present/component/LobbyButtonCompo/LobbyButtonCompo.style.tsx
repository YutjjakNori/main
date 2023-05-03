import styled from "styled-components";

const Button = styled.button<{ color: string }>`
  width: 250px;
  padding: 10px;
  font-size: 1.6em;
  font-weight: bold;
  background-color: #ffffff;
  border: ${({ color: mainColor }) => mainColor ?? "black"} 3px solid;
  border-radius: 30px;
  color: ${({ color: mainColor }) => mainColor ?? "black"};
  box-shadow: 0px 2px 3px grey;
  position: relative;
  cursor: pointer;
  transition-duration: 0.1s;

  &:active {
    top: 3px;
    box-shadow: none;
  }

  &:hover {
    background-color: ${({ color: mainColor }) => mainColor ?? "black"};
    color: #ffffff;
  }
`;

export { Button };
