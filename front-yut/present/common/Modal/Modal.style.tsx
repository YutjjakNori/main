import styled from "styled-components";

export const ModalWrapper = styled.div`
  background: #fff;
  width: 500px;
  height: 600px;
  border-radius: 20px;
  padding: 20px;
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
  background-color: rgba(0, 0, 0, 0.7);
`;
