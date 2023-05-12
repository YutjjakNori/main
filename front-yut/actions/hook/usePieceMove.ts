import { YutPieceCompoProps } from "@/present/component/YutPieceCompo/YutPieceCompo";
import {
  ActiveCornerArrowState,
  NowTurnPlayerIdState,
  SelectedPieceIndex,
  YutPieceListState,
} from "@/store/GameStore";
import { useCallback, useEffect, useState } from "react";
import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";
import * as gameUtil from "@/utils/gameUtils";
import { sendEvent } from "../socket-api/socketInstance";
import { RoomCodeState } from "@/store/GameStore";
import useYutThrow from "./useYutThrow";
import { ThrowResultType } from "@/types/game/YutThrowTypes";
import useGameAction from "./useGameAction";

const animationSeconds = 0.5;

const usePieceMove = () => {
  const [pieceList, setPieceList] = useRecoilState(YutPieceListState);
  //움직여야할 piece의 index
  const [movePieceIndex, setMovePieceIndex] =
    useRecoilState(SelectedPieceIndex);
  //움직일 경로
  const [movePathList, setMovePathList] = useState<Array<number>>([]);
  //모서리 분기점 활성화
  const [cornerSelectType, setCornerSelectType] = useRecoilState(
    ActiveCornerArrowState
  );
  const roomCode = useRecoilValue(RoomCodeState);
  const { getYutThrowResultForUse, popYutThrowResultForUse, isResultEmpty } =
    useYutThrow();
  const { turnEnd, selectPieceStart } = useGameAction();

  const findIndexByUserIdAndPieceId = useCallback(
    (userId: string, pieceId: number) => {
      return pieceList.findIndex(
        (p) => p.userId === userId && p.pieceId === pieceId
      );
    },
    [pieceList]
  );

  //말 동내기
  const pieceOver = (userId: string, pieceId: number) => {
    const newArr = pieceList.filter(
      (piece) => piece.userId !== userId || piece.pieceId !== pieceId
    );
    setPieceList(newArr);
  };

  const setMoveInfo = useRecoilCallback(
    ({ snapshot }) =>
      async (userId: string, pieceId: number, movePath: Array<number>) => {
        const latestPieceList = await snapshot.getPromise(YutPieceListState);
        const pieceIndex = latestPieceList.findIndex(
          (p) => p.userId === userId && p.pieceId === pieceId
        );
        await popYutThrowResultForUse();
        setMovePieceIndex(pieceIndex);
        setMovePathList(movePath);
      },
    []
  );

  const pieceMove = useRecoilCallback(
    ({ snapshot }) =>
      async (
        userId: string,
        pieceIdList: Array<number>,
        movePath: Array<number>
      ) => {
        const latestPieceList = await snapshot.getPromise(YutPieceListState);

        const playerPieceList = latestPieceList.filter((p) => {
          const index = pieceIdList.findIndex(
            (pId) => p.userId === userId && p.pieceId === pId
          );

          if (index !== -1) return p;
        });

        if (playerPieceList.length === 0)
          throw Error("움직일 piece를 찾을수 없습니다");
        setMoveInfo(userId, playerPieceList[0].pieceId, movePath);
      },
    []
  );
  const doPieceMove = useRecoilCallback(
    ({ snapshot }) =>
      async (movePieceIndex: number, pointIndex: number) => {
        const latestPieceList = await snapshot.getPromise(YutPieceListState);

        const list = latestPieceList.map((p, idx) => {
          if (movePieceIndex !== idx) return p;
          const tmp: YutPieceCompoProps = { ...p };
          if (tmp.state === "NotStarted") {
            tmp.state = "InBoard";
          }
          tmp.position = pointIndex;
          return tmp;
        });
        setPieceList(list);
      },
    []
  );

  // 도 1, 개 2, 걸 3, 윷 4, 모 5
  const convertThrowResultToInt = useCallback((type: ThrowResultType) => {
    switch (type) {
      case "도":
        return 1;
      case "개":
        return 2;
      case "걸":
        return 3;
      case "윷":
        return 4;
      case "모":
        return 5;
      default:
        throw Error("잘못된 윷 던지기 결과 타입입니다");
    }
  }, []);

  //말 선택
  const selectPiece = useRecoilCallback(
    ({ snapshot }) =>
      async (userId: string, pieceId: number) => {
        const latestPiecList = await snapshot.getPromise(YutPieceListState);
        const pieceIndex = latestPiecList.findIndex(
          (p) => p.userId === userId && p.pieceId === pieceId
        );
        setMovePieceIndex(pieceIndex);

        if (pieceIndex === -1)
          throw Error("id에 해당하는 말 정보를 찾을수 없습니다");

        //윷 말 선택했을 경우
        const selectePieceList = [
          latestPiecList[pieceIndex].pieceId,
          ...latestPiecList[pieceIndex].appendArray.map(
            (piece) => piece.pieceId
          ),
        ];

        const yutType = convertThrowResultToInt(
          await getYutThrowResultForUse()
        );

        const position = latestPiecList[pieceIndex].position;
        //선택한 말이 모서리면 모서리 분기점 활성화
        if (gameUtil.isCorner(position)) {
          const type = gameUtil.cornerIndexToType(position);
          setCornerSelectType(type);
          return;
        }
        //아닌 경우 reset
        setCornerSelectType("none");

        const request = {
          roomCode: roomCode,
          userId: userId,
          selectPiece: selectePieceList,
          plateNum: position,
          yut: yutType,
          direction: 1,
        };
        sendEvent("/game/piece", {}, request);
      }
  );

  const selectArrow = useRecoilCallback(
    ({ snapshot }) =>
      async (arrowType: number, position: number) => {
        const latestNowTurnPlayerId = await snapshot.getPromise(
          NowTurnPlayerIdState
        );
        const latestPieceList = await snapshot.getPromise(YutPieceListState);

        const selectedPieceIndex = latestPieceList.findIndex(
          (p) => p.userId === latestNowTurnPlayerId && p.position === position
        );

        if (selectedPieceIndex === -1)
          throw Error("모서리에 있는 말의 정보를 찾을수 없습니다");

        const selectePieceList = [
          latestPieceList[selectedPieceIndex].pieceId,
          ...latestPieceList[selectedPieceIndex].appendArray.map(
            (piece) => piece.pieceId
          ),
        ];

        const yutType = convertThrowResultToInt(
          await getYutThrowResultForUse()
        );

        const request = {
          roomCode: roomCode,
          userId: latestNowTurnPlayerId,
          selectPiece: selectePieceList,
          plateNum: position,
          yut: yutType,
          direction: arrowType,
        };

        sendEvent("/game/piece", {}, request);
      }
  );

  //말 합치기
  const appendPiece = (userId: string, targetPieceIdList: Array<number>) => {
    if (targetPieceIdList.length === 2) {
      const fromId = targetPieceIdList[0];
      const toId = targetPieceIdList[1];
      appendAToB(userId, fromId, toId);
      return;
    }

    const filteredIdList: Array<number> = targetPieceIdList.filter((id) => {
      const idx = pieceList.findIndex(
        (p) => p.userId === userId && p.pieceId === id
      );

      return idx !== -1;
    });

    if (filteredIdList.length > 2) {
      throw Error("잘못된 말 업기 요청입니다.");
    }

    appendAToB(userId, filteredIdList[0], filteredIdList[1]);
  };

  const appendAToB = (
    userId: string,
    movePieceIndex: number, //움직여서 합칠 말
    targetPieceIndex: number //원래 말 판에 있던 말
  ) => {
    let basePiece = pieceList[movePieceIndex];
    let targetPiece = pieceList[targetPieceIndex];

    if (
      basePiece.state === "NotStarted" &&
      targetPiece.state === "NotStarted"
    ) {
      throw Error(
        "usePieceMove/appendPiece : 둘다 시작하지 않은 말이므로 업을 수 없음"
      );
    }

    if (basePiece.state === "InBoard" && targetPiece.state === "NotStarted") {
      const tmpIndex = movePieceIndex;
      const tmpPiece = basePiece;

      movePieceIndex = targetPieceIndex;
      basePiece = targetPiece;

      targetPieceIndex = tmpIndex;
      targetPiece = tmpPiece;
    }

    //target에 move를 append함
    let newArr = pieceList.map((p, idx) => {
      if (idx !== targetPieceIndex) return p;

      const tmpP = { ...p };
      const baseTmpP = { ...pieceList[movePieceIndex] };
      baseTmpP.state = "Appended";
      baseTmpP.position = tmpP.position;
      tmpP.appendArray = [...tmpP.appendArray, baseTmpP];
      return tmpP;
    });

    newArr.splice(movePieceIndex, 1);
    setPieceList(newArr);
  };

  const catchPiece = (
    targetUserId: string,
    targetPieceIdList: Array<number>
  ) => {
    //말을 업은 경우 pieceList에 있는 pieceId의 index를 찾음
    let targetPieceIndex = -1;
    for (let i = 0; i < targetPieceIdList.length; i++) {
      const idx = pieceList.findIndex(
        (p) => p.userId === targetUserId && p.pieceId === targetPieceIdList[i]
      );

      if (idx !== -1) {
        targetPieceIndex = idx;
      }
    }
    if (targetPieceIndex === -1)
      throw Error("usePieceMove/catchPiece : 잡을 말을 찾을 수 없습니다");

    //targetPiece의 appendedList를 초기화하고 다시 pieceList에 넣어줌
    const targetPiece = pieceList[targetPieceIndex];
    const appendedPieceList = [
      ...targetPiece.appendArray,
      pieceList[targetPieceIndex],
    ].map((p) => pieceCatched(p));

    let newArr = [...pieceList];
    newArr.splice(targetPieceIndex, 1);
    newArr = newArr.concat(appendedPieceList);
    setPieceList(newArr);
  };

  const pieceCatched = useCallback((piece: YutPieceCompoProps) => {
    const tmp = { ...piece };
    tmp.position = -1;
    tmp.state = "NotStarted";
    tmp.appendArray = [];
    return tmp;
  }, []);

  const clearActiveCornerArrow = useCallback(() => {
    setCornerSelectType("none");
  }, []);

  useEffect(() => {
    if (movePieceIndex === -1 || movePathList.length === 0) return;

    let i = 0;
    const timer = setInterval(() => {
      if (i >= movePathList.length) {
        clearInterval(timer);

        if (isResultEmpty) {
          turnEnd();
          return;
        }
        selectPieceStart();
        return;
      }
      doPieceMove(movePieceIndex, movePathList[i++]);
    }, animationSeconds * 1000);
  }, [movePathList, movePieceIndex]);

  return {
    pieceMove,
    pieceOver,
    selectPiece,
    selectArrow,
    clearActiveCornerArrow,
    appendPiece,
    catchPiece,
  };
};

export default usePieceMove;
