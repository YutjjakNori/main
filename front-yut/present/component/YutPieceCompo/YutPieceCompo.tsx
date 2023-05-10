import usePieceMove from "@/actions/hook/usePieceMove";
import { NowTurnPlayerIdState } from "@/store/GameStore";
import { UserInfoState } from "@/store/UserStore";
import { colors } from "@/styles/theme";
import { PieceStateType } from "@/types/game/YutGameTypes";
import { YutPieceType } from "@/types/game/YutPieceTypes";
import { useMemo, useState } from "react";
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
  appendArray: Array<YutPieceCompoProps>;
  position: number;
}

const YutPieceCompo = ({
  userId,
  pieceId,
  pieceType,
  state = "NotStarted",
  appendArray = [],
}: YutPieceCompoProps) => {
  const { selectPiece } = usePieceMove();
  const nowTurnPlayerId = useRecoilValue(NowTurnPlayerIdState);
  const myInfo = useRecoilValue(UserInfoState);
  const isClickable = useMemo(
    () => myInfo.userId === userId && nowTurnPlayerId === userId,
    [nowTurnPlayerId, myInfo],
  );
  const appendedCount = useMemo(() => appendArray.length, [appendArray]);

  const onClick = () => {
    if (!isClickable) return;

    selectPiece(userId, pieceId);
  };

  const color = useMemo(() => {
    switch (pieceType) {
      case "flowerRice":
        return colors.gamePlayer[0];
      case "songpyeon":
        return colors.gamePlayer[1];
      case "ssukRice":
        return colors.gamePlayer[2];
      default:
        return colors.gamePlayer[3];
    }
  }, [pieceType]);

  return (
    <style.SvgContainer
      className="piece"
      onClick={onClick}
      isClickable={isClickable}
    >
      {/* player type에 맞는 svg icon */}
      {PieceIcon(pieceType)}
      {appendedCount > 0 ? (
        <style.AppendCount color={color}>
          <span>{appendedCount + 1}</span>
        </style.AppendCount>
      ) : null}
    </style.SvgContainer>
  );
};

export type { YutPieceCompoProps };
export default YutPieceCompo;
