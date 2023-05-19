import {
  NowTurnPlayerIdState,
  YutThrowBtnState,
  YutThrowResultListState,
} from "@/store/GameStore";
import { RoomCodeState } from "@/store/GameStore";
import { UserInfoState } from "@/store/UserStore";
import { ThrowResultType } from "@/types/game/YutThrowTypes";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";
import { sendEvent } from "../socket-api/socketInstance";
import useGameAction from "./useGameAction";

const useYutThrow = () => {
  const { action, selectPieceStart } = useGameAction();
  const nowTurnPlayerId = useRecoilValue(NowTurnPlayerIdState);
  const myInfo = useRecoilValue(UserInfoState);
  const roomCode = useRecoilValue(RoomCodeState);

  // 윷 던지기 버튼 활성화
  const [canThrowYut, setCanThrowYut] = useRecoilState(YutThrowBtnState);
  const canIThrow = useMemo(() => {
    // 윷 던질 차례때 내 차례일때만 활성화
    if (myInfo.userId === nowTurnPlayerId && canThrowYut === "block")
      return true;
    return false;
  }, [nowTurnPlayerId, myInfo, canThrowYut]);

  // 윷 던지기 결과
  const [resultList, setResultList] = useRecoilState(YutThrowResultListState);

  //사용할 결과가 없는지
  const isResultEmpty = useMemo(() => {
    const filteredNotNoneList = resultList.filter((result) => result !== "");
    return filteredNotNoneList.length === 0;
  }, [resultList]);

  const resultType = useMemo(() => {
    const filterResultList = resultList.filter((item) => item !== "");

    if (filterResultList.length === 0) return "모";

    const size = filterResultList.length;
    return filterResultList[size - 1];
  }, [resultList]);
  // 윷 던지기 누적 개수를 관리하는 count 변수
  // -> 만약 윷을 리스트에 넣고 난뒤의 값이 4라면 서버에 isLast: true 로 알려주기.
  const [count, setCount] = useState(0);
  const isLast = useMemo(() => {
    return count === 3 ? true : false;
  }, [count]);

  // 윷 던지기
  const throwYut = () => {
    const request = {
      roomCode: roomCode,
      userId: myInfo.userId,
      isLast: isLast,
    };
    sendEvent("/game/stick", {}, request);
  };

  // 서버에서 받아온 윷 던지기 결과 저장
  const saveThrowResult = (result: ThrowResultType) => {
    //result를 사용했으면 true로 toggle
    let pushed = false;
    let cnt = 0;

    setCount(cnt);

    setResultList((current) =>
      current.map((item) => {
        if (item !== "") {
          cnt++;
          return item;
        }
        if (pushed) return item;
        pushed = true;
        cnt++;
        return result;
      })
    );

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
  const getYutThrowResultForUse = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const resultList = await snapshot.getPromise(YutThrowResultListState);
        const popFirstResultIndex = resultList.findIndex((item) => item !== "");

        if (popFirstResultIndex === -1)
          throw Error("사용할 수 있는 결과가 없습니다");

        const firstResultType = resultList[popFirstResultIndex];
        return firstResultType;
      },
    []
  );

  const popYutThrowResultForUse = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const resultList = await snapshot.getPromise(YutThrowResultListState);
        const firstResultType = await getYutThrowResultForUse();

        const newList: Array<ThrowResultType> = [...resultList.slice(1), ""];
        setResultList(newList);
        return firstResultType;
      },
    []
  );

  const resetThrowResultList = useCallback(() => {
    setResultList(["", "", "", "", ""]);
  }, []);

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
    canIThrow,
    throwYut,
    resultList,
    saveThrowResult,
    resultType,
    getYutThrowResultForUse,
    popYutThrowResultForUse,
    resetThrowResultList,
    isResultEmpty,
  };
};

export default useYutThrow;
