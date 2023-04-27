import { YutPieceCompoProps } from "@/present/component/YutPieceCompo/YutPieceCompo";
import { atom } from "recoil";

//사용자들의 모든 말 정보
const YutPieceListState = atom<Array<YutPieceCompoProps>>({
  key: "PlayerPieceListAtom",
  default: [],
});

//현재 턴 플레이어 id
const NowTurnPlayerIdState = atom<string>({
  key: "TurnPlayerIdAtom",
  default: "-1",
});

//게임 참가자들의 게임 순서 정보
const PlayTurnState = atom<Array<string>>({
  key: "PlayTurn",
  default: [],
});

export { YutPieceListState, NowTurnPlayerIdState, PlayTurnState };
