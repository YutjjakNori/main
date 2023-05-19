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

  const catchPlayerPiece = () => {
    setAction("Catch");
  };

  const selectPieceStart = () => {
    setAction("ChoosePiece");
  };

  const movePiece = () => {
    setAction("MovePiece");
  };

  const gameEnd = () => {
    setAction("End");
  };

  return {
    startGame,
    resetAction,
    action,
    turnStart,
    catchPlayerPiece,
    movePiece,
    turnEnd,
    throwYut,
    selectPieceStart,
    gameEnd,
  };
};

export default useGameAction;
