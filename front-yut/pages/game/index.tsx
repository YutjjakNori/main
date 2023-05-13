//게임 화면

import { PlayerCompoProps } from "@/present/component/PlayerCompo/PlayerCompo";
import { colors } from "@/styles/theme";
import { useCallback, useEffect, useState } from "react";
import useGameTurn from "@/actions/hook/useGameTurn";
import usePieceMove from "@/actions/hook/usePieceMove";
import GameLayout from "@/present/layout/game/GameLayout";
import { sendEvent, subscribeTopic } from "@/actions/socket-api/socketInstance";
import { useRecoilValue } from "recoil";
import { RoomCodeState } from "@/store/GameStore";
import {
  GameStartResponseType,
  GameStartUserType,
  GameTurnStartResponseType,
  PieceMoveResponseType,
  YutThrowResponseType,
} from "@/types/game/SocketResponseTypes";
import useGameAction from "@/actions/hook/useGameAction";
import useYutThrow from "@/actions/hook/useYutThrow";
import { UserInfoState } from "@/store/UserStore";

const Game = () => {
  const { initPlayerTurn, nextTurn } = useGameTurn();
  const { turnEnd, movePiece } = useGameAction();
  const { pieceMove, pieceOver, appendPiece, catchPiece } = usePieceMove();
  const { saveThrowResult } = useYutThrow();
  const roomCode = useRecoilValue(RoomCodeState);
  const [userList, setUserList] = useState<Array<PlayerCompoProps>>([]);
  const myInfo = useRecoilValue(UserInfoState);
  const [eventPositionList, setEventPositionList] = useState<Array<number>>([
    -1, -1,
  ]);

  //게임 시작시 사용자 정보 셋팅
  const gameStartCallback = useCallback((response: GameStartResponseType) => {
    const users: Array<GameStartUserType> = response?.users;
    const event = response?.event;
    initPlayerTurn(users.map((user) => user.id));
    const list: Array<PlayerCompoProps> = users.map((user, index) => {
      return {
        playerName: user.id,
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
      // 말 합치기
      case 3:
        if (!event) {
          pieceMove(userId, selectPiece, move, "Append");
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

  const initSubscribe = () => {
    subscribeTopic(`/topic/game/start/${myInfo.userId}`, gameStartCallback);
    subscribeTopic(`/topic/game/turn/${roomCode}`, startTurnCallback);
    subscribeTopic(`/topic/game/stick/${roomCode}`, throwYutCallback);
    subscribeTopic(`/topic/game/piece/${roomCode}`, selectPieceCallback);

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

  const testCatchPiece = () => {
    catchPiece("1", [1]);
  };

  const testNextTurn = () => {
    turnEnd();
  };

  return (
    <>
      <GameLayout userList={userList} eventPositionList={eventPositionList} />

      <button onClick={testNextTurn}>다음 차례</button>
      <button onClick={testCatchPiece}>말 잡기</button>
    </>
  );
};

export default Game;
