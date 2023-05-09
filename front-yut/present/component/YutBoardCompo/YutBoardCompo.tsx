import { useCallback, useEffect, useState } from "react";
import { YutPieceCompoProps } from "../YutPieceCompo/YutPieceCompo";
import CornerPoint from "./Point/CornerPointCompo";
import MiniPoint from "./Point/MiniPointCompo";
import * as style from "./YutBoardCompo.style";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  YutPieceListState,
  NowTurnPlayerIdState,
  SelectedPieceIndex,
  YutThrowBtnState,
} from "@/store/GameStore";
import ArrowIconCompo from "./ArrowCompo/ArrowCompo";
import { cornerIndex } from "@/utils/gameUtils";
import EventPoint from "./EventPoint";
import EventCard from "./EventCard";

import usePieceMove from "@/actions/hook/usePieceMove";

const pieceFilterByIndex = (
  index: number,
  pieceList: Array<YutPieceCompoProps>
) => {
  return pieceList.filter(
    (piece) => piece.state === "InBoard" && piece.position === index
  );
};

// TODO: 소켓 통신하여 이벤트칸 위치정보 2개 받아오기.
// 임시 정보
const eventPointList = [2, 7]; // -------------------- (1)

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
  const curUserId = useRecoilValue(NowTurnPlayerIdState);

  const [btnDisplay, setBtnDisplay] = useRecoilState(YutThrowBtnState);
  //선택된 piece의 index
  const [movePieceIndex, setMovePieceIndex] =
    useRecoilState(SelectedPieceIndex);
  const { appendPiece } = usePieceMove();

  const [eventIdx, setEventIdx] = useState(-1);

  function hideEventCard() {
    setTimeout(() => setEventIdx(-1), 2000);
  }

  // 이벤트) 말 업고 가기
  // 1. 시작 안한 말이 있는지 확인.
  // 1-1. 없다면(-1) 꽝으로 치환
  // 1-2. 있다면(>0) 첫 말번호 알아내기.
  //
  function appendEvent() {
    const pieceIdx = pieceList.findIndex((piece) => {
      return piece.userId === curUserId && piece.state === "NotStarted";
    });
    // 시작안한 말이 없다면 꽝으로 치환.
    if (pieceIdx === -1) {
      setTimeout(() => {
        setEventIdx(0);
        hideEventCard();
      }, 2000);
    } else {
      const list = [pieceIdx, movePieceIndex];
      setTimeout(() => {
        appendPiece(curUserId, list);
      }, 2000);
    }
  }

  const takeAction = (index: number) => {
    try {
      switch (index) {
        case 0:
          setEventIdx(0);
          hideEventCard();
          break;
        case 1:
          setEventIdx(1);
          setBtnDisplay("block");
          hideEventCard();
          break;
        case 2:
          setEventIdx(2);
          appendEvent();
          // hideEventCard(); // 일부로: 그래야 정상작동함
          break;
        case 3:
          setEventIdx(3);
          hideEventCard();
          break;
        case 4:
          setEventIdx(4);
          hideEventCard();
          break;
      }
    } catch (err) {
      throw err;
    } finally {
      //hideEventCard();
    }
  };

  const request = {
    roomCode: "abcde",
    userId: "lewis",
  };

  // 서버에 이벤트 요청 전송
  const getEventResult = () => {
    /*
    0: 꽝 / 1: 한번더던지기
    2: 말 업고가기 / 3: 출발했던 자리로 / 4: 처음으로 돌아가기
    */
    // result: 임시  --- (소켓통신이 되면 나중에 수정할것) ---------- ( 2 )
    const result = 2;
    // setEventIdx(result);
    console.log(curUserId + " , " + movePieceIndex);
    takeAction(result);
  };

  return (
    <>
      <button
        onClick={getEventResult}
        style={{
          position: "absolute",
          top: "0",
          left: "0",
        }}
      >
        이벤트칸
      </button>
      <style.Container>
        {/* eventContainer로 명칭 바꾸기 */}
        <style.StyledEventContainer>
          <EventCard eventIdx={eventIdx} />
        </style.StyledEventContainer>
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

export default YutBoardCompo;
