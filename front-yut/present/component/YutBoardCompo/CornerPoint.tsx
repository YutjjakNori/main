import * as style from "./YutBoardCompo.style";

interface CornerPointProps {
  type: string;
  point: string;
}

const CornerPoint = ({ type, point }: CornerPointProps) => {
  return (
    <style.CornerPoint type={type} className={point}>
      <div></div>
    </style.CornerPoint>
  );
};

export default CornerPoint;
