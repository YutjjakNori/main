import styled from "styled-components";

const Container = styled.div`
  position: relative;
  margin: 0;
  width: 100vw;
  height: 100vh;
`;

const ButtonContainer = styled.div`
  width: 70vw;
  display: flex;
  justify-content: space-between;
  width: fit-contents;
  margin: auto;
`;

const inputNickName = styled.div`
  justify-content: space-between;
  position: relative;
  margin-top: 45%;
  width: 400px;
`;

const ExitModalContainer = styled.div`
  position: relative;
  margin: 15% 30%;
  width: 150px;
`;

export { Container, ButtonContainer, ExitModalContainer, inputNickName };
