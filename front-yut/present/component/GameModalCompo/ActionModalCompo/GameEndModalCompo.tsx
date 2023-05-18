import { stompClient } from "@/actions/socket-api/socketInstance";
import RectButton from "@/present/common/Button/Rect/RectButton";
import { colors } from "@/styles/theme";
import { GameEndModalInfo } from "@/types/game/GameModalTypes";
import { useRouter } from "next/router";
import { useCallback } from "react";
import * as style from "./ActionModalCompo.style";

const GameEndModalCompo = ({ winnerPlayerNickname }: GameEndModalInfo) => {
  const router = useRouter();

  const exit = useCallback(() => {
    stompClient?.disconnect();
    router.replace("/lobby");
  }, []);

  return (
    <style.Text>
      <span>{winnerPlayerNickname}</span>&nbsp; 님의 승리입니다!
      <br />
      <style.ButtonWrapper onClick={exit}>
        <RectButton
          text={"게임 종료"}
          fontSize={"1rem"}
          backgroundColor={colors.exit}
        />
      </style.ButtonWrapper>
    </style.Text>
  );
};

export default GameEndModalCompo;
