import { ThrowResultType } from "./YutThrowTypes";

type GameModalType =
  | "None"
  | "ThrowYut"
  | "ThrowAgain"
  | "ChoosePiece"
  | "CatchPiece"
  | "NextTurn"
  | "ChooseAction";

type NoneModalInfo = "";

// 누구님의 차례입니다
interface TurnStartModalInfo {
  nowTurnPlayerNickname: string;
  isMyTurn: boolean;
}

interface ChoosePieceModalInfo {
  moveYutResult: ThrowResultType;
}

// 누구님의 말을 잡았습니다 한번더
interface CatchPieceModalInfo {
  caughtPlayerNickname: string;
}

export type {
  GameModalType,
  NoneModalInfo,
  TurnStartModalInfo,
  ChoosePieceModalInfo,
  CatchPieceModalInfo,
};
