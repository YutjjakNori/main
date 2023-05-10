import { YutPieceCompoProps } from "@/present/component/YutPieceCompo/YutPieceCompo";
import {
  ActiveCornerArrowState,
  NowTurnPlayerIdState,
  PlayTurnState,
  RoomCodeState,
  YutPieceListState,
} from "@/store/GameStore";
import { UserInfoState } from "@/store/UserStore";
import { YutPieceType } from "@/types/game/YutPieceTypes";
import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { sendEvent } from "../socket-api/socketInstance";
import useGameAction from "./useGameAction";

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
      appendArray: [],
      position: -1,
    });
  }
  return list;
};

//플레이어 전체의 말 리스트 생성
const createAllPieceList = (userList: Array<string>) => {
  let pieceTmp: Array<YutPieceCompoProps> = [];

  userList.forEach((userId, index) => {
    let type: YutPieceType = "yakgwa";

    if (index == 1) type = "songpyeon";
    else if (index === 2) type = "ssukRice";
    else if (index === 3) type = "flowerRice";

    const pieces = createUserPieceList(userId, type);
    pieceTmp = pieceTmp.concat(pieces);
  });

  return pieceTmp;
};

const useGameTurn = () => {
  //게임 순서 배열
  const [playerTurnList, setPlayerTurnList] = useRecoilState(PlayTurnState);
  const setPlayerPieceList = useSetRecoilState(YutPieceListState);
  const { startGame, turnStart, action } = useGameAction();
  const setCornerSelectType = useSetRecoilState(ActiveCornerArrowState);
  const roomCode = useRecoilValue(RoomCodeState);
  const myInfo = useRecoilValue(UserInfoState);

  //현재 순서인 플레이어 아이디
  const [nowTurnPlayerId, setNowTurnPlayerId] =
    useRecoilState(NowTurnPlayerIdState);

  // 초기 설정
  const initPlayerTurn = (turnInfoList: Array<string>) => {
    setPlayerTurnList(turnInfoList);

    const pieceList = createAllPieceList(turnInfoList);
    setPlayerPieceList(pieceList);

    startGame();
  };

  //턴 시작
  const startTurn = () => {
    setCornerSelectType("none");
  };

  const getNextPlayerId = (): string => {
    if (nowTurnPlayerId === "-1") {
      return playerTurnList[0];
    }

    const nowIndex = playerTurnList.findIndex((id) => id === nowTurnPlayerId);
    const nextIndex = (nowIndex + 1) % playerTurnList.length;
    return playerTurnList[nextIndex];
  };

  // 턴 넘기기
  const nextTurn = useCallback(
    (userId: string) => {
      setNowTurnPlayerId(userId);
      startTurn();
      turnStart();
    },
    [playerTurnList],
  );

  //다음 차례가 내 차례인 경우 알림
  const ifNextTurnIsMe = () => {
    const nextPlyaerId = getNextPlayerId();

    if (nextPlyaerId === myInfo.userId) {
      sendEvent(
        "/game/turn",
        {},
        {
          roomCode: roomCode,
          userId: nextPlyaerId,
        },
      );
    }
  };

  useEffect(() => {
    if (action === "None") return;

    switch (action) {
      case "Started":
        ifNextTurnIsMe();
        break;
      case "TurnStart":
        break;
      case "TurnEnd":
        ifNextTurnIsMe();
        break;
    }
  }, [action]);

  useCallback(() => {}, [nowTurnPlayerId]);

  return { initPlayerTurn, getNextPlayerId, nextTurn };
};

export default useGameTurn;
