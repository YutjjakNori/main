//게임 화면

import { PlayerCompoProps } from "@/present/component/PlayerCompo/PlayerCompo";
import { colors } from "@/styles/theme";
import { useCallback, useEffect, useState } from "react";
import useGameTurn from "@/actions/hook/useGameTurn";
import usePieceMove from "@/actions/hook/usePieceMove";
import GameLayout from "@/present/layout/game/GameLayout";
import { sendEvent, subscribeTopic } from "@/actions/socket-api/socketInstance";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  RoomCodeState,
  EventIndex,
  NowTurnPlayerIdState,
} from "@/store/GameStore";
import {
  GameStartResponseType,
  GameStartUserType,
  GameTurnStartResponseType,
  PieceMoveResponseType,
  YutThrowResponseType,
  EventResponseType,
} from "@/types/game/SocketResponseTypes";
import useGameAction from "@/actions/hook/useGameAction";
import useYutThrow from "@/actions/hook/useYutThrow";
import { UserInfoState } from "@/store/UserStore";
import { MemberReadyListState } from "@/store/MemberStore";

const Game = () => {
  const { initPlayerTurn, nextTurn } = useGameTurn();
  const { turnEnd, movePiece } = useGameAction();
  const { pieceMove, saveCatchInfo } = usePieceMove();
  const { saveThrowResult } = useYutThrow();
  const roomCode = useRecoilValue(RoomCodeState);
  const [userList, setUserList] = useState<Array<PlayerCompoProps>>([]);
  const myInfo = useRecoilValue(UserInfoState);
  const [eventPositionList, setEventPositionList] = useState<Array<number>>([
    -1, -1,
  ]);
  const setEventIndex = useSetRecoilState(EventIndex);
  const nowTurnPlayerId = useRecoilValue(NowTurnPlayerIdState);
  const playerNicknameList = useRecoilValue(MemberReadyListState);

  //게임 시작시 사용자 정보 셋팅
  const gameStartCallback = useCallback((response: GameStartResponseType) => {
    const users: Array<GameStartUserType> = response?.users;
    const event = response?.event;
    initPlayerTurn(users.map((user) => user.id));
    const list: Array<PlayerCompoProps> = users.map((user, index) => {
      const player = playerNicknameList.find((u) => u.userId === user.id);

      return {
        playerName: player?.nickName ?? user.id,
        profileImage: "",
        userId: user.id,
        color: colors.gamePlayer[index],
      };
    });
    setUserList(list);
    setEventPositionList(event);
  }, []);

  //현재 턴인 사람 정보 수정
  const startTurnCallback = (response: GameTurnStartResponseType) => {
    // TODO : timer 설정
    nextTurn(response.userId);
  };

  // 윷 던지기
  const throwYutCallback = (response: YutThrowResponseType) => {
    saveThrowResult(response.result);
  };

  const selectPieceCallback = (response: PieceMoveResponseType) => {
    const callbackType = response.type;
    movePiece();
    const { event, userId, selectPiece, move } = response.data;

    switch (callbackType) {
      case 1:
        if (!event) {
          pieceMove(userId, selectPiece, move, "Move");
          return;
        }
        pieceMove(userId, selectPiece, move, "Event");
        return;
      case 2:
        if (!event) {
          const { caughtUserId, caughtPiece } = response.data;
          if (!caughtUserId || !caughtPiece) {
            throw Error("잡을 사용자의 정보가 없습니다");
          }
          saveCatchInfo(caughtUserId, caughtPiece);
          pieceMove(userId, selectPiece, move, "Catch");
          return;
        }
      // 말 합치기
      case 3:
        if (!event) {
          pieceMove(userId, selectPiece, move, "Append");
          return;
        }
      // 말 동나기
      case 4:
        const { end } = response.data;
        // 게임 종료
        if (end) {
          return;
        }
        pieceMove(userId, selectPiece, move, "Over");
        return;
    }
  };

  const getEventCallback = (data: any) => {
    const eventType = data.event;
    console.log("event 번호!: " + eventType);
    setEventIndex(eventType);
  };

  const initSubscribe = () => {
    subscribeTopic(`/topic/game/start/${myInfo.userId}`, gameStartCallback);
    subscribeTopic(`/topic/game/turn/${roomCode}`, startTurnCallback);
    subscribeTopic(`/topic/game/stick/${roomCode}`, throwYutCallback);
    subscribeTopic(`/topic/game/piece/${roomCode}`, selectPieceCallback);
    subscribeTopic(`/topic/game/event/${roomCode}`, getEventCallback);

    sendEvent(
      "/game/start",
      {},
      {
        roomCode: roomCode,
      }
    );
  };

  useEffect(() => {
    initSubscribe();
  }, []);

  const testNextTurn = () => {
    turnEnd();
  };

  const testEvent = () => {
    sendEvent(
      "/game/event",
      {},
      {
        roomCode: roomCode,
        userId: nowTurnPlayerId, // recoil 전역변수
      }
    );

    // 서버 통신이 안되서 임시 test용!
    setEventIndex(3);
  };

  return (
    <>
      <GameLayout userList={userList} eventPositionList={eventPositionList} />

      <button onClick={testNextTurn}>다음 차례</button>
      <button onClick={testEvent}>이벤트 받아오기</button>
    </>
  );
};

export default Game;
