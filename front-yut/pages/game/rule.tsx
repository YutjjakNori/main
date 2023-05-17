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

// 게임 룰
import winRuleImage from "@/public/image/rule/winRule.png";
import throwYutImage1 from "@/public/image/rule/throwYut1.png";
import throwYutImage2 from "@/public/image/rule/throwYut2.png";
import choosePieceImage1 from "@/public/image/rule/choosePiece1.png";
import choosePieceImage2 from "@/public/image/rule/choosePiece2.png";
import choosePieceImage3 from "@/public/image/rule/choosePiece3.png";
import appendPieceImage from "@/public/image/rule/appendPiece.png";
import catchPieceImage from "@/public/image/rule/catchPiece.png";
import eventCardImage from "@/public/image/rule/eventCard.png";

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
          subTitle: "승리 조건",
          imgSrc: winRuleImage.src,
        },
        {
          subTitle: "윷 던지기",
          imgSrc: throwYutImage1.src,
        },
        {
          subTitle: "윷 던지기",
          imgSrc: throwYutImage2.src,
        },
        {
          subTitle: "윷 말 선택하기",
          imgSrc: choosePieceImage1.src,
        },
        {
          subTitle: "윷 말 선택하기",
          imgSrc: choosePieceImage2.src,
        },
        {
          subTitle: "윷 말 선택하기",
          imgSrc: choosePieceImage3.src,
        },
        {
          subTitle: "윷 말 업기",
          imgSrc: appendPieceImage.src,
        },
        {
          subTitle: "윷 말 잡기",
          imgSrc: catchPieceImage.src,
        },
        {
          subTitle: "이벤트 카드",
          imgSrc: eventCardImage.src,
        },
      ],
    },
  ];
  return <RuleLayout layoutContents={contens} />;
};

export default Rule;
