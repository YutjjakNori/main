import { GameModalCompoProps } from "@/present/component/GameModalCompo/GameModalCompo";
import { atom } from "recoil";

const GameModalInfoState = atom<GameModalCompoProps>({
  key: "GameModalInfoS",
  default: {
    data: null,
  },
});

export { GameModalInfoState };
