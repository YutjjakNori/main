import {
  NowTurnPlayerIdState,
  YutThrowBtnState,
  YutThrowResultListState,
} from "@/store/GameStore";
import { RoomCodeState } from "@/store/GameStore";
import { UserInfoState } from "@/store/UserStore";
import { ThrowResultType } from "@/types/game/YutThrowTypes";
import { useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { sendEvent } from "../socket-api/socketInstance";
import useGameAction from "./useGameAction";

const useYutThrow = () => {
  const { action, selectPieceStart } = useGameAction();
  const nowTurnPlayerId = useRecoilValue(NowTurnPlayerIdState);
  const myInfo = useRecoilValue(UserInfoState);
  const roomCode = useRecoilValue(RoomCodeState);

  // 윷 던지기 버튼 활성화
  const [canThrowYut, setCanThrowYut] = useRecoilState(YutThrowBtnState);

  // 윷 던지기 결과
  const [resultList, setResultList] = useRecoilState(YutThrowResultListState);
  const [resultType, setResultType] = useState<ThrowResultType>("모");
  // 윷 던지기 누적 개수를 관리하는 count 변수
  // -> 만약 윷을 리스트에 넣고 난뒤의 값이 4라면 서버에 isLast: true 로 알려주기.
  const [count, setCount] = useState(0);
  const isLast = useMemo(() => {
    return count === 3 ? true : false;
  }, [count]);

  // 윷 던지기
  const throwYut = () => {
    console.log("throwYut : ", roomCode);
    const request = {
      roomCode: roomCode,
      userId: myInfo.userId,
      isLast: isLast,
    };
    sendEvent("/game/stick", {}, request);
  };

  // 서버에서 받아온 윷 던지기 결과 저장
  const saveThrowResult = (result: ThrowResultType) => {
    setResultType(result);
    //result를 사용했으면 true로 toggle
    let pushed = false;
    let cnt = 0;

    const newList = resultList.map((item) => {
      if (item !== "") {
        cnt++;
        return item;
      }
      if (pushed) return item;

      pushed = true;
      cnt++;
      return result;
    });
    setCount(cnt);

    setResultList(newList);

    setCanThrowYut("none");

    // 다시 던지기
    if (result === "윷" || result === "모") {
      setTimeout(() => {
        setCanThrowYut("block");
      }, 1000);
      return;
    }
    // 윷 말 선택하기 시작
    selectPieceStart();
  };

  // 사용할 윷 던지기 결과
  const popYutThrowResult = () => {
    const popFirstResultIndex = resultList.findIndex((item) => item !== "");

    if (popFirstResultIndex === -1)
      throw Error("사용할 수 있는 결과가 없습니다");

    const firstResultType = resultList[popFirstResultIndex];

    const newList: Array<ThrowResultType> = [...resultList.slice(1), ""];
    setResultList(newList);
    return firstResultType;
  };

  useEffect(() => {
    // 윷을 안던질때는 display none
    if (action !== "ThrowYut") {
      setCanThrowYut("none");
      return;
    }
    // 윷 던질때는 display block
    if (nowTurnPlayerId === myInfo.userId) {
      setCanThrowYut("block");
    }
  }, [action]);

  return {
    canThrowYut,
    throwYut,
    resultList,
    saveThrowResult,
    resultType,
    popYutThrowResult,
  };
};

export default useYutThrow;
