//게임 방법

import RuleLayout from "@/present/layout/rules/RuleLayout";
import { RuleLayoutContentType } from "@/types/rule/RuleLayoutTypes";

// 게임 참여 방법
import makeRoomImage1 from "@/public/image/rule/makeRoom1.png";
import makeRoomImage2 from "@/public/image/rule/makeRoom2.png";
import copyRoomCodeImage from "@/public/image/rule/copyRoomCode.png";
import joinRoomImage1 from "@/public/image/rule/joinRoom1.png";
import joinRoomImage2 from "@/public/image/rule/joinRoom2.png";
import readyImage1 from "@/public/image/rule/ready1.png";
import readyImage2 from "@/public/image/rule/ready2.png";
import readyImage3 from "@/public/image/rule/ready3.png";

const Rule = () => {
  const contens: Array<RuleLayoutContentType> = [
    {
      title: "게임 참여 방법",
      contents: [
        {
          subTitle: "방 만들기",
          imgSrc: makeRoomImage1.src,
        },
        {
          subTitle: "방 만들기",
          imgSrc: makeRoomImage2.src,
        },
        {
          subTitle: "방 코드 복사",
          imgSrc: copyRoomCodeImage.src,
        },
        {
          subTitle: "방 참여 하기",
          imgSrc: joinRoomImage1.src,
        },
        {
          subTitle: "방 참여 하기",
          imgSrc: joinRoomImage2.src,
        },
        {
          subTitle: "게임 시작하기",
          imgSrc: readyImage1.src,
        },
        {
          subTitle: "게임 시작하기",
          imgSrc: readyImage2.src,
        },
        {
          subTitle: "게임 시작하기",
          imgSrc: readyImage3.src,
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
