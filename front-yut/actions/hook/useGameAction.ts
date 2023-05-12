import { GameActionState } from "@/store/GameStore";
import { useRecoilState } from "recoil";

const useGameAction = () => {
  const [action, setAction] = useRecoilState(GameActionState);

  const startGame = () => {
    setAction("Started");
  };

  const resetAction = () => {
    setAction("None");
  };

  const turnStart = () => {
    setAction("TurnStart");
  };

  const throwYut = () => {
    setAction("ThrowYut");
  };

  const turnEnd = () => {
    setAction("TurnEnd");
  };

  const selectPieceStart = () => {
    setAction("ChoosePiece");
  };

  return {
    startGame,
    resetAction,
    action,
    turnStart,
    turnEnd,
    throwYut,
    selectPieceStart,
  };
};

export default useGameAction;
