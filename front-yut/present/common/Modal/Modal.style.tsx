import styled from "styled-components";

export const Modal = styled.div`
  background: #fff;
  width: 500px;
  height: 600px;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0px 4px 4px gray;
  /* 우선순위 주기, 적용한 영역이 position;static이 아니여야함 */
  z-index: 100;
`;

export const Header = styled.div`
  display: flex;
  justify-content: center;
  font-size: 25px;
`;

export const Body = styled.div`
  padding-top: 10px;
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
`;
