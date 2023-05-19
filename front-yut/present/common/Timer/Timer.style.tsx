import styled from "styled-components";

const StyledTimer = styled.span<{ size: number; color: string }>`
  z-index: inherit;
  font-weight: bold;
  font-size: ${({ size }) => size ?? "12"}px;
  color: ${({ color }) => color ?? "black"};
`;

export { StyledTimer };
