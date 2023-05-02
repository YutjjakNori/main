import { colors } from "@/styles/theme";
import styled, { css } from "styled-components";

const cornerPointSize = 15;
const miniPointSize = 4;

const size1 = 13;
const size2 = 28;

const Container = styled.div`
  border: 2px solid ${colors.achromaticColor.lightBlack};
  width: 36rem;
  height: auto;
  aspect-ratio: 8/7;
  position: relative;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="100%" y2="100%" stroke="black" /></svg>'),
    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="100%" x2="100%" y2="0" stroke="black" /></svg>');

  .leftTop {
    left: -${cornerPointSize / 2}%;
    top: -${cornerPointSize / 2}%;
  }
  .leftBottom {
    left: -${cornerPointSize / 2}%;
    bottom: -${cornerPointSize / 2}%;
  }
  .rightTop {
    right: -${cornerPointSize / 2}%;
    top: -${cornerPointSize / 2}%;
  }
  .rightBottom {
    right: -${cornerPointSize / 2}%;
    bottom: -${cornerPointSize / 2}%;
  }
  .center {
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }

  .miniTop {
    flex-direction: row;
    top: -${miniPointSize / 2}rem;
    left: ${cornerPointSize / 2}%;
    width: calc(100% - ${cornerPointSize}%);
    height: ${miniPointSize}rem;
    padding: 0 5%;
  }
  .miniLeft {
    flex-direction: column;
    top: ${cornerPointSize / 2}%;
    left: -${miniPointSize / 2}rem;
    width: ${miniPointSize}rem;
    height: calc(100% - ${cornerPointSize}%);
    padding: 6% 0;
  }
  .miniBottom {
    flex-direction: row;
    bottom: -${miniPointSize / 2}rem;
    left: ${cornerPointSize / 2}%;
    width: calc(100% - ${cornerPointSize}%);
    height: ${miniPointSize}rem;
    padding: 0 5%;
  }
  .miniRight {
    flex-direction: column;
    top: ${cornerPointSize / 2}%;
    right: -${miniPointSize / 2}rem;
    width: ${miniPointSize}rem;
    height: calc(100% - ${cornerPointSize}%);
    padding: 6% 0;
  }

  .leftCross1 {
    top: ${size1}%;
    left: ${size1}%;
    position: absolute;
  }
  .leftCross2 {
    top: ${size2}%;
    left: ${size2}%;
    position: absolute;
  }
  .leftCross3 {
    bottom: ${size2}%;
    right: ${size2}%;
    position: absolute;
  }
  .leftCross4 {
    bottom: ${size1}%;
    right: ${size1}%;
    position: absolute;
  }
  .rightCross1 {
    top: ${size1}%;
    right: ${size1}%;
    position: absolute;
  }
  .rightCross2 {
    top: ${size2}%;
    right: ${size2}%;
    position: absolute;
  }
  .rightCross3 {
    bottom: ${size2}%;
    left: ${size2}%;
    position: absolute;
  }
  .rightCross4 {
    bottom: ${size1}%;
    left: ${size1}%;
    position: absolute;
  }
`;

const PointStyle = css`
  position: absolute;
  aspect-ratio: 1/1;
  border-radius: 100%;
  border: inherit;
`;

const PieceSize = css`
  .piece {
    top: 50%;
    left: 50%;
    position: absolute;
    width: 4.5rem;
    height: 4.5rem;
    svg {
      width: 100%;
      height: 100%;
      transform: translate(-50%, -50%);
    }
  }
`;

const CornerPoint = styled.div<{ type: string }>`
  width: ${cornerPointSize}%;
  ${PointStyle}

  background-color: ${({ type }) =>
    type === "blue" ? colors.gamePage.darkBlue : colors.gamePage.darkPink};

  div:nth-child(1) {
    ${PointStyle}
    width: 70%;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    background-color: ${({ type }) =>
      type === "blue" ? colors.gamePage.blue : colors.gamePage.pink};
  }

  ${PieceSize}
`;

const MiniPoint = styled.div`
  ${PointStyle}
  border: 2px solid ${colors.achromaticColor.lightBlack};
  background-color: ${colors.achromaticColor.white};
  position: relative;
  box-sizing: border-box;
  width: ${miniPointSize}rem;

  ${PieceSize}
`;

const MiniList = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-between;
  width: fit-contents;
`;

//--------------------
export { Container, CornerPoint, MiniPoint, MiniList };
