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
        setModalInfo({
          data: {
            nowTurnPlayerNickname: myInfo.nickName,
            isMyTurn: nowTurnPlayerId === myInfo.userId,
          },
        });
        return;
      case "ChoosePiece":
        if (nowTurnPlayerId === myInfo.userId) {
          setModalInfo({
            data: {
              moveYutResult: yutResultList[0],
            },
          });
        }
        return;
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
    }
  }, [action]);

  return (
    <>
      <GameModalCompo data={modalInfo.data} />
    </>
  );
};

export default GameModalLayout;
