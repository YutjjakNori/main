import { useCallback, useEffect, useState } from "react";
import { YutPieceCompoProps } from "../YutPieceCompo/YutPieceCompo";
import CornerPoint from "./Point/CornerPointCompo";
import MiniPoint from "./Point/MiniPointCompo";
import * as style from "./YutBoardCompo.style";
import { useRecoilState } from "recoil";
import { YutPieceListState } from "@/store/GameStore";
import ArrowIconCompo from "./ArrowCompo/ArrowCompo";
import { cornerIndex } from "@/utils/gameUtils";
import EventPoint from "./EventPoint";

import Option0 from "@/public/icon/eventItems/0.svg";
import Option1 from "@/public/icon/eventItems/1.svg";
import Option2 from "@/public/icon/eventItems/2.svg";
import Option3 from "@/public/icon/eventItems/3.svg";
import Option4 from "@/public/icon/eventItems/4.svg";
import styled from "styled-components";

// TODO: 소켓 통신하여 이벤트칸 위치정보 2개 받아오기.
// 임시 정보
const eventPointList = [2, 7]; // -------------------- (1)

const pieceFilterByIndex = (
  index: number,
  pieceList: Array<YutPieceCompoProps>
) => {
  return pieceList.filter(
    (piece) => piece.state === "InBoard" && piece.position === index
  );
};

const createMiniPoint = (
  cornerIndex: number,
  classStr: string,
  pieceList: Array<YutPieceCompoProps>
): JSX.Element => {
  if (eventPointList[0] === cornerIndex || eventPointList[1] === cornerIndex) {
    return (
      <EventPoint
        id={cornerIndex}
        classStr={classStr}
        pieceList={pieceFilterByIndex(cornerIndex, pieceList)}
      />
    );
  } else {
    return (
      <MiniPoint
        id={cornerIndex}
        classStr={classStr}
        pieceList={pieceFilterByIndex(cornerIndex, pieceList)}
      />
    );
  }
};

const createCornerPoint = (
  id: number,
  type: string,
  point: string,
  pieceList: Array<YutPieceCompoProps>
) => (
  <CornerPoint
    id={id}
    type={type}
    point={point}
    pieceList={pieceFilterByIndex(id, pieceList)}
  />
);

