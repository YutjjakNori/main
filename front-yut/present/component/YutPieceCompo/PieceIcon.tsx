import { YutPieceType } from "@/types/game/YutPieceTypes";
import YakgwaIcon from "@/public/icon/yakgwa.svg";
import SongpyeonIcon from "@/public/icon/Songpyeon.svg";

// TODO : 각 icon 추가되면 수정하기
const PieceIcon = (type: YutPieceType): any => {
  switch (type) {
    case "yakgwa":
      return <YakgwaIcon />;
    case "flowerRice":
      return <YakgwaIcon />;
    case "songpyeon":
      return <SongpyeonIcon />;
    case "ssukRice":
      return <YakgwaIcon />;
  }
};

export default PieceIcon;
