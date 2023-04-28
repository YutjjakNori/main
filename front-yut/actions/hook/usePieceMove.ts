import { YutPieceCompoProps } from "@/present/component/YutPieceCompo/YutPieceCompo";
import { YutPieceListState } from "@/store/GameStore";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const animationSeconds = 0.5;

const usePieceMove = () => {
  const [pieceList, setPieceList] = useRecoilState(YutPieceListState);
  //움직여야할 piece의 index
  const [movePieceIndex, setMovePieceIndex] = useState(-1);
  //움직일 경로
  const [movePathList, setMovePathList] = useState<Array<number>>([]);

  //말 동내기
  const pieceOver = (userId: string, pieceId: number) => {
    const newArr = pieceList.filter(
      (piece) => piece.userId !== userId || piece.pieceId !== pieceId,
    );
    console.log(newArr);
    setPieceList(newArr);
  };

  //움직여야할 경로 정보
  const setMoveInfo = useCallback(
    (userId: string, pieceId: number, movePath: Array<number>) => {
      const pieceIndex = pieceList.findIndex(
        (p) => p.userId === userId && p.pieceId === pieceId,
      );
      setMovePieceIndex(pieceIndex);
      setMovePathList(movePath);
    },
    [pieceList],
  );

  const pieceMove = (
    userId: string,
    pieceId: number,
    movePath: Array<number>,
  ) => {
    setMoveInfo(userId, pieceId, movePath);
  };

  const doPieceMove = (movePieceIndex: number, pointIndex: number) => {
    const list = pieceList.map((p, idx) => {
      if (movePieceIndex !== idx) return p;
      const tmp: YutPieceCompoProps = { ...p };
      if (tmp.state === "NotStarted") {
        tmp.state = "InBoard";
      }
      tmp.position = pointIndex;
      return tmp;
    });
    setPieceList(list);
  };

  useEffect(() => {
    if (movePieceIndex === -1 || movePathList.length === 0) return;

    let i = 0;
    const timer = setInterval(() => {
      if (i >= movePathList.length) {
        clearInterval(timer);
        return;
      }
      doPieceMove(movePieceIndex, movePathList[i++]);
    }, animationSeconds * 1000);
  }, [movePathList, movePieceIndex]);

  return { pieceMove, pieceOver };
};

export default usePieceMove;
