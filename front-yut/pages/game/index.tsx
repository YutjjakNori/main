//게임 화면

import PlayerCompo, {
  PlayerCompoProps,
} from "@/present/component/PlayerCompo/PlayerCompo";
import YutBoardCompo from "@/present/component/YutBoardCompo/YutBoardCompo";
import { YutPieceCompoProps } from "@/present/component/YutPieceCompo/YutPieceCompo";
import { colors } from "@/styles/theme";
import { YutPieceType } from "@/types/game/YutPieceTypes";
import { useEffect, useState, useCallback } from "react";
import {
  NowTurnPlayerIdState,
  PlayTurnState,
  YutPieceListState,
} from "@/store/GameStore";
import { useRecoilState } from "recoil";

const animationSeconds = 0.5;

//사용자의 초기 말 3개 생성
const createUserPieceList = (
  userId: string,
  pieceType: YutPieceType,
): Array<YutPieceCompoProps> => {
  const list: Array<YutPieceCompoProps> = [];
  for (let i = 1; i <= 3; i++) {
    list.push({
      userId: userId,
      pieceId: i,
      pieceType: pieceType,
      state: "NotStarted",
      appendedCount: 1,
      position: -1,
    });
  }
  return list;
};

//플레이어 전체의 말 리스트 생성
const createAllPieceList = (userList: Array<PlayerCompoProps>) => {
  let pieceTmp: Array<YutPieceCompoProps> = [];

  userList.forEach((user, index) => {
    let type: YutPieceType = "flowerRice";

    if (index == 1) type = "songpyeon";
    else if (index === 2) type = "ssukRice";
    else type = "yakgwa";

    const pieces = createUserPieceList(user.userId, type);
    pieceTmp = pieceTmp.concat(pieces);
  });

  return pieceTmp;
};

interface UserInfoType {
  userId: string;
  playerName: string;
  profileImage: string;
}

const Game = () => {
  const [userList, setUserList] = useState<Array<PlayerCompoProps>>([]);
  const [playTurn, setPlayTurn] = useRecoilState(PlayTurnState);
  const [nowTurn, setNowTurn] = useRecoilState(NowTurnPlayerIdState);
  const [pieceList, setPieceList] = useRecoilState(YutPieceListState);
  //움직여야할 piece의 index
  const [movePieceIndex, setMovePieceIndex] = useState(-1);
  //움직일 경로
  const [movePathList, setMovePathList] = useState<Array<number>>([]);

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

  const pieceMove = useCallback(
    (pieceIndex: number, cornerIndex: number) => {
      const list = pieceList.map((p, idx) => {
        if (pieceIndex !== idx) return p;
        const tmp: YutPieceCompoProps = { ...p };
        if (tmp.state === "NotStarted") {
          tmp.state = "InBoard";
        }
        tmp.position = cornerIndex;
        return tmp;
      });
      setPieceList(list);
    },
    [pieceList],
  );

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

    const playerList: Array<PlayerCompoProps> = list.map((user, index) => {
      return {
        ...user,
        color: colors.gamePlayer[index],
      };
    });
    setUserList([...playerList]);

    const playTurnList = list.map((user) => {
      return user.userId;
    });
    setPlayTurn(playTurnList);

    const pieceInitialList = createAllPieceList(list);
    setPieceList(pieceInitialList);
  }, []);

  //말 동내기
  const pieceOver = useCallback(
    (userId: string, pieceId: number) => {
      const list = pieceList.map((p) => {
        if (p.userId === userId && p.pieceId === pieceId) {
          const tmp: YutPieceCompoProps = { ...p };
          tmp.state = "Done";
          return tmp;
        }
        return p;
      });
      setPieceList(list);
    },
    [pieceList],
  );

  useEffect(() => {
    if (movePieceIndex === -1 || movePathList.length === 0) return;

    let i = 0;
    const timer = setInterval(() => {
      if (i >= movePathList.length) {
        clearInterval(timer);
        return;
      }
      pieceMove(movePieceIndex, movePathList[i++]);
    }, animationSeconds * 1000);
  }, [movePathList, movePieceIndex]);

  //test
  const testMove = () => {
    setMoveInfo("1", 1, [0, 1, 2, 3, 4, 5]);
  };
  const testPieceOver = () => {
    pieceOver("1", 1);
  };

  const myTurn = () => {
    setNowTurn("1");
  };

  return (
    <div>
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          gap: "5vh",
          top: "20px",
          left: "20px",
        }}
      >
        {userList.map((user) => (
          <PlayerCompo key={user.playerName} {...user} />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          paddingTop: "10vh",
          paddingLeft: "30vw",
          zIndex: -1,
        }}
      >
        <YutBoardCompo />
      </div>
      <div style={{ position: "absolute", right: "10%" }}>
        <button onClick={testMove}>movePath</button>
        <button onClick={testPieceOver}>pieceOver</button>
        <button onClick={myTurn}>set my turn</button>
      </div>
    </div>
  );
};

export default Game;
