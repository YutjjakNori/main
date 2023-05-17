//게임 방법

import RuleLayout from "@/present/layout/rules/RuleLayout";
import { RuleLayoutContentType } from "@/types/rule/RuleLayoutTypes";

const Rule = () => {
  const contens: Array<RuleLayoutContentType> = [
    {
      title: "게임 참여 방법",
      contents: [
        {
          subTitle: "test1",
          imgSrc:
            "https://cdn.pixabay.com/photo/2023/04/23/11/11/flowers-7945521_960_720.jpg",
        },
        {
          subTitle: "test1",
          imgSrc:
            "https://cdn.pixabay.com/photo/2023/05/02/17/33/blue-tit-7965696_960_720.jpg",
        },
      ],
    },
    {
      title: "게임 규칙",
      contents: [
        {
          subTitle: "test2",
          imgSrc:
            "https://cdn.pixabay.com/photo/2023/04/23/11/11/flowers-7945521_960_720.jpg",
        },
        {
          subTitle: "test2",
          imgSrc:
            "https://cdn.pixabay.com/photo/2023/05/02/17/33/blue-tit-7965696_960_720.jpg",
        },
      ],
    },
  ];
  return <RuleLayout layoutContents={contens} />;
};

export default Rule;
