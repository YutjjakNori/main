import { ArrowWrapper } from "./YutBoardCompo.style";
import ArrowSvg from "@/public/icon/CornerArrow.svg";
import { useEffect, useMemo, useState } from "react";
import * as gameUtil from "@/utils/gameUtils";
import { ActiveCornerArrowState } from "@/store/GameStore";
import { useRecoilValue } from "recoil";

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

  const activeArrowType = useRecoilValue(ActiveCornerArrowState);

  useEffect(() => {
    if (cornerType === activeArrowType) {
      setActive(true);
    }
  }, [activeArrowType]);
  return (
    <ArrowWrapper active={active} className={classStr}>
      <ArrowSvg />
    </ArrowWrapper>
  );
};

export default ArrowIconCompo;
