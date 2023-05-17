import GameModalCompo from "@/present/component/GameModalCompo/GameModalCompo";
import { GameModalInfoState } from "@/store/GameModalStore";
import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
import useGameAction from "./useGameAction";
import usePieceMove from "./usePieceMove";
import useYutThrow from "./useYutThrow";

const useGameReset = () => {
  const { resetAction } = useGameAction();
  const { resetThrowResultList } = useYutThrow();
  const { resetPieceMoveState } = usePieceMove();
  const setModalInfo = useSetRecoilState(GameModalInfoState);

  const resetGame = useCallback(() => {
    resetAction();
    resetPieceMoveState();
    resetThrowResultList();
    setModalInfo({ data: null });
  }, []);

  return { resetGame };
};

export default useGameReset;
