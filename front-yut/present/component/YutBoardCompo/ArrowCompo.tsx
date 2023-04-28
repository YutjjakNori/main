import { ArrowWrapper } from "./YutBoardCompo.style";
import ArrowSvg from "@/public/icon/CornerArrow.svg";

interface ArrowCompoProps {
  active: boolean;
  classStr: string;
}

const ArrowIconCompo = ({ active, classStr }: ArrowCompoProps) => {
  return (
    <ArrowWrapper active={active} className={classStr}>
      <ArrowSvg />
    </ArrowWrapper>
  );
};

export default ArrowIconCompo;
