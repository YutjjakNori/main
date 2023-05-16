import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import usePieceMove from "@/actions/hook/usePieceMove";
import {
  YutThrowBtnState,
  YutPieceListState,
  NowTurnPlayerIdState,
  SelectedPieceIndex,
  EventIndex,
  PiecePrevPosState,
} from "@/store/GameStore";

import Option0 from "@/public/icon/eventItems/0.svg";
import Option1 from "@/public/icon/eventItems/1.svg";
import Option2 from "@/public/icon/eventItems/2.svg";
import Option3 from "@/public/icon/eventItems/3.svg";
import Option4 from "@/public/icon/eventItems/4.svg";

import { YutPieceCompoProps } from "../YutPieceCompo/YutPieceCompo";
import useYutThrow from "@/actions/hook/useYutThrow";
import useGameAction from "@/actions/hook/useGameAction";

const EventCard = () => {
  const getEventByIndex = useCallback((index: number) => {
    switch (index) {
      case 0:
        return <Option0 width={"100%"} height={"100%"} />;
      case 1:
        return <Option1 width={"100%"} height={"100%"} />;
      case 2:
        return <Option2 width={"100%"} height={"100%"} />;
      case 3:
        return <Option3 width={"100%"} height={"100%"} />;
      case 4:
        return <Option4 width={"100%"} height={"100%"} />;
    }
  }, []);

  const [btnDisplay, setBtnDisplay] = useRecoilState(YutThrowBtnState);
  const [pieceList, setPieceList] = useRecoilState(YutPieceListState);
  const curUserId = useRecoilValue(NowTurnPlayerIdState);
  const [eventIndex, setEventIndex] = useRecoilState(EventIndex);
  const { appendPiece, pieceMove, doPieceMove, resetPieceState } =
    usePieceMove();
  const { isResultEmpty } = useYutThrow();
  const { turnEnd, selectPieceStart } = useGameAction();

  //선택된 piece의 index
  const [movePieceIndex, setMovePieceIndex] =
    useRecoilState(SelectedPieceIndex);

  // 윷말 전 위치 불러오기
  const piecePrevPos = useRecoilValue(PiecePrevPosState);

  function hideEventCard() {
    setTimeout(() => setEventIndex(-1), 2000);
  }

  // 이벤트) 말 업고 가기
  // 1. 시작 안한 말이 있는지 확인.
  // 1-1. 없다면(-1) 꽝으로 치환
  // 1-2. 있다면(>0) 첫 말번호 알아내기.
  //
  function appendEvent() {
    const pieceIdx = pieceList.findIndex((piece) => {
      return piece.userId === curUserId && piece.state === "NotStarted";
    });
    // 시작안한 말이 없다면 꽝으로 치환.
    if (pieceIdx === -1) {
      setTimeout(() => {
        setEventIndex(0);
      }, 2000);
    } else {
      const list = [pieceIdx, movePieceIndex];
      setEventIndex(2);
      setTimeout(() => {
        appendPiece();
      }, 2000);
    }
  }

  function moveToPrevPosEvent() {
    // userId, 말 정보, 이동위치move 모두 recoil에서 받아오기.
    const pieceId = pieceList[movePieceIndex].pieceId;
    console.log("현재 말 번호: " + pieceId);
    // // Array<number> 형식으로 맞춰주기.
    // const pieceIdList = [pieceId];
    // const movePath = [piecePrevPos];
    // pieceMove(curUserId, pieceIdList, movePath, "Move");
    doPieceMove(pieceId, piecePrevPos);
  }

  function moveToStartPosEvent() {
    // userId, 말 정보, 이동위치move 모두 recoil에서 받아오기.
    const pieceId = pieceList[movePieceIndex].pieceId;
    const pieceType = pieceList[movePieceIndex].pieceType;

    // const targetPiece = {curUserId, pieceId, pieceType, "InBoard", }
    const latestPieceList = pieceList;
    const targetPiece = latestPieceList[movePieceIndex];
    const appendedPieceList = [
      ...targetPiece.appendArray,
      latestPieceList[movePieceIndex],
    ].map((p) => resetPieceState(p));

    let newArr = [...latestPieceList];
    newArr.splice(movePieceIndex, 1);
    newArr = newArr.concat(appendedPieceList);
    setPieceList(newArr);
  }

  useEffect(() => {
    {
      takeAction(eventIndex);
    }
  }, [eventIndex]);

  const takeAction = (index: number) => {
    try {
      switch (index) {
        case 0:
          setEventIndex(0);
          break;
        case 1:
          setEventIndex(1);
          setBtnDisplay("block");
          break;
        case 2:
          setEventIndex(2);
          appendEvent();
          break;
        case 3:
          // 이전 위치 기억하는 변수가 있나?
          setEventIndex(3);
          moveToPrevPosEvent();
          break;
        case 4:
          // 맨 처음 위치로 이동
          setEventIndex(4);
          moveToStartPosEvent();
          break;
      }
    } catch (err) {
      throw err;
    } finally {
      hideEventCard();
      if (isResultEmpty) {
        turnEnd();
        return;
      }
      selectPieceStart();
    }
  };

  return <>{getEventByIndex(eventIndex)}</>;
};

export default EventCard;
