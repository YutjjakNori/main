import { YutPieceCompoProps } from "@/present/component/YutPieceCompo/YutPieceCompo";
import { CornerType, GameActionType } from "@/types/game/YutGameTypes";
import { atom } from "recoil";

const RoomCodeState = atom<string>({
  key: "GamRoomCode",
  default: "",
});

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
const ActiveCornerArrowState = atom<CornerType>({
  key: "ActiveCornerArrow",
  default: "none",
});

// 이벤트/윷 결과에 따라 윷 던지기 버튼 활성화
const YutThrowBtnState = atom<string>({
  key: "YutThrowBtn",
  default: "none",
});

const selectedPieceIndex = atom<number>({
  key: "SelectedYutPiece",
  default: -1,
});

export {
  RoomCodeState,
  YutPieceListState,
  NowTurnPlayerIdState,
  PlayTurnState,
  GameActionState,
  GameActionQueueState,
  ActiveCornerArrowState,
  YutThrowBtnState,
  selectedPieceIndex,
};
