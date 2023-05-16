import { TurnStartModalInfo } from "@/types/game/GameModalTypes";
import * as style from "./ActionModalCompo.style";

// 자신의 차례임을 알려주는 modal
const TurnStartModalCompo = ({ nowTurnPlayerNickname }: TurnStartModalInfo) => {
  return (
    <style.Text>
      <span>{nowTurnPlayerNickname}</span>&nbsp;님의 차례입니다.
      <br />
      윷을 던지세요
    </style.Text>
  );
};

export default TurnStartModalCompo;
