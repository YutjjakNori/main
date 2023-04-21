import { colors } from "@/styles/theme";
import styled, { css } from "styled-components";

const cornerPointSize = 15;
const miniPointSize = 4;

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
`;

const PointStyle = css`
  position: absolute;
  aspect-ratio: 1/1;
  border-radius: 100%;
  border: inherit;
`;

const CornerPoint = styled.div<{ type: string }>`
  width: ${cornerPointSize}%;
  ${PointStyle}

  background-color: ${({ type }) =>
    type === "blue" ? colors.gamePage.darkBlue : colors.gamePage.darkPink};

  div {
    ${PointStyle}
    width: 70%;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    background-color: ${({ type }) =>
      type === "blue" ? colors.gamePage.blue : colors.gamePage.pink};
  }
`;

const MiniPoint = styled.div`
  ${PointStyle}
  border: 2px solid ${colors.achromaticColor.lightBlack};
  background-color: ${colors.achromaticColor.white};
  position: relative;
  width: ${miniPointSize}rem;
`;

const MiniList = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-between;
  width: fit-contents;
`;

const size1 = 13;
const size2 = 28;

const MiniLeftCross1 = styled(MiniPoint)`
  top: ${size1}%;
  left: ${size1}%;
  position: absolute;
`;
const MiniLeftCross2 = styled(MiniPoint)`
  top: ${size2}%;
  left: ${size2}%;
  position: absolute;
`;
const MiniLeftCross3 = styled(MiniPoint)`
  bottom: ${size2}%;
  right: ${size2}%;
  position: absolute;
`;
const MiniLeftCross4 = styled(MiniPoint)`
  bottom: ${size1}%;
  right: ${size1}%;
  position: absolute;
`;
//--------------------
const MiniRightCross1 = styled(MiniPoint)`
  top: ${size1}%;
  right: ${size1}%;
  position: absolute;
`;
const MiniRightCross2 = styled(MiniPoint)`
  top: ${size2}%;
  right: ${size2}%;
  position: absolute;
`;
const MiniRightCross3 = styled(MiniPoint)`
  bottom: ${size2}%;
  left: ${size2}%;
  position: absolute;
`;
const MiniRightCross4 = styled(MiniPoint)`
  bottom: ${size1}%;
  left: ${size1}%;
  position: absolute;
`;
export {
  Container,
  CornerPoint,
  MiniPoint,
  MiniList,
  MiniLeftCross1,
  MiniLeftCross2,
  MiniLeftCross3,
  MiniLeftCross4,
  MiniRightCross1,
  MiniRightCross2,
  MiniRightCross3,
  MiniRightCross4,
};
