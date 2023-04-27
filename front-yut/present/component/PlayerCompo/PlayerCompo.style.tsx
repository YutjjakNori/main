import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
`;

const PieceWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2%;
`;

export { Container, PieceWrapper };
