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
import {
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { sendEvent } from "../socket-api/socketInstance";
import useGameAction from "./useGameAction";

//사용자의 초기 말 3개 생성
const createUserPieceList = (
  userId: string,
  pieceType: YutPieceType
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
  const { startGame, turnStart, action, throwYut } = useGameAction();
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

  const getNextPlayerId = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const latestNowTurnPlayerId = await snapshot.getPromise(
          NowTurnPlayerIdState
        );
        const latestPlayerTurnList = await snapshot.getPromise(PlayTurnState);

        console.log("현재 사용자 ID: ", latestNowTurnPlayerId);

        if (latestNowTurnPlayerId === "-1") {
          return latestPlayerTurnList[0];
        }

        const nowIndex = latestPlayerTurnList.findIndex(
          (id) => id === latestNowTurnPlayerId
        );
        const nextIndex = (nowIndex + 1) % latestPlayerTurnList.length;
        return latestPlayerTurnList[nextIndex];
      },
    []
  );

  // 턴 넘기기
  const nextTurn = useCallback(
    (userId: string) => {
      setNowTurnPlayerId(userId);
      startTurn();
      turnStart();
    },
    [playerTurnList]
  );

  //다음 차례가 내 차례인 경우 알림
  const ifNextTurnIsMe = async () => {
    const nextPlayerId = await getNextPlayerId();

    if (nextPlayerId === myInfo.userId) {
      setTimeout(() => {
        sendEvent(
          "/game/turn",
          {},
          {
            roomCode: roomCode,
            userId: nextPlayerId,
          }
        );
      }, 1000);
    }
  };

  useEffect(() => {
    if (action === "None") return;

    switch (action) {
      case "Started":
        ifNextTurnIsMe();
        break;
      case "TurnStart":
        throwYut();
        break;
      case "ThrowYut":
        break;
      case "TurnEnd":
        ifNextTurnIsMe();
        break;
    }
  }, [action]);

  return { initPlayerTurn, getNextPlayerId, nextTurn };
};

export default useGameTurn;
