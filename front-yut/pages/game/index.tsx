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
  YutThrowResponseType,
} from "@/types/game/SocketResponseTypes";
import useGameAction from "@/actions/hook/useGameAction";
import useYutThrow from "@/actions/hook/useYutThrow";

const Game = () => {
  const { initPlayerTurn, nextTurn } = useGameTurn();
  const { turnEnd } = useGameAction();
  const { pieceMove, pieceOver, appendPiece, catchPiece } = usePieceMove();
  const { saveThrowResult } = useYutThrow();
  const roomCode = useRecoilValue(RoomCodeState);
  const [userList, setUserList] = useState<Array<PlayerCompoProps>>([]);

  //게임 시작시 사용자 정보 셋팅
  const gameStartCallback = useCallback((response: GameStartResponseType) => {
    const users: Array<GameStartUserType> = response?.users;
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

  const selectPieceCallback = (response: any) => {
    // TODO : 말 움직이기 로직 연결
  };

  const initSubscribe = () => {
    subscribeTopic(`/topic/game/start/${roomCode}`, gameStartCallback);
    subscribeTopic(`/topic/game/turn/${roomCode}`, startTurnCallback);
    subscribeTopic(`/topic/game/stick/${roomCode}`, throwYutCallback);
    subscribeTopic(`/topic/game/piece/${roomCode}`, selectPieceCallback);

    sendEvent(
      "/game/start",
      {},
      {
        roomCode: roomCode,
      },
    );
  };

  useEffect(() => {
    initSubscribe();
  }, []);

  const testMove1 = () => {
    pieceMove("1", 1, [0, 1, 2, 3, 4]);
  };
  const testMove2 = () => {
    pieceMove("1", 2, [0, 1, 2, 3, 4]);
  };
  const testPieceOver = () => {
    pieceOver("1", 1);
  };
  const testPieceAppend = () => {
    appendPiece("1", [1, 2]);
  };
  const testPieceAppend2 = () => {
    const appendList = [1, 2, 3];

    appendPiece("1", appendList);
  };
  const testCatchPiece = () => {
    catchPiece("1", [1]);
  };

  const testNextTurn = () => {
    turnEnd();
  };

  return (
    <>
      <GameLayout userList={userList} />

      <button onClick={testMove1}>movePath 1</button>
      <button onClick={testMove2}>movePath 2</button>
      <button onClick={testPieceOver}>pieceOver</button>
      <button onClick={testNextTurn}>다음 차례</button>
      <button onClick={testPieceAppend}>말 합치기</button>
      <button onClick={testPieceAppend2}>말 3개 합치기</button>
      <button onClick={testCatchPiece}>말 잡기</button>
    </>
  );
};

export default Game;
