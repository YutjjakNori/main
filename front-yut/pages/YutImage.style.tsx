import styled from "styled-components";
import { YutImageProps } from "./StyledThrow";

const StyledThrow = styled.div<YutImageProps>`
  /* width: 100%; */

  svg {
    width: ${(props) => props.width || "60%"};
    height: ${(props) => props.height || "60%"};
  }
`;

export { StyledThrow };
