import GameProfile from "@/present/common/GameProfile/GameProfile";
import { YutPieceListState } from "@/store/GameStore";
import { StaticImageData } from "next/image";
import YutPieceCompo, {
  YutPieceCompoProps,
} from "../YutPieceCompo/YutPieceCompo";
import * as style from "./PlayerCompo.style";
import { useRecoilValue } from "recoil";
import { useState, useEffect } from "react";

interface PlayerCompoProps {
  profileImage?: string | StaticImageData;
  playerName: string;
  color?: string;
  timerSeconds?: number;
  userId: string;
}

const PlayerCompo = ({
  userId,
  profileImage,
  playerName,
  color,
  timerSeconds,
}: PlayerCompoProps) => {
  const pieceList = useRecoilValue(YutPieceListState);
  const [notStartedPieceList, setNotStartedPieceList] = useState<
    Array<YutPieceCompoProps>
  >([]);

  useEffect(() => {
    const list = pieceList.filter(
      (piece) => piece.userId === userId && piece.state === "NotStarted",
    );
    setNotStartedPieceList(list);
  }, [pieceList]);
  return (
    <>
      <style.Container>
        <GameProfile
          playerName={playerName}
          profileImage={profileImage}
          color={color}
          timerSeconds={timerSeconds}
        />
        <style.PieceWrapper>
          {notStartedPieceList?.map((piece, index) => {
            return <YutPieceCompo key={index} {...piece} />;
          })}
        </style.PieceWrapper>
      </style.Container>
    </>
  );
};

export type { PlayerCompoProps };
export default PlayerCompo;
