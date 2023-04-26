import { useEffect, useState } from "react";
import { YutPieceCompoProps } from "../YutPieceCompo/YutPieceCompo";
import CornerPoint from "./CornerPoint";
import MiniPoint from "./MiniPoint";
import * as style from "./YutBoardCompo.style";
import { useRecoilState } from "recoil";
import { YutPieceListState } from "@/store/GameStore";

const PieceFilter = (index: number, pieceList: Array<YutPieceCompoProps>) => {
  return pieceList.filter((piece) => piece.position === index);
};

const YutBoardCompo = () => {
  const [pieceList] = useRecoilState(YutPieceListState);

  return (
    <>
      <style.Container>
        <CornerPoint
          id={"point-10"}
          type={"blue"}
          point="leftTop"
          pieceList={PieceFilter(10, pieceList)}
        />
        <CornerPoint
          id={"point-15"}
          type={"blue"}
          point="leftBottom"
          pieceList={PieceFilter(15, pieceList)}
        />
        <CornerPoint
          id={"point-5"}
          type={"blue"}
          point="rightTop"
          pieceList={PieceFilter(5, pieceList)}
        />
        <CornerPoint
          id={"point-0"}
          type={"blue"}
          point="rightBottom"
          pieceList={PieceFilter(0, pieceList)}
        />
        <CornerPoint
          id={"point-22 point-27"}
          type={"pink"}
          point="center"
          pieceList={PieceFilter(22, pieceList) || PieceFilter(27, pieceList)}
        />
        <style.MiniList className="miniTop">
          <MiniPoint id="point-9" pieceList={PieceFilter(9, pieceList)} />
          <MiniPoint id="point-8" pieceList={PieceFilter(8, pieceList)} />
          <MiniPoint id="point-7" pieceList={PieceFilter(7, pieceList)} />
          <MiniPoint id="point-6" pieceList={PieceFilter(6, pieceList)} />
        </style.MiniList>
        <style.MiniList className="miniLeft">
          <MiniPoint id="point-11" pieceList={PieceFilter(11, pieceList)} />
          <MiniPoint id="point-12" pieceList={PieceFilter(12, pieceList)} />
          <MiniPoint id="point-13" pieceList={PieceFilter(13, pieceList)} />
          <MiniPoint id="point-14" pieceList={PieceFilter(14, pieceList)} />
        </style.MiniList>
        <style.MiniList className="miniBottom">
          <MiniPoint id="point-16" pieceList={PieceFilter(16, pieceList)} />
          <MiniPoint id="point-17" pieceList={PieceFilter(17, pieceList)} />
          <MiniPoint id="point-18" pieceList={PieceFilter(18, pieceList)} />
          <MiniPoint id="point-19" pieceList={PieceFilter(19, pieceList)} />
        </style.MiniList>
        <style.MiniList className="miniRight">
          <MiniPoint id="point-4" pieceList={PieceFilter(4, pieceList)} />
          <MiniPoint id="point-3" pieceList={PieceFilter(3, pieceList)} />
          <MiniPoint id="point-2" pieceList={PieceFilter(2, pieceList)} />
          <MiniPoint id="point-1" pieceList={PieceFilter(1, pieceList)} />
        </style.MiniList>
        {/* leftTop -> rightBottom */}
        <MiniPoint
          id="point-25"
          classStr="leftCross1"
          pieceList={PieceFilter(25, pieceList)}
        />
        <MiniPoint
          id="point-26"
          classStr="leftCross2"
          pieceList={PieceFilter(26, pieceList)}
        />
        <MiniPoint
          id="point-28"
          classStr="leftCross3"
          pieceList={PieceFilter(28, pieceList)}
        />
        <MiniPoint
          id="point-29"
          classStr="leftCross4"
          pieceList={PieceFilter(29, pieceList)}
        />
        {/* rightTop -> leftBottom */}
        <MiniPoint
          id="point-20"
          classStr="rightCross1"
          pieceList={PieceFilter(20, pieceList)}
        />
        <MiniPoint
          id="point-21"
          classStr="rightCross2"
          pieceList={PieceFilter(21, pieceList)}
        />
        <MiniPoint
          id="point-22"
          classStr="rightCross3"
          pieceList={PieceFilter(22, pieceList)}
        />
        <MiniPoint
          id="point-23"
          classStr="rightCross4"
          pieceList={PieceFilter(23, pieceList)}
        />
      </style.Container>
    </>
  );
};

export default YutBoardCompo;
