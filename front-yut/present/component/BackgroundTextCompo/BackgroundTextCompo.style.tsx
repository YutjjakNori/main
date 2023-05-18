import backgroundImage from "@/public/image/crop.gif";
import styled, { keyframes } from "styled-components";
import pattern1 from "@/public/image/pattern1.png";
import pattern2 from "@/public/image/pattern2.png";
import pattern3 from "@/public/image/pattern3.png";
import pattern4 from "@/public/image/pattern4.png";

const MainText = styled.div`
  font-family: CWDangamAsac-Bold;
  font-size: 43vmin;
  font-weight: bold;
  text-align: center;
  padding: 85px 0;
  background-image: url(${backgroundImage.src});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  z-index: 1;

  /* 드래그 금지 */
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

//여기서부터는 문양 움직이는 프레임
const flyCycle = keyframes`
	100% {
		background-position: -900px 0;
	}
`;

// const flyRightOne = keyframes`
// 	0% {
// 		transform: scale(0.3) translateX(-10vw);
// 	}
// 	10% {
// 		transform: translateY(2vh) translateX(10vw) scale(0.4);
// 	}
// 	20% {
// 		transform: translateY(0vh) translateX(30vw) scale(0.5);
// 	}
// 	30% {
// 		transform: translateY(4vh) translateX(50vw) scale(0.6);
// 	}
// 	40% {
// 		transform: translateY(2vh) translateX(70vw) scale(0.6);
// 	}
// 	50% {
// 		transform: translateY(0vh) translateX(90vw) scale(0.6);
// 	}
// 	60% {
// 		transform: translateY(-3vh) translateX(110vw) scale(0.6);
// 	}
// 	100% {
// 		transform: translateY(-3vh) translateX(110vw) scale(0.6);
// 	}
// `;
// const flyRightTwo = keyframes`
// 	0% {
// 		transform: translateY(-4vh) translateX(-10vw) scale(0.5);
// 	}
// 	10% {
// 		transform: translateY(-2vh) translateX(10vw) scale(0.4);
// 	}
// 	20% {
// 		transform: translateY(-10vh) translateX(30vw) scale(0.6);
// 	}
// 	30% {
// 		transform: translateY(4vh) translateX(50vw) scale(0.45);
// 	}
// 	40% {
// 		transform: translateY(-5.5vh) translateX(70vw) scale(0.5);
// 	}
// 	50% {
// 		transform: translateY(0vh) translateX(90vw) scale(0.45);
// 	}
// 	51% {
// 		transform: translateY(10vh) translateX(110vw) scale(0.45);
// 	}
// 	100% {
// 		transform: translateY(10vh) translateX(110vw) scale(0.45);
// 	}
// `;

const flyRightOne = keyframes`
	0% {
		transform: scale(0.3) translateX(-10vw) translateY(0vh);
	}
	10% {
		transform: translateY(2vh) translateX(10vw) scale(0.4);
	}
	20% {
		transform: translateY(0vh) translateX(30vw) scale(0.5);
	}
	30% {
		transform: translateY(4vh) translateX(50vw) scale(0.6);
	}
	40% {
		transform: translateY(2vh) translateX(70vw) scale(0.6);
	}
	50% {
		transform: translateY(0vh) translateX(90vw) scale(0.6);
	}
	60% {
		transform: translateY(-3vh) translateX(110vw) scale(0.6);
	}
	100% {
		transform: translateY(-3vh) translateX(110vw) scale(0.6);
	}
`;

const flyRightTwo = keyframes`
	0% {
		transform: translateY(-4vh) translateX(-10vw) scale(0.5);
	}
	10% {
		transform: translateY(-2vh) translateX(10vw) scale(0.4);
	}
	20% {
		transform: translateY(-10vh) translateX(30vw) scale(0.6);
	}
	30% {
		transform: translateY(4vh) translateX(50vw) scale(0.45);
	}
	40% {
		transform: translateY(-5.5vh) translateX(70vw) scale(0.5);
	}
	50% {
		transform: translateY(0vh) translateX(90vw) scale(0.45);
	}
	51% {
		transform: translateY(10vh) translateX(110vw) scale(0.45);
	}
	100% {
		transform: translateY(10vh) translateX(110vw) scale(0.45);
	}
`;

const Pattern = styled.div`
  background-size: auto 100%;
  width: 207px;
  height: 207px;
  will-change: background-position;
  animation-name: ${flyCycle};
  animation-timing-function: steps(50);
  animation-iteration-count: infinite;
`;

const Pattern1 = styled(Pattern)`
  background-image: url(${pattern1.src});
`;
const Pattern2 = styled(Pattern)`
  background-image: url(${pattern2.src});
`;
const Pattern3 = styled(Pattern)`
  background-image: url(${pattern3.src});
`;
const Pattern4 = styled(Pattern)`
  background-image: url(${pattern4.src});
`;

const PatternContainer = styled.div`
  position: absolute;
  top: 20%;
  left: -10%;
  transform: scale(0) translateX(-10vw);
  will-change: transform;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
`;

const PatternOne = styled(PatternContainer)`
  animation-name: ${flyRightOne};
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-duration: 15s;
  animation-delay: 0;
  z-index: -1;
`;

const PatternTwo = styled(PatternContainer)`
  animation-name: ${flyRightTwo};
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-duration: 16s;
  animation-delay: 1s;
  z-index: -1;
`;

const PatternThree = styled(PatternContainer)`
  animation-name: ${flyRightOne};
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-duration: 18.5s;
  animation-delay: 2.5s;
  z-index: -1;
`;

const PatternFour = styled(PatternContainer)`
  animation-name: ${flyRightTwo};
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-duration: 20.25s;
  animation-delay: 5s;
  z-index: -1;
`;

export {
  MainText,
  Pattern1,
  Pattern2,
  Pattern3,
  Pattern4,
  PatternContainer,
  PatternOne,
  PatternTwo,
  PatternThree,
  PatternFour,
};
