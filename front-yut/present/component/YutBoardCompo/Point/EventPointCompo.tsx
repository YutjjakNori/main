import YutPieceCompo, {
  YutPieceCompoProps,
} from "../../YutPieceCompo/YutPieceCompo";
import * as style from "../YutBoardCompo.style";

import EventCard from "@/public/icon/EventCard.svg";
import { useEffect } from "react";

interface MiniPointProps {
  id: number;
  classStr?: string;
  pieceList: Array<YutPieceCompoProps>;
}

const EventPoint = ({ id, classStr, pieceList }: MiniPointProps) => {
  useEffect(() => {
    if (pieceList.length === 0) return;
  }, [pieceList.length]);

  return (
    <style.EventPoint className={classStr ?? ""}>
      <EventCard width={"100%"} height={"100%"} />
      {pieceList?.map((piece, index) => (
        <YutPieceCompo key={index} {...piece} />
      ))}
    </style.EventPoint>
  );
};
export default EventPoint;
