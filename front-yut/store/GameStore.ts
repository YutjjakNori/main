import { YutPieceCompoProps } from "@/present/component/YutPieceCompo/YutPieceCompo";
import { atom, selector } from "recoil";

const YutPieceListState = atom<Array<YutPieceCompoProps>>({
  key: "PlayerPieceListAtom",
  default: [],
});

export { YutPieceListState };
