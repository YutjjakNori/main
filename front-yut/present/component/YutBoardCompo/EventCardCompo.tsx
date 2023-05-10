import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import usePieceMove from "@/actions/hook/usePieceMove";
import {
  YutThrowBtnState,
  YutPieceListState,
  NowTurnPlayerIdState,
  SelectedPieceIndex,
  EventIndex,
} from "@/store/GameStore";

import Option0 from "@/public/icon/eventItems/0.svg";
import Option1 from "@/public/icon/eventItems/1.svg";
import Option2 from "@/public/icon/eventItems/2.svg";
import Option3 from "@/public/icon/eventItems/3.svg";
import Option4 from "@/public/icon/eventItems/4.svg";

const EventCard = () => {
  const getEventByIndex = useCallback((index: number) => {
    switch (index) {
      case 0:
        return <Option0 width={"100%"} height={"100%"} />;
      case 1:
        return <Option1 width={"100%"} height={"100%"} />;
      case 2:
        return <Option2 width={"100%"} height={"100%"} />;
      case 3:
        return <Option3 width={"100%"} height={"100%"} />;
      case 4:
        return <Option4 width={"100%"} height={"100%"} />;
    }
  }, []);

  const [btnDisplay, setBtnDisplay] = useRecoilState(YutThrowBtnState);
  const [pieceList] = useRecoilState(YutPieceListState);
  const curUserId = useRecoilValue(NowTurnPlayerIdState);
  const [eventIndex, setEventIndex] = useRecoilState(EventIndex);
  // const [eventIndex, setEventIndex] = useState(-1);
  const { appendPiece } = usePieceMove();

  //선택된 piece의 index
  const [movePieceIndex, setMovePieceIndex] =
    useRecoilState(SelectedPieceIndex);

  function hideEventCard() {
    setTimeout(() => setEventIndex(-1), 2000);
  }

  // 이벤트) 말 업고 가기
  // 1. 시작 안한 말이 있는지 확인.
  // 1-1. 없다면(-1) 꽝으로 치환
  // 1-2. 있다면(>0) 첫 말번호 알아내기.
  //
  function appendEvent() {
    const pieceIdx = pieceList.findIndex((piece) => {
      return piece.userId === curUserId && piece.state === "NotStarted";
    });
    // 시작안한 말이 없다면 꽝으로 치환.
    if (pieceIdx === -1) {
      setTimeout(() => {
        setEventIndex(0);
      }, 2000);
    } else {
      const list = [pieceIdx, movePieceIndex];
      setEventIndex(2);
      setTimeout(() => {
        appendPiece(curUserId, list);
      }, 2000);
    }
  }

  useEffect(() => {
    {
      takeAction(eventIndex);
    }
  }, [eventIndex]);

  const takeAction = (index: number) => {
    try {
      switch (index) {
        case 0:
          setEventIndex(0);
          break;
        case 1:
          setEventIndex(1);
          setBtnDisplay("block");
          break;
        case 2:
          setEventIndex(2);
          appendEvent();
          break;
        case 3:
          setEventIndex(3);
          break;
        case 4:
          setEventIndex(4);
          break;
      }
    } catch (err) {
      throw err;
    } finally {
      hideEventCard();
    }
  };

  return <>{getEventByIndex(eventIndex)}</>;
};

export default EventCard;
