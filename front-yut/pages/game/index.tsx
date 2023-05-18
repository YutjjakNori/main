//게임 화면

import { PlayerCompoProps } from "@/present/component/PlayerCompo/PlayerCompo";
import { colors } from "@/styles/theme";
import { useCallback, useEffect, useState } from "react";
import useGameTurn from "@/actions/hook/useGameTurn";
import usePieceMove from "@/actions/hook/usePieceMove";
import GameLayout from "@/present/layout/game/GameLayout";
import { sendEvent, subscribeTopic } from "@/actions/socket-api/socketInstance";
import { useRecoilValue, useSetRecoilState } from "recoil";
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
import { MemberReadyListState } from "@/store/MemberStore";
import GameModalLayout from "@/present/layout/game/GameModalLayout";
import { messageLogState } from "@/store/ChatStore";
import { makeMessage } from "@/utils/chatModule";
import audioModule from "@/utils/audioModule";

const Game = () => {
  const { initPlayerTurn, nextTurn } = useGameTurn();
  const { turnEnd, movePiece, gameEnd } = useGameAction();
  const { pieceMove, saveCatchInfo } = usePieceMove();
  const { saveThrowResult } = useYutThrow();
  const roomCode = useRecoilValue(RoomCodeState);
  const [userList, setUserList] = useState<Array<PlayerCompoProps>>([]);
  const myInfo = useRecoilValue(UserInfoState);
  const [eventPositionList, setEventPositionList] = useState<Array<number>>([
    -1, -1,
  ]);
  const playerNicknameList = useRecoilValue(MemberReadyListState);
  const setMessageLog = useSetRecoilState(messageLogState);

  const addMessageLog = useCallback(
    (userId: string, text: string) => {
      const playerInfo = playerNicknameList.find((u) => u.userId === userId);
      const message = makeMessage("SYSTEM", `${playerInfo?.nickName}${text}`);
      setMessageLog((current) => [...current, message]);
    },
    [messageLogState]
  );

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
    const { userId } = response;
    addMessageLog(userId, "님의 차례입니다");
    nextTurn(response.userId);
  };

  // 윷 던지기
  const throwYutCallback = (response: YutThrowResponseType) => {
    const { userId, result } = response;
    addMessageLog(userId, `님이 ${result} 를 던졌습니다`);
    saveThrowResult(result);
    const filePath = "/audio/yutThrow.mp3";
    const volume = 1;
    audioModule(filePath, volume);
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
        const { caughtUserId, caughtPiece } = response.data;
        if (!caughtUserId || !caughtPiece) {
          throw Error("잡을 사용자의 정보가 없습니다");
        }
        const caughtUser = playerNicknameList.find(
          (u) => u.userId === caughtUserId
        );
        addMessageLog(
          userId,
          `님이 ${caughtUser?.nickName}님의 말을 잡았습니다.`
        );
        saveCatchInfo(caughtUserId, caughtPiece);
        pieceMove(userId, selectPiece, move, "Catch");
        return;
      // 말 합치기
      case 3:
        pieceMove(userId, selectPiece, move, "Append");
        return;
      // 말 동나기
      case 4:
        const { end } = response.data;
        // 게임 종료
        if (end) {
          addMessageLog(userId, `님이 승리입니다.`);
          pieceMove(userId, selectPiece, move, "End");
          return;
        }
        addMessageLog(userId, `님의 말이 동났습니다.`);
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

  return (
    <>
      <GameLayout userList={userList} eventPositionList={eventPositionList} />
      <GameModalLayout />
    </>
  );
};

export default Game;
