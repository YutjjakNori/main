import { GameActionQueueState } from "@/store/GameStore";
import { GameActionType } from "@/types/game/YutGameTypes";
import { useMemo } from "react";
import { useRecoilState } from "recoil";

const useGameActionQueue = () => {
  const [actionQueue, setActionQueue] = useRecoilState(GameActionQueueState);
  const size = useMemo(() => actionQueue.length, [actionQueue]);

  const initQueue = () => setActionQueue([]);

  const addAction = (actionType: GameActionType) => {
    setActionQueue([...actionQueue, actionType]);
  };

  const nextAction = (): GameActionType => {
    const action = actionQueue[0];
    const newArr = actionQueue.slice(1);
    setActionQueue(newArr);
    return action;
  };

  return { initQueue, addAction, nextAction };
};

export default useGameActionQueue;
