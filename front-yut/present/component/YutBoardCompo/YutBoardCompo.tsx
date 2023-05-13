import { YutPieceCompoProps } from "../YutPieceCompo/YutPieceCompo";
import CornerPoint from "./Point/CornerPointCompo";
import MiniPoint from "./Point/MiniPointCompo";
import * as style from "./YutBoardCompo.style";
import { useRecoilState } from "recoil";
import { YutPieceListState } from "@/store/GameStore";
import ArrowIconCompo from "./ArrowCompo/ArrowCompo";
import EventPoint from "./Point/EventPointCompo";
import EventCard from "./EventCardCompo";

interface YutBoardCompoProps {
  eventPositionList: Array<number>;
}

const YutBoardCompo = ({ eventPositionList }: YutBoardCompoProps) => {
  const [pieceList] = useRecoilState(YutPieceListState);

  return (
    <>
      <style.Container>
        <style.StyledEventContainer>
          <EventCard />
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
          {createMiniPoint(9, "", pieceList, eventPositionList)}
          {createMiniPoint(8, "", pieceList, eventPositionList)}
          {createMiniPoint(7, "", pieceList, eventPositionList)}
          {createMiniPoint(6, "", pieceList, eventPositionList)}
        </style.MiniList>
        <style.MiniList className="miniLeft">
          {createMiniPoint(11, "", pieceList, eventPositionList)}
          {createMiniPoint(12, "", pieceList, eventPositionList)}
          {createMiniPoint(13, "", pieceList, eventPositionList)}
          {createMiniPoint(14, "", pieceList, eventPositionList)}
        </style.MiniList>
        <style.MiniList className="miniBottom">
          {createMiniPoint(16, "", pieceList, eventPositionList)}
          {createMiniPoint(17, "", pieceList, eventPositionList)}
          {createMiniPoint(18, "", pieceList, eventPositionList)}
          {createMiniPoint(19, "", pieceList, eventPositionList)}
        </style.MiniList>
        <style.MiniList className="miniRight">
          {createMiniPoint(4, "", pieceList, eventPositionList)}
          {createMiniPoint(3, "", pieceList, eventPositionList)}
          {createMiniPoint(2, "", pieceList, eventPositionList)}
          {createMiniPoint(1, "", pieceList, eventPositionList)}
        </style.MiniList>
        {/* leftTop -> rightBottom */}
        {createMiniPoint(25, "leftCross1", pieceList, eventPositionList)}
        {createMiniPoint(26, "leftCross2", pieceList, eventPositionList)}
        {createMiniPoint(28, "leftCross3", pieceList, eventPositionList)}
        {createMiniPoint(29, "leftCross4", pieceList, eventPositionList)}
        {/* rightTop -> leftBottom */}
        {createMiniPoint(20, "rightCross1", pieceList, eventPositionList)}
        {createMiniPoint(21, "rightCross2", pieceList, eventPositionList)}
        {createMiniPoint(23, "rightCross3", pieceList, eventPositionList)}
        {createMiniPoint(24, "rightCross4", pieceList, eventPositionList)}
      </style.Container>
    </>
  );
};

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
  pieceList: Array<YutPieceCompoProps>,
  eventPositionList: Array<number>
): JSX.Element => {
  if (
    eventPositionList[0] === cornerIndex ||
    eventPositionList[1] === cornerIndex
  ) {
    return (
      <EventPoint
        id={cornerIndex}
        classStr={classStr}
        pieceList={pieceFilterByIndex(cornerIndex, pieceList)}
      />
    );
  }
  return (
    <MiniPoint
      id={cornerIndex}
      classStr={classStr}
      pieceList={pieceFilterByIndex(cornerIndex, pieceList)}
    />
  );
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

export default YutBoardCompo;
