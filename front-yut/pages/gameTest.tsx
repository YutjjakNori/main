//게임 화면

import { PlayerCompoProps } from "@/present/component/PlayerCompo/PlayerCompo";
import { colors } from "@/styles/theme";
import { useCallback, useEffect, useState } from "react";
import useGameTurn from "@/actions/hook/useGameTurn";
import usePieceMove from "@/actions/hook/usePieceMove";
import { UserInfoType } from "@/types/game/YutGameTypes";
import GameLayout from "@/present/layout/game/GameLayout";
import { gameSocketObject } from "@/actions/socket-api/gameSocketInstance";
import * as socketUtil from "@/utils/socketUtils";
import { gameTopic } from "@/actions/socket-api/gameSocketInstance";
import { connect } from "@/actions/socket-api/socketInstance";

const Game = () => {
  const { initPlayerTurn, nextTurn } = useGameTurn();
  const { pieceMove, pieceOver, appendPiece, catchPiece } = usePieceMove();
  const [userList, setUserList] = useState<Array<PlayerCompoProps>>([]);

  const gameStart = useCallback((users: Array<any>) => {
    initPlayerTurn(users.map((user) => user.userId));

    const playerList: Array<PlayerCompoProps> = users.map((user, index) => {
      return {
        userId: user.userId,
        playerName: `player${index}`,
        color: colors.gamePlayer[index],
      };
    });
    setUserList([...playerList]);
  }, []);

  const subscribeTopics = useCallback(() => {
    socketUtil.subscribeEvent(gameSocketObject, gameTopic.startGame, gameStart);
  }, []);

  useEffect(() => {
    // connect();
    subscribeTopics();
  }, []);

  useEffect(() => {
    //TODO : 서버에서 사용자 정보를 받아오는걸로 변경
    const list: Array<UserInfoType> = [
      {
        playerName: "player1",
        profileImage: "",
        userId: "1",
      },
      {
        playerName: "player2",
        profileImage: "",
        userId: "2",
      },
    ];
    initPlayerTurn(list.map((user) => user.userId));
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

  return (
    <>
      <GameLayout userList={userList} />

      <button onClick={testMove1}>movePath 1</button>
      <button onClick={testMove2}>movePath 2</button>
      <button onClick={testPieceOver}>pieceOver</button>
      <button onClick={nextTurn}>다음 차례</button>
      <button onClick={testPieceAppend}>말 합치기</button>
      <button onClick={testPieceAppend2}>말 3개 합치기</button>
      <button onClick={testCatchPiece}>말 잡기</button>
    </>
  );
};

export default Game;
