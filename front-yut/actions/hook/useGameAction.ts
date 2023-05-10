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

  const turnEnd = () => {
    setAction("TurnEnd");
  };

  return { startGame, resetAction, action, turnStart, turnEnd };
};

export default useGameAction;
