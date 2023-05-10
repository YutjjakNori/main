import styled from "styled-components";

const Container = styled.div`
  position: relative;
  margin: 0;
  width: 100vw;
  height: 100vh;
`;

const ExitContainer = styled.div`
  position: relative;
  width: 30px;
`;

const SoundContainer = styled.div`
  position: relative;
  width: 30px;
`;

const CopyContainer = styled.div`
  position: relative;
  width: 30px;
`;

const ExitAlertContainer = styled.div`
  .btn-alert-text {
    width: 110px;
    height: 48px;
    padding: 15px 19px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 15px;
    color: #ffffff;
    position: absolute;
    opacity: 0;
    transition: all ease 0.5s;
    margin: 0px 15px;
  }
  .btn-alert:hover + .btn-alert-text {
    opacity: 1;
  }
`;

export {
  Container,
  ExitContainer,
  CopyContainer,
  ExitAlertContainer,
  SoundContainer,
};
