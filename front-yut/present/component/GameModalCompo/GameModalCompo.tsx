import {
  CatchPieceModalInfo,
  ChoosePieceModalInfo,
  TurnStartModalInfo,
  NoneModalInfo,
  ThrowYutAgainModalInfo,
  ThrowYutModalInfo,
} from "@/types/game/GameModalTypes";
import { GameActionType } from "@/types/game/YutGameTypes";
import { useEffect, useMemo, useState } from "react";
import TurnStartModalCompo from "./ActionModalCompo/TurnStartModalCompo";
import * as style from "./GameModalCompo.style";

// modal에 따른 타입이 data에 바인딩됨
interface GameModalCompoProps {
  data:
    | TurnStartModalInfo
    | ThrowYutModalInfo
    | ThrowYutAgainModalInfo
    | ChoosePieceModalInfo
    | CatchPieceModalInfo
    | null;
}

const GameModalCompo = ({ data }: GameModalCompoProps) => {
  const [modalType, setModalType] = useState<GameActionType>("None");

  const modalVisible: boolean = useMemo(() => {
    return modalType !== "None";
  }, [modalType]);

  const getModalCompo = () => {
    switch (modalType) {
      case "TurnStart":
        const { nowTurnPlayerNickname } = data as TurnStartModalInfo;
        return (
          <TurnStartModalCompo
            nowTurnPlayerNickname={nowTurnPlayerNickname ?? ""}
          />
        );

      default:
        return;
    }
  };

  useEffect(() => {
    // 모달이 켜진 경우에는 자동으로 1.5초뒤에 꺼짐
    if (modalType !== "None") {
      setTimeout(() => {
        setModalType("None");
      }, 1500);
    }
  }, [modalType]);

  // 데이터의 타입에 따라 modal의 타입을 변경함
  useEffect(() => {
    if (!data) return;
    if (isNoneModalInfo(data)) {
      setModalType("None");
    }
    if (isTurnStartModalInfo(data)) {
      setModalType("TurnStart");
    }
  }, [data]);

  return (
    <>
      <style.Container visible={modalVisible}>
        <style.TextBox>{getModalCompo() ?? null}</style.TextBox>
      </style.Container>
    </>
  );
};

// type guard, data가 무슨 타입인지 체크
const isNoneModalInfo = (data: any): data is NoneModalInfo => {
  return data === "NoneModalInfo";
};

const isTurnStartModalInfo = (data: any): data is TurnStartModalInfo => {
  return data.nowTurnPlayerNickname;
};

const isThrowYutModalInfo = (data: any): data is ThrowYutModalInfo => {
  return data === "ThrowYutModalInfo";
};

const isThrowYutAgainModalInfo = (
  data: any
): data is ThrowYutAgainModalInfo => {
  return data === "ThrowYutAgainModalInfo";
};

const isChoosePieceModalInfo = (data: any): data is ChoosePieceModalInfo => {
  return data === "ChoosePieceModalInfo";
};

const isCatchPieceModalInfo = (data: any): data is CatchPieceModalInfo => {
  return data === "CatchPieceModalInfo";
};

export default GameModalCompo;
export type { GameModalCompoProps };
