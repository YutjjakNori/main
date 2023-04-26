import styled from "styled-components";

const Modal = styled.div`
  background: #fff;
  width: 500px;
  height: 320px;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0px 4px 4px gray;
  /* 우선순위 주기, 적용한 영역이 position;static이 아니여야함 */
  z-index: 100;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  font-size: 25px;
`;

// const Body = styled.div<{
//   scrollY: string;
// }>`
//   padding-top: 10px;
//   position: fixed;
//   top: 10px;
//   /* top: -${({ scrollY }) => scrollY ?? "10"}px; */
//   overflow-y: scroll;
//   width: 100%;
// `;

const Body = styled.div`
  padding-top: 10px;
  position: fixed;
  top: 10px;
  overflow-y: scroll;
  width: 100%;
`;

const Overlay = styled.div`
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

export { Modal, Header, Body, Overlay };
