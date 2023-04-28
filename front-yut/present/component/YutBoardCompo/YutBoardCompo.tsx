import { useEffect, useState } from "react";
import { YutPieceCompoProps } from "../YutPieceCompo/YutPieceCompo";
import CornerPoint from "./CornerPoint";
import MiniPoint from "./MiniPoint";
import * as style from "./YutBoardCompo.style";
import { useRecoilState } from "recoil";
import { YutPieceListState } from "@/store/GameStore";
import ArrowIconCompo from "./ArrowCompo";

const pieceFilterByIndex = (
  index: number,
  pieceList: Array<YutPieceCompoProps>,
) => {
  return pieceList.filter(
    (piece) => piece.state === "InBoard" && piece.position === index,
  );
};

const createMiniPoint = (
  cornerIndex: number,
  classStr: string,
  pieceList: Array<YutPieceCompoProps>,
): JSX.Element => (
  <MiniPoint
    id={cornerIndex}
    classStr={classStr}
    pieceList={pieceFilterByIndex(cornerIndex, pieceList)}
  />
);
const createCornerPoint = (
  id: number,
  type: string,
  point: string,
  pieceList: Array<YutPieceCompoProps>,
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

  return (
    <>
      <style.Container>
        {createCornerPoint(10, "blue", "leftTop", pieceList)}
        {/* 분기점 */}
        <ArrowIconCompo active={true} classStr={"cornerLeftTop1"} />
        <ArrowIconCompo active={true} classStr={"cornerLeftTop2"} />
        {createCornerPoint(15, "blue", "leftBottom", pieceList)}
        {/* 분기점 */}
        {createCornerPoint(5, "blue", "rightTop", pieceList)}
        {/* 분기점 */}
        <ArrowIconCompo active={true} classStr={"cornerRightTop1"} />
        <ArrowIconCompo active={true} classStr={"cornerRightTop2"} />
        {createCornerPoint(0, "blue", "rightBottom", pieceList)}
        {createCornerPoint(22, "pink", "center", pieceList)}
        {/* 분기점 */}
        <ArrowIconCompo active={true} classStr={"cornerCenter1"} />
        <ArrowIconCompo active={true} classStr={"cornerCenter2"} />
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
