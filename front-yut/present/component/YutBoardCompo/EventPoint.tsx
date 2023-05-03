import YutPieceCompo, {
  YutPieceCompoProps,
} from "../YutPieceCompo/YutPieceCompo";
import * as style from "./YutBoardCompo.style";

import EventCard from "@/public/icon/EventCard.svg";

interface MiniPointProps {
  id: number;
  classStr?: string;
  pieceList: Array<YutPieceCompoProps>;
}

const EventPoint = ({ id, classStr, pieceList }: MiniPointProps) => {
  return (
    <style.EventPoint className={classStr ?? ""}>
      <EventCard width={"100%"} height={"100%"}>
        {pieceList?.map((piece, index) => (
          <YutPieceCompo key={index} {...piece} />
        ))}
      </EventCard>
    </style.EventPoint>
  );
};
export default EventPoint;
