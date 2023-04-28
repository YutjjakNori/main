import { YutPieceCompoProps } from "@/present/component/YutPieceCompo/YutPieceCompo";
import { CornerType, GameActionType } from "@/types/game/YutGameTypes";
import { atom } from "recoil";

//사용자들의 모든 말 정보
const YutPieceListState = atom<Array<YutPieceCompoProps>>({
  key: "PlayerPieceList",
  default: [],
});

//현재 턴 플레이어 id
const NowTurnPlayerIdState = atom<string>({
  key: "TurnPlayerId",
  default: "-1",
});

//게임 참가자들의 게임 순서 정보
const PlayTurnState = atom<Array<string>>({
  key: "PlayTurn",
  default: [],
});

const GameActionState = atom<GameActionType>({
  key: "GameAction",
  default: "Started",
});

const GameActionQueueState = atom<Array<GameActionType>>({
  key: "GameActionQueue",
  default: [],
});

//코너에서 분기점을 선택해야할때 활성화
const SelectedCornerTypeState = atom<CornerType>({
  key: "CornerType",
  default: "none",
});

export {
  YutPieceListState,
  NowTurnPlayerIdState,
  PlayTurnState,
  GameActionState,
  GameActionQueueState,
  SelectedCornerTypeState,
};
