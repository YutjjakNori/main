import { CornerType } from "@/types/game/YutGameTypes";

const cornerIndex = {
  leftTop: 10,
  rightTop: 5,
  centerLeft: 27,
  centerRight: 22,
};

//현재 인덱스가 코너인지
const isCorner = (index: number): boolean => {
  const cornerIndexList = Object.values(cornerIndex);
  const findIndex = cornerIndexList.findIndex((idx) => idx === index);

  return findIndex === -1 ? false : true;
};

const cornerIndexToType = (index: number): CornerType => {
  if (!isCorner(index)) return "none";

  // Object.keys(cornerIndex).filter((key) => cornerIndex[key] === index);
  if (index === cornerIndex["leftTop"]) return "leftTop";
  if (index === cornerIndex["rightTop"]) return "rightTop";
  if (index === cornerIndex["centerRight"]) return "centerRight";
  return "centerLeft";
};

export { cornerIndex, isCorner, cornerIndexToType };
