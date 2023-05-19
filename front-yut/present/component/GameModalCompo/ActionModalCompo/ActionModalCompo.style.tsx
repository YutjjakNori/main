import styled from "styled-components";

const Text = styled.div`
  font-size: 1.2em;
  text-align: center;
  span {
    font-size: 1.3em;
    font-weight: bold;
  }
`;

const ButtonWrapper = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
`;

export { Text, ButtonWrapper };
