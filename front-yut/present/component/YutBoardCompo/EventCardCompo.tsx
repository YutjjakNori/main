import { useCallback, useEffect } from "react";
import {
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
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
  const {
    eventAppendAToB,
    appendAToB,
    pieceMove,
    doPieceMove,
    resetPieceState,
  } = usePieceMove();
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
    // console.log("event value", eventCallbackValue);
    // console.log("이벤트 콜백 실행시킬지 말지", runEventCallback);
    runEvent(eventCallbackValue);
    // console.log(runEventCallback);
  }, [eventCallbackValue]);

  // 2,3,4 (=> 0, 1) 인 경우만 event 다같이 실행.
  const runEvent = (data: RunEventResponseType) => {
    const eventType = data.event;

    // const prevPos = data.

    switch (eventType) {
      // 말 업기
      case 0:
        const movePieceIndex = data.selectPiece[0]; //2
        const targetPieceIndex = data.selectPiece[1]; //3

        appendEvent(movePieceIndex, targetPieceIndex);

        break;
      case 1:
        if (data.move === -1) {
          // console.log("data.selectPiece : " + data.selectPiece);
          moveToStartPosEvent(data.selectPiece, data.userId);
        } else {
          // moveToPrevPosEvent();
        }
        break;
    }

    if (isResultEmpty) {
      setTimeout(() => {
        // setRunEventCallback(true);
        turnEnd();
      }, 1000);
      return;
    }
    selectPieceStart();
    return;
  };

  // function appendEvent() {
  //   const pieceIdx = pieceList.findIndex((piece) => {
  //     return piece.userId === curUserId && piece.state === "NotStarted";
  //   });
  //   // 시작안한 말이 없다면 꽝으로 치환.
  //   if (pieceIdx === -1) {
  //     setTimeout(() => {
  //       setEventIndex(0);
  //     }, 2000);
  //   } else {
  //     const list = [pieceIdx, movePieceIndex];
  //     setTimeout(() => {
  //       appendPiece();
  //     }, 2000);
  //   }
  // }

  // 이벤트) 말 업고 가기
  // 1. 시작 안한 말이 있는지 확인.
  // 1-1. 없다면(-1) 꽝으로 치환
  // 1-2. 있다면(>0) 첫 말번호 알아내기.
  //
  function appendEvent(movePieceIndex: number, targetPieceIndex: number) {
    const A = pieceList.findIndex((piece) => {
      return piece.userId === curUserId && piece.pieceId === movePieceIndex;
    });
    const B = pieceList.findIndex((piece) => {
      return piece.userId === curUserId && piece.pieceId === targetPieceIndex;
    });

    appendAToB(curUserId, A, B);
  }

  function moveToPrevPosEvent(pieceIdList: Array<number>, userId: string) {
    // userId, 말 정보, 이동위치move 모두 recoil에서 받아오기.
    // const pieceId = pieceList[movePieceIndex].pieceId;

    // console.log("현재 말 index: " + movePieceIndex);
    // // Array<number> 형식으로 맞춰주기.
    // const pieceIdList = [pieceId];
    // const movePath = [piecePrevPos];
    // pieceMove(curUserId, pieceIdList, movePath, "Move");

    // 만약 이전 위치가 시작전인 경우
    if (piecePrevPos == -1) {
      moveToStartPosEvent(pieceIdList, userId);
      return;
    }

    setTimeout(() => {
      doPieceMove(movePieceIndex, piecePrevPos);
    }, 1000);
  }

  function moveToStartPosEvent(pieceIdList: Array<number>, userId: string) {
    // userId, 말 정보, 이동위치move 모두 recoil에서 받아오기
    let index = -1;

    pieceIdList.forEach((id) => {
      const idx = pieceList.findIndex(
        (p) => p.userId === userId && p.pieceId === id
      );

      if (idx !== -1) {
        index = idx;
      }
    });

    if (index === -1) {
      console.log(pieceIdList, pieceList);
      throw Error("시작점으로 되돌릴 말을 찾지 못했습니다");
    }

    console.log("처음으로 되돌리기", pieceIdList);
    console.log("처음으로 되돌릴 index", index);
    console.log("처음으로 되돌릴 piece의 정보", pieceList[index]);

    const latestPieceList = pieceList;
    const targetPiece = latestPieceList[index];
    const appendedPieceList = [
      ...targetPiece.appendArray,
      latestPieceList[movePieceIndex],
    ].map((p) => resetPieceState(p));

    let newArr = [...latestPieceList];
    newArr.splice(index, 1);
    newArr = newArr.concat(appendedPieceList);

    // console.log("reset result", newArr);
    setPieceList(newArr);
  }

  useEffect(() => {
    {
      // if (eventIndex === -1) console.log("이벤트카드 숨기기");
      // else console.log(eventIndex + " :번 이벤트 시작!");
      showEventPoster(eventIndex);
    }
  }, [eventIndex]);

  useEffect(() => {
    // console.log("movePieceIndex 확인! : " + movePieceIndex);
    // console.log("curUserId 확인! : " + curUserId);
  }, [movePieceIndex]);

  const showEventPoster = useRecoilCallback(
    ({ snapshot }) =>
      async (index: number) => {
        // setEventIndex(index);
        // console.log("이벤트 실행!");
        const latestPieceList = await snapshot.getPromise(YutPieceListState);
        const latestSelectedPieceIndex = await snapshot.getPromise(
          SelectedPieceIndex
        );

        const latestNowTurnPlayerId = await snapshot.getPromise(
          NowTurnPlayerIdState
        );
        const latestMyInfo = await snapshot.getPromise(UserInfoState);

        // console.log("event card");
        // console.log("curUserId 확인! : " + curUserId);
        // console.log("현재 선택된 말 index", latestSelectedPieceIndex);
        // console.log(
        //   "현재 차례인 말",
        //   latestPieceList[latestSelectedPieceIndex]
        // );

        try {
          switch (index) {
            // 꽝
            case 0:
              //턴 돌리기 호출
              hideEventCard(() => {
                if (isResultEmpty) {
                  console.log("꽝, turn end");
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
              console.log("말 업기 실행 ");
              hideEventCard(() => {
                // 현재 차례가 자기인 경우의 플레이어만 소켓 통신 요청 보냄.
                // 말이 1개인 경우만 먼저 처리. 말이 이미 업힌 경우는 나중에 해볼것!
                const pieceIdList = [
                  latestPieceList[latestSelectedPieceIndex].pieceId,
                ];
                const nowPosition =
                  latestPieceList[latestSelectedPieceIndex].position;

                let eventType;
                if (index === 2) eventType = 0;
                else eventType = 1;

                // console.log(
                //   "roomCode: " + roomCode,
                //   " latestNowTurnPlayerId: " +
                //     latestNowTurnPlayerId +
                //     " pieceIdList: " +
                //     pieceIdList,
                //   " nowPosition: " + nowPosition,
                //   " eventType: " + eventType,
                //   " piecePrevPos: " + piecePrevPos
                // );

                // 시작안한 말이 없다면 꽝으로 치환.
                const pieceIdx = latestPieceList.findIndex((piece) => {
                  return (
                    piece.userId === latestNowTurnPlayerId &&
                    piece.state === "NotStarted"
                  );
                });
                if (pieceIdx === -1) {
                  setTimeout(() => {
                    setEventIndex(0);
                    return;
                    // console.log("yut reulst is Empty? : ", isResultEmpty);
                    // if (isResultEmpty) {
                    //   turnEnd();
                    //   return;
                    // }
                  }, 2000);
                }

                if (latestMyInfo.userId === latestNowTurnPlayerId) {
                  sendEvent(
                    "/game/event/result",
                    {},
                    {
                      roomCode: roomCode,
                      userId: latestNowTurnPlayerId, // recoil 전역변수
                      selectPiece: pieceIdList,
                      plateNum: nowPosition,
                      event: eventType,
                      //prevPosition: -1,
                      prevPosition: piecePrevPos,
                    }
                  );
                }
                // appendEvent();
              }); //end of hideEventCard
              break;
            case 3:
              hideEventCard(() => {
                if (latestMyInfo.userId === latestNowTurnPlayerId) {
                  // 말이 1개인 경우만 먼저 처리. 말이 이미 업힌 경우는 나중에 해볼것!
                  const pieceIdList = [
                    latestPieceList[latestSelectedPieceIndex].pieceId,
                  ];

                  const nowPosition =
                    latestPieceList[latestSelectedPieceIndex].position;

                  let eventType;
                  eventType = 1;

                  sendEvent(
                    "/game/event/result",
                    {},
                    {
                      roomCode: roomCode,
                      userId: latestNowTurnPlayerId, // recoil 전역변수
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
                if (latestMyInfo.userId === latestNowTurnPlayerId) {
                  // 말이 1개인 경우만 먼저 처리. 말이 이미 업힌 경우는 나중에 해볼것!
                  const pieceIdList = [
                    latestPieceList[latestSelectedPieceIndex].pieceId,
                  ];

                  const nowPosition =
                    latestPieceList[latestSelectedPieceIndex].position;

                  let eventType;
                  eventType = 1;

                  sendEvent(
                    "/game/event/result",
                    {},
                    {
                      roomCode: roomCode,
                      userId: latestNowTurnPlayerId, // recoil 전역변수
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
      },
    []
  );

  return <>{getEventByIndex(eventIndex)}</>;
};

export default EventCard;
