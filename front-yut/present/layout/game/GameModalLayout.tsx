import useGameAction from "@/actions/hook/useGameAction";
import GameModalCompo from "@/present/component/GameModalCompo/GameModalCompo";
import { GameModalInfoState } from "@/store/GameModalStore";
import {
  NowTurnPlayerIdState,
  PieceCatchInfoState,
  YutThrowResultListState,
} from "@/store/GameStore";
import { UserInfoState } from "@/store/UserStore";
import { MemberListState } from "@/store/MemberStore";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

const GameModalLayout = () => {
  const [modalInfo, setModalInfo] = useRecoilState(GameModalInfoState);
  const nowTurnPlayerId = useRecoilValue(NowTurnPlayerIdState);
  const myInfo = useRecoilValue(UserInfoState);
  const { action } = useGameAction();
  const yutResultList = useRecoilValue(YutThrowResultListState);
  const catchInfo = useRecoilValue(PieceCatchInfoState);
  const playerInfoList = useRecoilValue(MemberListState);

  useEffect(() => {
    switch (action) {
      // 누군가 턴을 시작했을때 내 차례면 modal on
      case "TurnStart":
        const nowTurnPlayer = playerInfoList.find(
          (u) => u.userId === nowTurnPlayerId
        );
        setModalInfo({
          data: {
            nowTurnPlayerNickname: nowTurnPlayer?.nickName ?? nowTurnPlayerId,
            isMyTurn: nowTurnPlayerId === myInfo.userId,
          },
        });
        return;
      // 움직일 윷 말 선택
      case "ChoosePiece":
        if (nowTurnPlayerId === myInfo.userId) {
          setModalInfo({
            data: {
              moveYutResult: yutResultList[0],
            },
          });
        }
        return;
      // 윷 말 잡았을때 한번더
      case "Catch":
        if (nowTurnPlayerId === myInfo.userId) {
          const catuchUserInfo = playerInfoList.find(
            (u) => u.userId === catchInfo.catchedUserId
          );
          setModalInfo({
            data: {
              caughtPlayerNickname: catuchUserInfo?.nickName ?? "",
            },
          });
        }
        return;
      // 게임 종료
      case "End":
        const winner = playerInfoList.find((u) => u.userId === nowTurnPlayerId);
        setModalInfo({
          data: {
            winnerPlayerNickname: winner?.nickName ?? "",
          },
        });
        return;
    }
  }, [action]);

  return (
    <>
      <GameModalCompo data={modalInfo.data} />
    </>
  );
};

export default GameModalLayout;
