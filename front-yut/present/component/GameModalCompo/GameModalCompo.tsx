import {
  CatchPieceModalInfo,
  ChoosePieceModalInfo,
  GameEndModalInfo,
  TurnStartModalInfo,
} from "@/types/game/GameModalTypes";
import { GameActionType } from "@/types/game/YutGameTypes";
import { useEffect, useMemo, useState } from "react";
import CatchPieceModalCompo from "./ActionModalCompo/CatchPieceModalCompo";
import ChoosePieceModalCompo from "./ActionModalCompo/ChoosePieceModalCompo";
import GameEndModalCompo from "./ActionModalCompo/GameEndModalCompo";
import TurnStartModalCompo from "./ActionModalCompo/TurnStartModalCompo";
import * as style from "./GameModalCompo.style";
import audioModule from "@/utils/audioModule";

// modal에 따른 타입이 data에 바인딩됨
interface GameModalCompoProps {
  data:
    | TurnStartModalInfo
    | ChoosePieceModalInfo
    | CatchPieceModalInfo
    | GameEndModalInfo
    | null;
}

const GameModalCompo = ({ data }: GameModalCompoProps) => {
  const [modalType, setModalType] = useState<GameActionType>("None");

  const modalVisible: boolean = useMemo(() => {
    return modalType !== "None";
  }, [modalType]);

  const getModalCompo = () => {
    switch (modalType) {
      case "TurnStart":
        const { nowTurnPlayerNickname, isMyTurn } = data as TurnStartModalInfo;
        return (
          <TurnStartModalCompo
            nowTurnPlayerNickname={nowTurnPlayerNickname}
            isMyTurn={isMyTurn}
          />
        );
      case "ChoosePiece":
        const { moveYutResult } = data as ChoosePieceModalInfo;
        return (
          <>
            <ChoosePieceModalCompo moveYutResult={moveYutResult ?? ""} />
          </>
        );
      case "Catch":
        const { caughtPlayerNickname } = data as CatchPieceModalInfo;
        return (
          <>
            <CatchPieceModalCompo caughtPlayerNickname={caughtPlayerNickname} />
          </>
        );
      case "End":
        const filePath = "/audio/victory1.mp3";
        const volume = 1;
        audioModule(filePath, volume);

        const { winnerPlayerNickname } = data as GameEndModalInfo;
        return (
          <>
            <GameEndModalCompo winnerPlayerNickname={winnerPlayerNickname} />
          </>
        );
      default:
        return;
    }
  };

  useEffect(() => {
    // 모달이 켜진 경우에는 자동으로 1.5초뒤에 꺼짐
    if (modalType !== "None" && modalType !== "End") {
      setTimeout(() => {
        setModalType("None");
      }, 1500);
    }
  }, [modalType]);

  // 데이터의 타입에 따라 modal의 타입을 변경함
  useEffect(() => {
    if (!data) return;

    if (instanceOfTurnStartModalInfo(data)) {
      setModalType("TurnStart");
      return;
    }
    if (instanceOfChoosePieceInfo(data)) {
      setModalType("ChoosePiece");
      return;
    }
    if (instanceOfCatchPieceModalInfo(data)) {
      setModalType("Catch");
      return;
    }
    if (instanceOfGameModalInfo(data)) {
      setModalType("End");
      return;
    }
    setModalType("None");
  }, [data]);

  return (
    <>
      <style.Container visible={modalVisible}>
        <style.TextBox>{getModalCompo() ?? null}</style.TextBox>
      </style.Container>
    </>
  );
};

const instanceOfTurnStartModalInfo = (
  object: any
): object is TurnStartModalInfo => {
  if (object === null || object === undefined) return false;
  return (
    "nowTurnPlayerNickname" in object &&
    "isMyTurn" in object &&
    Object.keys(object).length === 2
  );
};

const instanceOfChoosePieceInfo = (
  object: any
): object is ChoosePieceModalInfo => {
  if (object === null || object === undefined) return false;
  return "moveYutResult" in object && Object.keys(object).length === 1;
};

const instanceOfCatchPieceModalInfo = (
  object: any
): object is CatchPieceModalInfo => {
  if (object === null || object === undefined) return false;
  return "caughtPlayerNickname" in object && Object.keys(object).length === 1;
};

const instanceOfGameModalInfo = (object: any): object is GameEndModalInfo => {
  if (object === null || object === undefined) return false;
  return "winnerPlayerNickname" in object && Object.keys(object).length === 1;
};

export default GameModalCompo;
export type { GameModalCompoProps };
