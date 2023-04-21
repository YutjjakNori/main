import CornerPoint from "./CornerPoint";
import * as style from "./YutBoardCompo.style";

const YutBoardCompo = () => {
  return (
    <>
      <style.Container>
        <CornerPoint type={"blue"} point="leftTop" />
        <CornerPoint type={"blue"} point="leftBottom" />
        <CornerPoint type={"blue"} point="rightTop" />
        <CornerPoint type={"blue"} point="rightBottom" />
        <CornerPoint type={"pink"} point="center" />
        <style.MiniList className="miniTop">
          <style.MiniPoint />
          <style.MiniPoint />
          <style.MiniPoint />
          <style.MiniPoint />
        </style.MiniList>
        <style.MiniList className="miniLeft">
          <style.MiniPoint />
          <style.MiniPoint />
          <style.MiniPoint />
          <style.MiniPoint />
        </style.MiniList>
        <style.MiniList className="miniBottom">
          <style.MiniPoint />
          <style.MiniPoint />
          <style.MiniPoint />
          <style.MiniPoint />
        </style.MiniList>
        <style.MiniList className="miniRight">
          <style.MiniPoint />
          <style.MiniPoint />
          <style.MiniPoint />
          <style.MiniPoint />
        </style.MiniList>
        {/* leftTop -> rightBottom */}
        <style.MiniLeftCross1 />
        <style.MiniLeftCross2 />
        <style.MiniLeftCross3 />
        <style.MiniLeftCross4 />
        {/* rightTop -> leftBottom */}
        <style.MiniRightCross1 />
        <style.MiniRightCross2 />
        <style.MiniRightCross3 />
        <style.MiniRightCross4 />
      </style.Container>
    </>
  );
};

export default YutBoardCompo;
