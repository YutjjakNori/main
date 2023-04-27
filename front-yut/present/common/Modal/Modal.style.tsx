import styled from "styled-components";

const Modal = styled.div`
  background: #fff;
  width: 500px;
  height: 320px;
  border-radius: 20px;
  padding: 50px 100px 50px 100px;
  overflow: hidden;
  box-shadow: 0px 4px 4px gray;
  /* 우선순위 주기, 적용한 영역이 position;static이 아니여야함 */
  z-index: 100;
  position: absolute;
`;

const Header = styled.div`
  font-size: 35px;
  font-weight: 700;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Body = styled.div`
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
`;

const Time = styled.div`
  padding: 24px;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100%;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
`;

export { Modal, Body, Time, Header, Overlay };
