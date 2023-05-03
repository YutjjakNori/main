import YutPieceCompo, {
  YutPieceCompoProps,
} from "../../YutPieceCompo/YutPieceCompo";
import * as style from "../YutBoardCompo.style";

interface MiniPointProps {
  id: number;
  classStr?: string;
  pieceList: Array<YutPieceCompoProps>;
}

const MiniPoint = ({ id, classStr, pieceList }: MiniPointProps) => {
  return (
    <style.MiniPoint className={classStr ?? ""}>
      {pieceList?.map((piece, index) => (
        <YutPieceCompo key={index} {...piece} />
      ))}
    </style.MiniPoint>
  );
};

export default MiniPoint;
