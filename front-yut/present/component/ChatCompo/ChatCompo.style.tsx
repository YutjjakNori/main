// chatting component style
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
`;

const ChatBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2%;
`;

const ChatLogBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
`;
const ChatInoutBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
`;

export { Container, ChatBox, ChatLogBox, ChatInoutBox };
