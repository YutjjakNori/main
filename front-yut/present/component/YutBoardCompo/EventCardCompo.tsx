import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import usePieceMove from "@/actions/hook/usePieceMove";
import {
  YutThrowBtnState,
  YutPieceListState,
  NowTurnPlayerIdState,
  SelectedPieceIndex,
  EventIndex,
  PiecePrevPosState,
  RoomCodeState,
  EventCallbackValue,
  RunEventCallback,
} from "@/store/GameStore";

import { sendEvent } from "@/actions/socket-api/socketInstance";

import Option0 from "@/public/icon/eventItems/0.svg";
import Option1 from "@/public/icon/eventItems/1.svg";
import Option2 from "@/public/icon/eventItems/2.svg";
import Option3 from "@/public/icon/eventItems/3.svg";
import Option4 from "@/public/icon/eventItems/4.svg";

import { YutPieceCompoProps } from "../YutPieceCompo/YutPieceCompo";
import useYutThrow from "@/actions/hook/useYutThrow";
import useGameAction from "@/actions/hook/useGameAction";

import { UserInfoState } from "@/store/UserStore";

import { RunEventResponseType } from "@/types/game/SocketResponseTypes";

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
  const { turnEnd, selectPieceStart, throwYut } = useGameAction();

  const myUserInfo = useRecoilValue(UserInfoState);
  const nowTurnPlayerId = useRecoilValue(NowTurnPlayerIdState);
  const roomCode = useRecoilValue(RoomCodeState);
  const eventCallbackValue = useRecoilValue(EventCallbackValue);
  const runEventCallback = useRecoilValue(RunEventCallback);

  //선택된 piece의 index
  const [movePieceIndex, setMovePieceIndex] =
    useRecoilState(SelectedPieceIndex);

  // 윷말 전 위치 불러오기
  const piecePrevPos = useRecoilValue(PiecePrevPosState);

  function hideEventCard(callback: any) {
    setTimeout(() => {
      setEventIndex(-1);
      callback();
    }, 2000);
  }

  useEffect(() => {
    runEvent(eventCallbackValue);
    console.log(runEventCallback);
  }, [runEventCallback]);

  // 2,3,4 (=> 0, 1) 인 경우만 event 다같이 실행.
  const runEvent = (data: RunEventResponseType) => {
    const eventType = data.event;

    console.log(data);
    // const prevPos = data.

    switch (eventType) {
      case 0:
        appendEvent();
        break;
      case 1:
        if (data.move === -1) {
          moveToStartPosEvent();
        } else {
          moveToPrevPosEvent();
        }
        break;
    }

    if (isResultEmpty) {
      turnEnd();
      return;
    }
    selectPieceStart();
    return;
  };

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
    // const pieceId = pieceList[movePieceIndex].pieceId;

    console.log("현재 말 index: " + movePieceIndex);
    // // Array<number> 형식으로 맞춰주기.
    // const pieceIdList = [pieceId];
    // const movePath = [piecePrevPos];
    // pieceMove(curUserId, pieceIdList, movePath, "Move");

    // 만약 이전 위치가 시작전인 경우
    if (piecePrevPos == -1) {
      moveToStartPosEvent();
      return;
    }

    setTimeout(() => {
      doPieceMove(movePieceIndex, piecePrevPos);
    }, 1000);
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
      showEventPoster(eventIndex);
    }
  }, [eventIndex]);

  const showEventPoster = (index: number) => {
    setEventIndex(index);
    try {
      switch (index) {
        case 0:
          //턴 돌리기 호출
          hideEventCard(() => {
            if (isResultEmpty) {
              turnEnd();
              return;
            }
            selectPieceStart();
            return;
          });
          return;
        case 1:
          // 윷 던지기 호출
          hideEventCard(() => {
            throwYut();
          });
          break;
        case 2:
          // 말 업기
          hideEventCard(() => {
            if (myUserInfo.userId === nowTurnPlayerId) {
              // 말이 1개인 경우만 먼저 처리. 말이 이미 업힌 경우는 나중에 해볼것!
              const pieceIdList = [pieceList[movePieceIndex].pieceId];

              const nowPosition = pieceList[movePieceIndex].position;

              let eventType;
              if (index === 2) eventType = 0;
              else eventType = 1;

              if (myUserInfo.userId === nowTurnPlayerId) {
                console.log(
                  roomCode +
                    " " +
                    nowTurnPlayerId +
                    " " + // recoil 전역변수
                    pieceIdList +
                    " " +
                    nowPosition +
                    " " +
                    eventType +
                    " " +
                    piecePrevPos
                );
                sendEvent(
                  "/game/event/result",
                  {},
                  {
                    roomCode: roomCode,
                    userId: nowTurnPlayerId, // recoil 전역변수
                    selectPiece: pieceIdList,
                    plateNum: nowPosition,
                    event: eventType,
                    //prevPosition: -1,
                    prevPosition: piecePrevPos,
                  }
                );
              }
            }
            // appendEvent();
          });
          break;
        case 3:
          hideEventCard(() => {
            if (myUserInfo.userId === nowTurnPlayerId) {
              // 말이 1개인 경우만 먼저 처리. 말이 이미 업힌 경우는 나중에 해볼것!
              const pieceIdList = [pieceList[movePieceIndex].pieceId];

              const nowPosition = pieceList[movePieceIndex].position;

              let eventType;
              eventType = 1;

              sendEvent(
                "/game/event/result",
                {},
                {
                  roomCode: roomCode,
                  userId: nowTurnPlayerId, // recoil 전역변수
                  selectPiece: pieceIdList,
                  plateNum: nowPosition,
                  event: eventType,
                  prevPosition: piecePrevPos,
                }
              );
            }
            // moveToPrevPosEvent();
          });
          break;
        case 4:
          // 맨 처음 위치로 이동
          hideEventCard(() => {
            if (myUserInfo.userId === nowTurnPlayerId) {
              // 말이 1개인 경우만 먼저 처리. 말이 이미 업힌 경우는 나중에 해볼것!
              const pieceIdList = [pieceList[movePieceIndex].pieceId];

              const nowPosition = pieceList[movePieceIndex].position;

              let eventType;
              eventType = 1;

              sendEvent(
                "/game/event/result",
                {},
                {
                  roomCode: roomCode,
                  userId: nowTurnPlayerId, // recoil 전역변수
                  selectPiece: pieceIdList,
                  plateNum: nowPosition,
                  event: eventType,
                  prevPosition: -1,
                }
              );
            }
            // moveToStartPosEvent();
          });
          break;
      }
    } catch (err) {
      throw err;
    }
  };

  return <>{getEventByIndex(eventIndex)}</>;
};

export default EventCard;
