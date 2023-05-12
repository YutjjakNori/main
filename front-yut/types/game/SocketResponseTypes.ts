import { ThrowResultType } from "./YutThrowTypes";

interface GameStartResponseType {
  users: Array<GameStartUserType>;
  event: Array<number>;
}

interface GameStartUserType {
  id: string;
  pieceNum: Array<number>;
}

interface GameTurnStartResponseType {
  userId: string;
}

// 윷 던졌을때 response
interface YutThrowResponseType {
  userId: string;
  result: ThrowResultType;
}

export type {
  GameStartResponseType,
  GameStartUserType,
  GameTurnStartResponseType,
  YutThrowResponseType,
};
