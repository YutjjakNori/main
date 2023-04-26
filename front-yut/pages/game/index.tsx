//게임 화면

import PlayerCompo, {
  PlayerCompoProps,
} from "@/present/component/PlayerCompo/PlayerCompo";
import YutBoardCompo from "@/present/component/YutBoardCompo/YutBoardCompo";
import { YutPieceCompoProps } from "@/present/component/YutPieceCompo/YutPieceCompo";
import { colors } from "@/styles/theme";
import { YutPieceType } from "@/types/game/YutPieceTypes";
import { useEffect, useState } from "react";
import { YutPieceListState } from "@/store/GameStore";
import { useRecoilState } from "recoil";

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
  const [pieceList, setPieceList] = useRecoilState(YutPieceListState);
  const [index, setIndex] = useState(0);

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
    const pieceInitialList = createAllPieceList(list);
    setPieceList(pieceInitialList);
  }, []);

  const testMove = () => {
    setIndex((current) => current + 1);
    const list: Array<YutPieceCompoProps> = pieceList.map((piece, count) => {
      const tmp = { ...piece };
      if (count === 0) {
        tmp.position = index;
      }
      return tmp;
    });
    setPieceList(list);
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
        <button onClick={testMove}>index ++</button>
      </div>
    </div>
  );
};

export default Game;
