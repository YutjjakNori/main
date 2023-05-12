import { useState } from "react";
import CircleButton from "@/present/common/Button/Circle/CircleButton";
import { CircleButtonProps } from "@/present/common/Button//Circle/CircleButton";
import * as style from "@/present/component/YutThrowCompo/YutThrowCompo.style";

import Do from "@/public/icon/yutImage/do.svg";
import Gae from "@/public/icon/yutImage/gae.svg";
import Gul from "@/public/icon/yutImage/gul.svg";
import Yut from "@/public/icon/yutImage/yut.svg";
import Mo from "@/public/icon/yutImage/mo.svg";
import BackDo from "@/public/icon/yutImage/backDo.svg";

import RectButton, {
  RectButtonProps,
} from "@/present/common/Button/Rect/RectButton";
import useYutThrow from "@/actions/hook/useYutThrow";

interface RectStyleInfo {
  display: string;
}

const yutResultImg = {
  도: <Do width={"100%"} height={"100%"} />,
  개: <Gae width={"100%"} height={"100%"} />,
  걸: <Gul width={"100%"} height={"100%"} />,
  윷: <Yut width={"100%"} height={"100%"} />,
  모: <Mo width={"100%"} height={"100%"} />,
  빽도: <BackDo width={"100%"} height={"100%"} />,
  "": null,
};

const YutThrowCompo = () => {
  const { canThrowYut, resultList, throwYut, resultType } = useYutThrow();

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
    fontSize: "15px",
    backgroundColor: "#6EBA91",
  };

  return (
    <style.StyledContainer>
      <style.StyledResultList>
        {resultList.map((data, index) => {
          return <CircleButton {...yutResultInfo} text={data} key={index} />;
        })}
      </style.StyledResultList>

      <style.StyledResult>
        <style.ImgContainer>{yutResultImg[resultType]}</style.ImgContainer>
        <style.RectContainer onClick={throwYut} display={canThrowYut}>
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
export default YutThrowCompo;
