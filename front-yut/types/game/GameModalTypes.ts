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

// 걸 입니다 윷 말을 고르세요
interface ThrowYutModalInfo {
  YutResult: ThrowResultType;
}

// 윷입니다 한번더
interface ThrowYutAgainModalInfo {
  YutResult: ThrowResultType;
}

interface ChoosePieceModalInfo {
  YutResult: ThrowResultType;
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
  ThrowYutModalInfo,
  ThrowYutAgainModalInfo,
  ChoosePieceModalInfo,
  CatchPieceModalInfo,
};
