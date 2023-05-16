import { YutPieceCompoProps } from "@/present/component/YutPieceCompo/YutPieceCompo";
import {
  ActiveCornerArrowState,
  NowTurnPlayerIdState,
  PieceCatchInfoState,
  PieceMoveTypeState,
  SelectedPieceIndex,
  YutPieceListState,
} from "@/store/GameStore";
import { useCallback, useEffect, useState } from "react";
import {
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import * as gameUtil from "@/utils/gameUtils";
import { sendEvent } from "../socket-api/socketInstance";
import { RoomCodeState, PiecePrevPosState } from "@/store/GameStore";
import useYutThrow from "./useYutThrow";
import { ThrowResultType } from "@/types/game/YutThrowTypes";
import useGameAction from "./useGameAction";
import { PieceMoveType } from "@/types/game/YutPieceTypes";

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
  // 윷말 이동 전 위치 저장
  const setPiecePrevPos = useSetRecoilState(PiecePrevPosState);

  const roomCode = useRecoilValue(RoomCodeState);
  const { getYutThrowResultForUse, popYutThrowResultForUse, isResultEmpty } =
    useYutThrow();
  const { turnEnd, selectPieceStart } = useGameAction();
  const [moveType, setMoveType] = useRecoilState(PieceMoveTypeState);
  const [, setCatchInfo] = useRecoilState(PieceCatchInfoState);
  const { throwYut } = useGameAction();

  //말 동내기
  const pieceOver = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const latestPieceList = await snapshot.getPromise(YutPieceListState);
        const latestPlayerId = await snapshot.getPromise(NowTurnPlayerIdState);
        const latestSelectedPieceIndex = await snapshot.getPromise(
          SelectedPieceIndex
        );

        const newArr = latestPieceList.filter(
          (piece) =>
            piece.userId !== latestPlayerId ||
            piece.pieceId !== latestPieceList[latestSelectedPieceIndex].pieceId
        );
        setPieceList(newArr);
      },
    []
  );

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
        // 말 이동 전 이전 위치 저장.
        const prevPosition = latestPieceList[pieceIndex].position;
        setPiecePrevPos(prevPosition);
      },
    []
  );

  const pieceMove = useRecoilCallback(
    ({ snapshot }) =>
      async (
        userId: string,
        pieceIdList: Array<number>,
        movePath: Array<number>,
        moveType: PieceMoveType
      ) => {
        const latestPieceList = await snapshot.getPromise(YutPieceListState);

        console.log("latestPieceList" + latestPieceList);

        latestPieceList.forEach((piece) => {
          console.log(piece.userId + ", " + piece.pieceId);
        });
        console.log("말번호: " + pieceIdList[0]);
        console.log("현재 유저 id: " + userId);

        let findIndex = -1;

        if (pieceIdList.length === 1) {
          console.log("말은 1개임. ");
          findIndex = latestPieceList.findIndex(
            (p) => p.userId === userId && p.pieceId === pieceIdList[0]
          );
          console.log(findIndex);
        } else {
          // append 된 list인 경우 어떤 말을 움직일지 찾아야함, 현재 위치가 도착지가 아닌 piece id를 고름
          findIndex = latestPieceList.findIndex((p) => {
            const index = pieceIdList.findIndex(
              (id) =>
                p.userId === userId &&
                p.pieceId === id &&
                movePath[movePath.length - 1] !== p.position
            );

            return index !== -1;
          });
        }

        const selectedPiece = latestPieceList[findIndex];
        console.log("selectedPiece" + selectPiece);

        const playerPieceList = latestPieceList.filter(
          (p) =>
            p.userId === selectedPiece.userId &&
            selectedPiece.position === p.position
        );

        if (playerPieceList.length === 0)
          throw Error("움직일 piece를 찾을수 없습니다");
        setMoveInfo(userId, playerPieceList[0].pieceId, movePath);
        setMoveType(moveType);
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
  const appendPiece = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const latestPieceList = await snapshot.getPromise(YutPieceListState);
        const latestNowTurnPlayerId = await snapshot.getPromise(
          NowTurnPlayerIdState
        );
        const latestMovePieceIndex = await snapshot.getPromise(
          SelectedPieceIndex
        );

        const latestSelectedPiece = latestPieceList[latestMovePieceIndex];
        let samePositionIdList: Array<number> = [];
        // 현재 움직인 말과 같은 position인 piece를 찾아서 index list를 만듦
        for (let i = 0; i < latestPieceList.length; i++) {
          const p = latestPieceList[i];
          if (p.userId !== latestSelectedPiece.userId) continue;

          if (p.position === latestSelectedPiece.position)
            samePositionIdList.push(p.pieceId);
        }

        const fromIdx = latestMovePieceIndex; //움직인 말
        const toIdx = latestPieceList.findIndex(
          (p) =>
            p.userId === latestNowTurnPlayerId &&
            p.pieceId === samePositionIdList[0]
        ); //가만히 있던 말
        appendAToB(latestNowTurnPlayerId, fromIdx, toIdx);
        return;
      },
    []
  );

  const appendAToB = useRecoilCallback(
    ({ snapshot }) =>
      async (
        userId: string,
        movePieceIndex: number, //움직여서 합칠 말
        targetPieceIndex: number //원래 말 판에 있던 말
      ) => {
        const latestPieceList = await snapshot.getPromise(YutPieceListState);

        let basePiece = latestPieceList[movePieceIndex];
        let targetPiece = latestPieceList[targetPieceIndex];

        if (
          basePiece.state === "NotStarted" &&
          targetPiece.state === "NotStarted"
        ) {
          throw Error(
            "usePieceMove/appendPiece : 둘다 시작하지 않은 말이므로 업을 수 없음"
          );
        }

        // if (
        //   basePiece.state === "InBoard" &&
        //   targetPiece.state === "NotStarted"
        // ) {
        //   const tmpIndex = movePieceIndex;
        //   const tmpPiece = basePiece;

        //   movePieceIndex = targetPieceIndex;
        //   basePiece = targetPiece;

        //   targetPieceIndex = tmpIndex;
        //   targetPiece = tmpPiece;
        // }

        //target에 move를 append함
        let newArr = latestPieceList.map((p, idx) => {
          if (idx !== targetPieceIndex) return p;

          const tmpP = { ...p };
          const baseTmpP = { ...latestPieceList[movePieceIndex] };
          baseTmpP.state = "Appended";
          baseTmpP.position = tmpP.position;
          tmpP.appendArray = [...tmpP.appendArray, baseTmpP];
          return tmpP;
        });

        newArr.splice(movePieceIndex, 1);
        setPieceList(newArr);
      },
    []
  );

  const saveCatchInfo = useCallback(
    (catchedUserId: string, catchedPieceList: Array<number>) => {
      setCatchInfo({
        catchedUserId: catchedUserId,
        catchedPieceIdList: catchedPieceList,
      });
    },
    []
  );

  const catchPiece = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const latestPieceList = await snapshot.getPromise(YutPieceListState);
        const { catchedUserId, catchedPieceIdList } = await snapshot.getPromise(
          PieceCatchInfoState
        );

        //말을 업은 경우 pieceList에 있는 pieceId의 index를 찾음
        let targetPieceIndex = -1;
        for (let i = 0; i < catchedPieceIdList.length; i++) {
          const idx = latestPieceList.findIndex(
            (p) =>
              p.userId === catchedUserId && p.pieceId === catchedPieceIdList[i]
          );

          if (idx !== -1) {
            targetPieceIndex = idx;
          }
        }
        if (targetPieceIndex === -1)
          throw Error("usePieceMove/catchPiece : 잡을 말을 찾을 수 없습니다");

        //targetPiece의 appendedList를 초기화하고 다시 pieceList에 넣어줌
        const targetPiece = latestPieceList[targetPieceIndex];
        const appendedPieceList = [
          ...targetPiece.appendArray,
          latestPieceList[targetPieceIndex],
        ].map((p) => resetPieceState(p));

        let newArr = [...latestPieceList];
        newArr.splice(targetPieceIndex, 1);
        newArr = newArr.concat(appendedPieceList);
        setPieceList(newArr);
      },
    []
  );

  const resetPieceState = useCallback((piece: YutPieceCompoProps) => {
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

        // move가 끝나면 추가 동작
        switch (moveType) {
          case "Append":
            appendPiece();
            break;
          case "Over":
            pieceOver();
            break;
          case "Catch":
            catchPiece().then(() => throwYut());
            return;
          case "Event":
            // TODO : event 관련 로직 추가
            return;
        }

        if (isResultEmpty) {
          turnEnd();
          return;
        }
        selectPieceStart();
        return;
      }
      doPieceMove(movePieceIndex, movePathList[i++]);
    }, animationSeconds * 1000);
  }, [movePathList]);

  return {
    pieceMove,
    pieceOver,
    selectPiece,
    selectArrow,
    clearActiveCornerArrow,
    appendPiece,
    catchPiece,
    saveCatchInfo,
    doPieceMove,
    resetPieceState,
  };
};

export default usePieceMove;
