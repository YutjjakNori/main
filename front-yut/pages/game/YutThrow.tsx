import { useState, useRef, useCallback } from "react";
import CircleButton from "@/present/common/Button/CircleButton";
import { CircleButtonProps } from "@/present/common/Button/CircleButton";
import * as style from "@/pages/game/YutThrow.style";

import Do from "@/public/icon/yutImage/do.svg";
import Gae from "@/public/icon/yutImage/gae.svg";
import Gul from "@/public/icon/yutImage/gul.svg";
import Yut from "@/public/icon/yutImage/yut.svg";
import Mo from "@/public/icon/yutImage/mo.svg";
import BackDo from "@/public/icon/yutImage/backDo.svg";

import RectButton, {
  RectButtonProps,
} from "@/present/common/Button/RectButton";

interface RectStyleInfo {
  display: string;
}

// 소켓 통신으로 서버에서 윷 결과 받아오기.

const YutThrow = () => {
  const [currentImage, setCurrentImage] = useState(0);

  // 소켓 연결해서 결과를 받기 --------------------------(1)
  


  // resList를 쌓기. --------------------------------- (2)
  const [resList, setResList] = useState<Array<string>>(["", "", "", "", ""]);
  const [btnDisplay, setBtnDisplay] = useState<"block" | "none">("block");
  const getYutSvgByIndex = useCallback((index: number) => {
    switch (index) {
      case 0:
        return <Do width={"100%"} height={"100%"} />;
      case 1:
        return <Gae width={"100%"} height={"100%"} />;
      case 2:
        return <Gul width={"100%"} height={"100%"} />;
      case 3:
        return <Yut width={"100%"} height={"100%"} />;
      case 4:
        return <Mo width={"100%"} height={"100%"} />;
      case 5:
        return <BackDo width={"100%"} height={"100%"} />;
    }
  }, []);

  const yutResultInfo: CircleButtonProps = {
    text: "윷",
    fontSize: "",
    color: "black",
    backgroundColor: "#D9D9D9",
    borderColor: "transparent",
    margin: "0rem",
  };

  const yutThrowBtnInfo: RectButtonProps = {
    text: "윷 던지기",
    fontSize: "18px",
    backgroundColor: "#6EBA91",
  };

  // 소켓 연결해서 결과를 받기 --------------------------(1)
  function throwYut() {
    setBtnDisplay(btnDisplay === "block" ? "none" : "block");
    setCurrentImage(5);
  }

  return (
    <style.StyledContainer>
      <style.StyledResultList>
        {resList.map((data) => {
          return (
            <CircleButton
              text={data}
              fontSize={yutResultInfo.fontSize}
              color={yutResultInfo.color}
              backgroundColor={yutResultInfo.backgroundColor}
              borderColor={yutResultInfo.borderColor}
              margin={yutResultInfo.margin}
            />
          );
        })}
      </style.StyledResultList>

      <style.StyledResult>
        <style.ImgContainer>
          {getYutSvgByIndex(currentImage)}
        </style.ImgContainer>
        <style.RectContainer
          onClick={() => {
            throwYut();
          }}
          display={btnDisplay}
        >
          <RectButton
            text={yutThrowBtnInfo.text}
            fontSize={yutThrowBtnInfo.fontSize}
            backgroundColor={yutThrowBtnInfo.backgroundColor}
          />
        </style.RectContainer>
      </style.StyledResult>
    </style.StyledContainer>
  );
};

export type { RectStyleInfo };
export default YutThrow;