const YutBoardCompo = () => {
  const [pieceList] = useRecoilState(YutPieceListState);
  const [showOption0, setShowOption0] = useState(false);
  const [showOption1, setShowOption1] = useState(false);
  const [showOption2, setShowOption2] = useState(false);
  const [showOption3, setShowOption3] = useState(false);
  const [showOption4, setShowOption4] = useState(false);

  function toggleOption0() {
    console.log(true);
    setShowOption0(true);
    // 2초 후 false로 바꾸기.
    setTimeout(() => setShowOption0(false), 2000);
  }
  function toggleOption1() {
    setShowOption1(true);
    // 2초 후 false로 바꾸기.
    setTimeout(() => setShowOption1(false), 2000);
  }
  function toggleOption2() {
    console.log(true);
    setShowOption2(true);
    // 2초 후 false로 바꾸기.
    setTimeout(() => setShowOption2(false), 2000);
  }
  function toggleOption3() {
    console.log(true);
    setShowOption3(true);
    // 2초 후 false로 바꾸기.
    setTimeout(() => setShowOption3(false), 2000);
  }
  function toggleOption4() {
    console.log(true);
    setShowOption4(true);
    // 2초 후 false로 바꾸기.
    setTimeout(() => setShowOption4(false), 2000);
  }

  const takeAction = (index: number) => {
    switch (index) {
      case 0:
        toggleOption0();
        break;
      case 1:
        toggleOption1();
        break;
      case 2:
        toggleOption2();
        break;
      case 3:
        toggleOption3();
        break;
      case 4:
        toggleOption4();
        break;
    }
  };

  const request = {
    roomCode: "abcde",
    userId: "lewis",
  };

  // 서버에 요청 전송
  const getEventResult = () => {
    // 응답 데이터에 따라 함수 실행하기
    /*
    0: 꽝 / 1: 한번더던지기
    2: 말 업고가기 / 3: 출발했던 자리로 / 4: 처음으로 돌아가기
    */
    const result = 1;
    takeAction(result);
  };

  return (
    <>
      {/* <button onClick={() => "getEventResult"}>이벤트칸</button> */}
      <button onClick={getEventResult}>이벤트칸</button>

      <style.Container>
        {/* eventContainer로 명칭 바꾸기 */}
        <StyledKKwangContainer>
          {/* <Nothing width={"100%"} height={"100%"} /> */}
          {showOption0 ? <Option0 width={"100%"} height={"100%"} /> : null}
          {showOption1 ? <Option1 width={"100%"} height={"100%"} /> : null}
          {showOption2 ? <Option2 width={"100%"} height={"100%"} /> : null}
          {showOption3 ? <Option3 width={"100%"} height={"100%"} /> : null}
          {showOption4 ? <Option4 width={"100%"} height={"100%"} /> : null}
        </StyledKKwangContainer>
        {createCornerPoint(10, "blue", "leftTop", pieceList)}
        {/* 분기점 */}
        <ArrowIconCompo classStr={"cornerLeftTop1"} position={10} />
        <ArrowIconCompo classStr={"cornerLeftTop2"} position={10} />
        {createCornerPoint(15, "blue", "leftBottom", pieceList)}
        {/* 분기점 */}
        {createCornerPoint(5, "blue", "rightTop", pieceList)}
        {/* 분기점 */}
        <ArrowIconCompo classStr={"cornerRightTop1"} position={5} />
        <ArrowIconCompo classStr={"cornerRightTop2"} position={5} />
        {createCornerPoint(0, "blue", "rightBottom", pieceList)}
        {createCornerPoint(22, "pink", "center", pieceList)}
        {/* 분기점 */}
        <ArrowIconCompo classStr={"cornerCenter1"} position={22} />
        <ArrowIconCompo classStr={"cornerCenter2"} position={22} />

        <style.MiniList className="miniTop">
          {createMiniPoint(9, "", pieceList)}
          {createMiniPoint(8, "", pieceList)}
          {createMiniPoint(7, "", pieceList)}
          {createMiniPoint(6, "", pieceList)}
        </style.MiniList>
        <style.MiniList className="miniLeft">
          {createMiniPoint(11, "", pieceList)}
          {createMiniPoint(12, "", pieceList)}
          {createMiniPoint(13, "", pieceList)}
          {createMiniPoint(14, "", pieceList)}
        </style.MiniList>
        <style.MiniList className="miniBottom">
          {createMiniPoint(16, "", pieceList)}
          {createMiniPoint(17, "", pieceList)}
          {createMiniPoint(18, "", pieceList)}
          {createMiniPoint(19, "", pieceList)}
        </style.MiniList>
        <style.MiniList className="miniRight">
          {createMiniPoint(4, "", pieceList)}
          {createMiniPoint(3, "", pieceList)}
          {createMiniPoint(2, "", pieceList)}
          {createMiniPoint(1, "", pieceList)}
        </style.MiniList>
        {/* leftTop -> rightBottom */}
        {createMiniPoint(25, "leftCross1", pieceList)}
        {createMiniPoint(26, "leftCross2", pieceList)}
        {createMiniPoint(28, "leftCross3", pieceList)}
        {createMiniPoint(29, "leftCross4", pieceList)}
        {/* rightTop -> leftBottom */}
        {createMiniPoint(20, "rightCross1", pieceList)}
        {createMiniPoint(21, "rightCross2", pieceList)}
        {createMiniPoint(22, "rightCross3", pieceList)}
        {createMiniPoint(23, "rightCross4", pieceList)}
      </style.Container>
    </>
  );
};

const StyledKKwangContainer = styled.div`
  margin: auto;
  z-index: 1;
  position: relative;
  width: 80%;
  /* display: none; */
`;

const StyledCompo = styled.div``;

export default YutBoardCompo;
