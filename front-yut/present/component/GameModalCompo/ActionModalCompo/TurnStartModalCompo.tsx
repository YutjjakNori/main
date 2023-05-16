import { TurnStartModalInfo } from "@/types/game/GameModalTypes";
import * as style from "./ActionModalCompo.style";

// 자신의 차례임을 알려주는 modal
const TurnStartModalCompo = ({
  nowTurnPlayerNickname,
  isMyTurn,
}: TurnStartModalInfo) => {
  return (
    <style.Text>
      {isMyTurn ? (
        // 내 턴일떄
        <>
          당신의 순서입니다.
          <br />
          윷을 던지세요
        </>
      ) : (
        // 남의 턴일때
        <>
          <span>{nowTurnPlayerNickname}</span>&nbsp;님의 순서입니다.
        </>
      )}
    </style.Text>
  );
};

export default TurnStartModalCompo;
