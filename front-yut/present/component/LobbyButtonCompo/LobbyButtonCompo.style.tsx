import styled from "styled-components";
import InputIcon from "@/public/icon/InputCodeIcon.svg";

const Button = styled.button<{
  color: string;
  isEditMode: boolean;
}>`
  width: 250px;
  padding: 10px;
  font-size: 1.6em;
  font-weight: bold;
  background-color: #ffffff;
  border: ${({ color }) => color ?? "black"} 3px solid;
  border-radius: 30px;
  color: ${({ color }) => color ?? "black"};
  box-shadow: 0px 2px 3px grey;
  position: relative;
  cursor: pointer;

  &:active {
    top: 3px;
    box-shadow: none;
  }

  &:hover {
    background-color: ${({ color, isEditMode }) =>
      isEditMode ? "#fff" : color ?? "black"};
    color: #ffffff;
  }
`;

const InputContainer = styled.div`
  display: grid;
  grid-template-columns: auto 4fr;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 1rem;
  padding-left: 0.5rem;
`;

const Icon = styled(InputIcon)`
  height: 100%;
  width: 2rem;
  /* opacity: 0.5; */
`;

const Input = styled.input<{ color: string }>`
  border: none;
  font-size: 2rem;
  font-weight: bold;
  width: 90%;
  color: ${({ color }) => color ?? "black"};
  box-sizing: border-box;

  :focus {
    outline: none;
  }
  ::placeholder {
    font-weight: bold;
    font-size: 1.6rem;
    opacity: 0.5;
    color: ${({ color }) => color ?? "black"};
  }
`;

export { Button, InputContainer, Icon, Input };
