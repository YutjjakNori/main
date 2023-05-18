import CircleButton from "@/present/common/Button/Circle/CircleButton";
import { CircleButtonProps } from "@/present/common/Button//Circle/CircleButton";
import * as style from "@/present/component/YutThrowCompo/YutThrowCompo.style";

import RectButton, {
  RectButtonProps,
} from "@/present/common/Button/Rect/RectButton";
import useYutThrow from "@/actions/hook/useYutThrow";
import { ThrowResultType, YutjjakType } from "@/types/game/YutThrowTypes";
import { useCallback, useEffect, useState } from "react";

interface RectStyleInfo {
  display: string;
}

const YutThrowCompo = () => {
  const { canIThrow, resultList, throwYut, resultType } = useYutThrow();
  const [yutjjakIconList, setYutjjakIconList] = useState<Array<YutjjakType>>([
    "back",
    "back",
    "back",
    "back",
  ]);

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

  const setRandomYutIconList = useCallback((resultType: ThrowResultType) => {
    let frontCnt = 0;
    switch (resultType) {
      case "도":
        frontCnt = 1;
        break;
      case "개":
        frontCnt = 2;
        break;
      case "걸":
        frontCnt = 3;
        break;
      case "윷":
        frontCnt = 4;
        break;
      case "모":
        setYutjjakIconList(["back", "back", "back", "back"]);
        return;
    }

    let array: Array<YutjjakType> = ["back", "back", "back", "back"];
    let indices: Array<number> = [];

    // frontCount 개수만큼의 랜덤한 인덱스를 선택함.
    while (indices.length < frontCnt) {
      let index = Math.floor(Math.random() * 4);
      if (!indices.includes(index)) {
        indices.push(index);
      }
    }

    for (let i = 0; i < indices.length; i++) {
      array[indices[i]] = "front"; // 선택된 인덱스에 "front"를 할당합니다.
    }

    setYutjjakIconList(array);
  }, []);

  useEffect(() => {
    setRandomYutIconList(resultType);
  }, [resultType]);

  return (
    <style.StyledContainer>
      <style.StyledResultList>
        {resultList.map((data, index) => {
          return <CircleButton {...yutResultInfo} text={data} key={index} />;
        })}
      </style.StyledResultList>

      <style.StyledResult>
        <style.ImgContainer>
          {yutjjakIconList.map((type, index) => {
            if (type === "front") {
              return <style.YutFront key={`yutjjak-${index}`} />;
            }
            return <style.YutBack key={`yutjjak-${index}`} />;
          })}
        </style.ImgContainer>
        <style.RectContainer
          onClick={throwYut}
          display={canIThrow ? "block" : "none"}
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
export default YutThrowCompo;
