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

export type {
  GameStartResponseType,
  GameStartUserType,
  GameTurnStartResponseType,
};
