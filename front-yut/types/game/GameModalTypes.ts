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
}

// 윷입니다 한번더
interface ThrowYutAgainModalInfo {
  YutResult: ThrowResultType;
}

interface ChoosePieceModalInfo {
  moveYutResult: ThrowResultType;
}

// 누구님의 말을 잡았습니다 한번더
interface CatchPieceModalInfo {
  nowTurnPlayerNickname: string;
  caughtPlayerNickname: string;
}

export type {
  GameModalType,
  NoneModalInfo,
  TurnStartModalInfo,
  ThrowYutAgainModalInfo,
  ChoosePieceModalInfo,
  CatchPieceModalInfo,
};
