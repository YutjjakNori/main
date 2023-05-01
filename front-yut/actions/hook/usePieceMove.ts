import { YutPieceCompoProps } from "@/present/component/YutPieceCompo/YutPieceCompo";
import { ActiveCornerArrowState, YutPieceListState } from "@/store/GameStore";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import * as gameUtil from "@/utils/gameUtils";

const animationSeconds = 0.5;

const usePieceMove = () => {
  const [pieceList, setPieceList] = useRecoilState(YutPieceListState);
  //움직여야할 piece의 index
  const [movePieceIndex, setMovePieceIndex] = useState(-1);
  //움직일 경로
  const [movePathList, setMovePathList] = useState<Array<number>>([]);
  //모서리 분기점 활성화
  const [cornerSelectType, setCornerSelectType] = useRecoilState(
    ActiveCornerArrowState,
  );

  //말 동내기
  const pieceOver = (userId: string, pieceId: number) => {
    const newArr = pieceList.filter(
      (piece) => piece.userId !== userId || piece.pieceId !== pieceId,
    );
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

  //말 선택
  const selectPiece = useCallback((userId: string, pieceId: number) => {
    const pieceIndex = pieceList.findIndex(
      (p) => p.userId === userId && p.pieceId === pieceId,
    );
    setMovePieceIndex(pieceIndex);

    if (pieceIndex === -1)
      throw Error("id에 해당하는 말 정보를 찾을수 없습니다");

    const position = pieceList[pieceIndex].position;
    //선택한 말이 모서리면 모서리 분기점 활성화
    if (gameUtil.isCorner(position)) {
      const type = gameUtil.cornerIndexToType(position);
      setCornerSelectType(type);
      return;
    }
    //아닌 경우 reset
    setCornerSelectType("none");
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
        return;
      }
      doPieceMove(movePieceIndex, movePathList[i++]);
    }, animationSeconds * 1000);
  }, [movePathList, movePieceIndex]);

  return { pieceMove, pieceOver, selectPiece, clearActiveCornerArrow };
};

export default usePieceMove;
