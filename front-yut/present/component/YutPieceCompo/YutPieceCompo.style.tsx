import styled from "styled-components";

const SvgContainer = styled.div<{ isClickable: boolean }>`
  width: fit-content;
  height: auto;
  aspect-ratio: 1/1;
  position: relative;

  :hover {
    transform: ${({ isClickable }) => (isClickable ? "scale(1.1)" : "none")};
    cursor: ${({ isClickable }) => (isClickable ? "pointer" : "auto")};
  }

  svg {
    width: 2rem;
    height: 2rem;
  }
`;

const AppendCount = styled.div<{ color: string }>`
  position: absolute;
  right: 0rem;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  background-color: ${({ color }) => color};
  border-radius: 100%;
  width: auto;
  height: 1.8rem;
  aspect-ratio: 1;

  span {
    position: relative;
    font-size: 1.5rem;
    color: white;
  }
`;

export { SvgContainer, AppendCount };
