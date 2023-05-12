import YutPieceCompo, {
  YutPieceCompoProps,
} from "../../YutPieceCompo/YutPieceCompo";
import * as style from "../YutBoardCompo.style";

interface CornerPointCompoProps {
  id: number;
  type: string;
  point: string;
  pieceList: Array<YutPieceCompoProps>;
}

const CornerPoint = ({ id, type, point, pieceList }: CornerPointCompoProps) => {
  return (
    <style.CornerPoint type={type} className={point}>
      <div></div>
      {pieceList?.map((piece) => (
        <YutPieceCompo key={`${piece.userId}-${piece.pieceId}`} {...piece} />
      ))}
    </style.CornerPoint>
  );
};

export default CornerPoint;
