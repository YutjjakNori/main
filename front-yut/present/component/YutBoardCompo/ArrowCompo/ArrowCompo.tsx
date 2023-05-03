import { ArrowWrapper } from "../YutBoardCompo.style";
import ArrowSvg from "@/public/icon/CornerArrow.svg";
import { useEffect, useMemo, useState } from "react";
import * as gameUtil from "@/utils/gameUtils";
import { ActiveCornerArrowState } from "@/store/GameStore";
import { useRecoilValue, useSetRecoilState } from "recoil";
import usePieceMove from "@/actions/hook/usePieceMove";

interface ArrowCompoProps {
  classStr: string;
  position: number;
}

const ArrowIconCompo = ({ classStr, position }: ArrowCompoProps) => {
  const [active, setActive] = useState<boolean>(false);
  const cornerType = useMemo(
    () => gameUtil.cornerIndexToType(position),
    [position],
  );

  const { clearActiveCornerArrow } = usePieceMove();

  const arrowType = useMemo((): number => {
    switch (classStr) {
      case "cornerLeftTop1":
        return 3;
      case "cornerLeftTop2":
        return 4;
      case "cornerRightTop1":
        return 1;
      case "cornerRightTop2":
        return 2;
      case "cornerCenter1":
        return 2;
      default:
        return 4;
    }
  }, [position]);

  const activeArrowType = useRecoilValue(ActiveCornerArrowState);

  useEffect(() => {
    if (cornerType === activeArrowType) {
      setActive(true);
      return;
    }
    setActive(false);
  }, [activeArrowType]);

  const onClick = () => {
    //TODO : 분기점 선택
    clearActiveCornerArrow();
  };
  return (
    <ArrowWrapper active={active} className={classStr} onClick={onClick}>
      <ArrowSvg />
    </ArrowWrapper>
  );
};

export default ArrowIconCompo;
