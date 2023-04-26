import YutPieceCompo, {
  YutPieceCompoProps,
} from "../YutPieceCompo/YutPieceCompo";
import * as style from "./YutBoardCompo.style";

interface MiniPointProps {
  id: string;
  classStr?: string;
  pieceList: Array<YutPieceCompoProps>;
}

const MiniPoint = ({ id, classStr, pieceList }: MiniPointProps) => {
  return (
    <style.MiniPoint id={id} className={classStr ?? ""}>
      {pieceList?.map((piece, index) => (
        <YutPieceCompo key={index} {...piece} />
      ))}
    </style.MiniPoint>
  );
};

export default MiniPoint;
