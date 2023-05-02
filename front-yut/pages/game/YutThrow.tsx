import { useState, useRef, useCallback, useEffect } from "react";
import CircleButton from "@/present/common/Button/CircleButton";
import { CircleButtonProps } from "@/present/common/Button/CircleButton";
import * as style from "@/pages/game/YutThrow.style";

import Do from "@/public/icon/yutImage/do.svg";
import Gae from "@/public/icon/yutImage/gae.svg";
import Gul from "@/public/icon/yutImage/gul.svg";
import Yut from "@/public/icon/yutImage/yut.svg";
import Mo from "@/public/icon/yutImage/mo.svg";
import BackDo from "@/public/icon/yutImage/backDo.svg";

import { connect, sending } from "@/actions/socket-api/socketInstance";

import RectButton, {
  RectButtonProps,
} from "@/present/common/Button/RectButton";

interface RectStyleInfo {
  display: string;
}

interface ListItem {
  id: number;
  res: string;
}

const YutThrow = () => {
  useEffect(() => {
    connect();
  }, []);

  const [currentImage, setCurrentImage] = useState(0);

  // resList를 쌓기. --------------------------------- (2)
  // const [resList, setResList] = useState<Array<string>>(["", "", "", "", ""]);
  const [resList, setResList] = useState<ListItem[]>([
    { id: 1, res: "" },
    { id: 2, res: "" },
    { id: 3, res: "" },
    { id: 4, res: "" },
    { id: 5, res: "" },
  ]);

  // 윷 던지기 순서 idx를 관리하는 count 변수
  const [count, setCount] = useState(0);
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

  function throwYut() {
    setBtnDisplay(btnDisplay === "block" ? "none" : "block");

    // 소켓 연결해서 결과를 받기 --------------------------(1)
    // userId, roomCode 를 전역변수에서 나중에 가져와야함.
    // 아래는 임시 dummy 코드.
    const request = { userId: "lewis", roomCode: "abcde" };
    // sending("/game/stick", request);

    const temp = ["윷", "모", "윷", "개"]; // 임시 결과 리스트
    const getYutResult = () => {};

    // '윷 던지기' 버튼을 통해서 서버로부터 윷 결과 받아오기 (?)
    // 윷/모이면 한번더 던져!
    if (temp[count] === "윷" || temp[count] === "모") {
      if (temp[count] === "윷") {
        setCurrentImage(3);
      } else {
        setCurrentImage(4);
      }

      setTimeout(() => {
        setBtnDisplay("block");
      }, 1000);

      setCount(count + 1);
    } else if (temp[count] === "도") {
      setCurrentImage(0);
    } else if (temp[count] === "개") {
      setCurrentImage(1);
    } else if (temp[count] === "걸") {
      setCurrentImage(2);
    } else {
      setCurrentImage(5);
    }

    // setResList(["윷", "", "", "", ""]);
    setResList(
      resList.map((item, index) => {
        if (index === count) {
          return { ...item, res: temp[count] }; // 원하는 index를 새로운 값으로 변경
        }
        return item; // 다른 item들은 그대로 유지
      })
    );

    setBtnDisplay("none");
  }

  return (
    <style.StyledContainer>
      <style.StyledResultList>
        {resList.map((data, index) => {
          return (
            <CircleButton
              text={data.res}
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
