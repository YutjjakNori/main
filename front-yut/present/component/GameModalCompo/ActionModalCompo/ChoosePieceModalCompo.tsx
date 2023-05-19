import { ChoosePieceModalInfo } from "@/types/game/GameModalTypes";
import * as style from "./ActionModalCompo.style";

// 자신의 차례임을 알려주는 modal
const ChoosePieceModalCompo = ({ moveYutResult }: ChoosePieceModalInfo) => {
  return (
    <style.Text>
      <span>{moveYutResult}</span>&nbsp; 만큼
      <br />
      움직일 말을 고르세요
    </style.Text>
  );
};

export default ChoosePieceModalCompo;
