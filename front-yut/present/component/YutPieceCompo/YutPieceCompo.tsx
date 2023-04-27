import { NowTurnPlayerIdState } from "@/store/GameStore";
import { PieceStateType } from "@/types/game/YutGameTypes";
import { YutPieceType } from "@/types/game/YutPieceTypes";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import PieceIcon from "./PieceIcon";
import * as style from "./YutPieceCompo.style";

/**
  @param userId 소유자의 id
  @param pieceId 윷판 말의 고유 id
  @param state 말의 상태 (판에 없음, 판에 있음, 동남)
  @param appendedCount 업은 말의 개수 1인 경우 혼자
  @param position 윷 판 어디에 있는지
*/

interface YutPieceCompoProps {
  userId: string;
  pieceId: number;
  pieceType: YutPieceType;
  state: PieceStateType;
  appendedCount: number;
  position: number;
}

const YutPieceCompo = ({
  userId,
  pieceId,
  pieceType,
  state = "NotStarted",
  appendedCount = 1,
}: YutPieceCompoProps) => {
  const nowTurnPlayerId = useRecoilValue(NowTurnPlayerIdState);
  const isClickable = nowTurnPlayerId === userId;

  const onClick = () => {
    if (!isClickable) return;

    //TODO : 서버에 요청
  };

  return (
    <style.SvgContainer
      className="piece"
      onClick={onClick}
      isClickable={isClickable}
    >
      {/* player type에 맞는 svg icon */}
      {PieceIcon(pieceType)}
      <style.AppendCount>
        {appendedCount > 1 ? appendedCount : null}
      </style.AppendCount>
    </style.SvgContainer>
  );
};

export type { YutPieceCompoProps };
export default YutPieceCompo;
