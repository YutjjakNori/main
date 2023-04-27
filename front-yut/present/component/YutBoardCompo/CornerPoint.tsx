import YutPieceCompo, {
  YutPieceCompoProps,
} from "../YutPieceCompo/YutPieceCompo";
import * as style from "./YutBoardCompo.style";

interface CornerPointProps {
  id: number;
  type: string;
  point: string;
  pieceList: Array<YutPieceCompoProps>;
}

const CornerPoint = ({ id, type, point, pieceList }: CornerPointProps) => {
  return (
    <style.CornerPoint type={type} className={point}>
      <div></div>
      {pieceList?.map((piece) => (
        <YutPieceCompo key={id} {...piece} />
      ))}
    </style.CornerPoint>
  );
};

export default CornerPoint;
