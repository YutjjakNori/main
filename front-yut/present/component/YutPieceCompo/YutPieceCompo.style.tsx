import styled from "styled-components";

const SvgContainer = styled.div`
  width: fit-content;
  height: auto;
  aspect-ratio: 1/1;
  position: relative;

  svg {
    width: 2rem;
    height: 2rem;
  }
`;

const AppendCount = styled.span`
  position: absolute;
  right: -1rem;
  bottom: 0;
  font-size: 1rem;
`;

export { SvgContainer, AppendCount };
