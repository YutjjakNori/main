import { NowTurnPlayerIdState, PlayTurnState } from "@/store/GameStore";
import { useRecoilState } from "recoil";

const useGameTurn = () => {
  //
  const [playerTurnList, setPlayerTurnList] = useRecoilState(PlayTurnState);
  //현재 순서인 플레이어 아이디
  const [nowTurnPlayerId, setNowTurnPlayerId] =
    useRecoilState(NowTurnPlayerIdState);

  // 초기 설정
  const initPlayerTurn = (turnInfoList: Array<string>) => {
    setPlayerTurnList(turnInfoList);
  };

  // 턴 넘기기
  const nextTurn = () => {
    if (nowTurnPlayerId === "-1") {
      setNowTurnPlayerId(playerTurnList[0]);
      return;
    }

    const nowIndex = playerTurnList.findIndex((id) => id === nowTurnPlayerId);
    const nextIndex = (nowIndex + 1) % playerTurnList.length;

    setNowTurnPlayerId(playerTurnList[nextIndex]);
  };

  return { initPlayerTurn, nextTurn };
};

export default useGameTurn;
