import GameModalCompo from "@/present/component/GameModalCompo/GameModalCompo";
import { messageLogState } from "@/store/ChatStore";
import { GameModalInfoState } from "@/store/GameModalStore";
import { EventIndex } from "@/store/GameStore";
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
  const setMessageLog = useSetRecoilState(messageLogState);
  const setEventIndex = useSetRecoilState(EventIndex);

  const resetGame = useCallback(() => {
    resetAction();
    resetPieceMoveState();
    resetThrowResultList();
    setModalInfo({ data: null });
    setMessageLog([]);
    setEventIndex(-1);
  }, []);

  return { resetGame };
};

export default useGameReset;
