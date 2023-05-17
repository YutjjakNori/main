import { CatchPieceModalInfo } from "@/types/game/GameModalTypes";
import * as style from "./ActionModalCompo.style";

// 자신의 차례임을 알려주는 modal
const CatchPieceModalCompo = ({
  caughtPlayerNickname,
}: CatchPieceModalInfo) => {
  return (
    <style.Text>
      <span>{caughtPlayerNickname}</span>&nbsp;님의 말을 잡았습니다
      <br />
      윷을 한 번 더 던지세요
    </style.Text>
  );
};

export default CatchPieceModalCompo;
