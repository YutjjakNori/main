import { YutPieceCompoProps } from "@/present/component/YutPieceCompo/YutPieceCompo";
import {
  CornerType,
  GameActionType,
  PieceCatchInfo,
} from "@/types/game/YutGameTypes";
import { ThrowResultType } from "@/types/game/YutThrowTypes";
import { atom } from "recoil";

const RoomCodeState = atom<string>({
  key: "GameRoomCode",
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
  default: "None",
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

const SelectedPieceIndex = atom<number>({
  key: "SelectedYutPiece",
  default: -1,
});
const EventIndex = atom<number>({
  key: "EventIdx",
  default: -1,
});

const YutThrowResultListState = atom<Array<ThrowResultType>>({
  key: "YutThrowResultList",
  default: ["", "", "", "", ""],
});

const PieceMoveTypeState = atom<string>({
  key: "PieceMoveType",
  default: "Move",
});

// 윷 말을 잡을 정보를 임시 저장
const PieceCatchInfoState = atom<PieceCatchInfo>({
  key: "PieceCeCatchInfoState",
  default: {
    catchedPieceIdList: [],
    catchedUserId: "-1",
  },
});

// 윷 말 이동 전 위치
const PiecePrevPosState = atom<number>({
  key: "PiecePrevPos",
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
  SelectedPieceIndex,
  EventIndex,
  YutThrowResultListState,
  PieceMoveTypeState,
  PieceCatchInfoState,
  PiecePrevPosState,
};
