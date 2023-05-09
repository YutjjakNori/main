import { YutPieceType } from "@/types/game/YutPieceTypes";
import YakgwaIcon from "@/public/icon/yakgwa.svg";
import FlowerRiceIcon from "@/public/icon/flowerrice.svg";
import SongpyeonIcon from "@/public/icon/songpyeon.svg";
import SsukRiceIcon from "@/public/icon/ssukrice.svg";

const PieceIcon = (type: YutPieceType): any => {
  switch (type) {
    case "yakgwa":
      return <YakgwaIcon />;
    case "flowerRice":
      return <FlowerRiceIcon />;
    case "songpyeon":
      return <SongpyeonIcon />;
    case "ssukRice":
      return <SsukRiceIcon />;
  }
};

export default PieceIcon;
