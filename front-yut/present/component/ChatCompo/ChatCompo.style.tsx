// chatting component style
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #000;
  border-radius: 15px;
  background-color: rgba(256, 256, 256, 0.9);
  padding: 10px;
  width: 100%;
  height: 100%;
`;

const ChatLogContent = styled.div`
  display: flex;
  left: 0;
  flex-direction: column;
  align-items: flex-start; /* 채팅 로그 내용을 왼쪽에 정렬 */
`;

const ChatLogBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 380px;
  margin-bottom: 10px;

  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }
  &::-webkit-scrollbar-thumb {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }
`;
const ChatInoutBox = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 280px;
  bottom: 0px;
`;
const ChatInput = styled.input`
  width: 200px;
  height: 50px;
  border: none;
  background: transparent;
  outline: none; /* 포커스 시 기본 효과 제거 */
  caret-color: black; /* 커서 색상 설정 */
  justify-content: flex-end;
`;

const FormDiv = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  bottom: 0;
`;

export {
  Container,
  ChatLogBox,
  ChatInoutBox,
  ChatInput,
  ArrowButton,
  FormDiv,
  ChatLogContent,
};
