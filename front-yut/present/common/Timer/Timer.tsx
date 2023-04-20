import { useEffect, useState } from "react";
import * as style from "./Timer.style";

/**
* timer
  @param ss timer를 설정할 초
  @param size font size (px)
  @param color font color
  @handlerOver timer가 끝났을때 행할 함수
*/
interface Timer {
  ss: number;
  size: number;
  color: string;
  handleOver: () => void;
}

const Timer = ({ ss, size, color, handleOver }: Timer) => {
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    setSeconds(ss);
  }, [ss]);

  useEffect(() => {
    if (!seconds) {
      handleOver();
      return;
    }
    const countdown = setInterval(() => {
      if (seconds > 0) {
        setSeconds((current) => current - 1);
      }
      if (seconds === 0) {
        clearInterval(countdown);
      }
    }, 1000);
    return () => clearInterval(countdown);
  }, [seconds]);

  return (
    <>
      <style.StyledTimer className="timer" size={size} color={color}>
        {seconds}
      </style.StyledTimer>
    </>
  );
};

export default Timer;
