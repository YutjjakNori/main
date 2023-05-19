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

interface PieceMoveResponseDataType {
  userId: string;
  selectPiece: Array<number>;
  move: Array<number>;
  event: boolean;
  caughtUserId?: string;
  caughtPiece?: Array<number>;
  end: boolean;
}

// 말을 선택했을 때 response
interface PieceMoveResponseType {
  type: number;
  data: PieceMoveResponseDataType;
}

interface EventResponseType {
  userId: string;
  event: number;
  roomCode: string;
}

interface RunEventResponseType {
  roomCode: string;
  userId: string;
  selectPiece: Array<number>;
  event: number;
  move: number;
}

export type {
  GameStartResponseType,
  GameStartUserType,
  GameTurnStartResponseType,
  YutThrowResponseType,
  PieceMoveResponseType,
  EventResponseType,
  RunEventResponseType,
};
