import { YutPieceCompoProps } from "@/present/component/YutPieceCompo/YutPieceCompo";
import {
  ActiveCornerArrowState,
  NowTurnPlayerIdState,
  PlayTurnState,
  YutPieceListState,
} from "@/store/GameStore";
import { YutPieceType } from "@/types/game/YutPieceTypes";
import { useRecoilState, useSetRecoilState } from "recoil";
import useGameActionQueue from "./useGameActionQueue";

//사용자의 초기 말 3개 생성
const createUserPieceList = (
  userId: string,
  pieceType: YutPieceType,
): Array<YutPieceCompoProps> => {
  const list: Array<YutPieceCompoProps> = [];
  for (let i = 1; i <= 3; i++) {
    list.push({
      userId: userId,
      pieceId: i,
      pieceType: pieceType,
      state: "NotStarted",
      appendedCount: 1,
      position: -1,
    });
  }
  return list;
};

//플레이어 전체의 말 리스트 생성
const createAllPieceList = (userList: Array<string>) => {
  let pieceTmp: Array<YutPieceCompoProps> = [];

  userList.forEach((userId, index) => {
    let type: YutPieceType = "flowerRice";

    if (index == 1) type = "songpyeon";
    else if (index === 2) type = "ssukRice";
    else if (index === 3) type = "yakgwa";

    const pieces = createUserPieceList(userId, type);
    pieceTmp = pieceTmp.concat(pieces);
  });

  return pieceTmp;
};

const useGameTurn = () => {
  //게임 순서 배열
  const [playerTurnList, setPlayerTurnList] = useRecoilState(PlayTurnState);
  const setPlayerPieceList = useSetRecoilState(YutPieceListState);
  const { initQueue, addAction } = useGameActionQueue();
  const setCornerSelectType = useSetRecoilState(ActiveCornerArrowState);

  //현재 순서인 플레이어 아이디
  const [nowTurnPlayerId, setNowTurnPlayerId] =
    useRecoilState(NowTurnPlayerIdState);

  // 초기 설정
  const initPlayerTurn = (turnInfoList: Array<string>) => {
    setPlayerTurnList(turnInfoList);

    const pieceList = createAllPieceList(turnInfoList);
    setPlayerPieceList(pieceList);
  };

  //턴 시작
  const startTurn = () => {
    initQueue();
    setCornerSelectType("none");
    addAction("ThrowYut");
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
    startTurn();
  };

  return { initPlayerTurn, nextTurn };
};

export default useGameTurn;
