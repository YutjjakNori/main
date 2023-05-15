import CarouselCompo from "@/present/component/CarouselCompo/CarouselCompo";
import { RuleLayoutContentType } from "@/types/rule/RuleLayoutTypes";
import { useState } from "react";
import { useRouter } from "next/router";

import * as style from "./RuleLayout.style";
import styled from "styled-components";

import BackBtn from "@/public/icon/backBtn.svg";
import Frame from "@/public/icon/ruleItems/frame.svg";

interface RuleLayoutProps {
  layoutContents: Array<RuleLayoutContentType>;
}

const RuleLayout = ({ layoutContents }: RuleLayoutProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <style.Container>
        <StyledBtn onClick={handleGoBack}>
          <BackBtn width={"15%"} height={"15%"} />
        </StyledBtn>
        <style.Header>
          {layoutContents.map((c, index) => (
            <style.HeaderItem
              key={c.title}
              active={index === selectedIndex}
              isLastIndex={index === layoutContents.length - 1}
              onClick={() => setSelectedIndex(index)}
            >
              {c.title}
            </style.HeaderItem>
          ))}
        </style.Header>

        <style.CarouselContainer>
          {/* <Frame /> */}
          <CarouselCompo contents={layoutContents[selectedIndex].contents} />
        </style.CarouselContainer>
      </style.Container>
    </>
  );
};

const StyledBtn = styled.div`
  left: 4%;
  top: 3%;
  position: fixed;
`;

export type { RuleLayoutProps };
export default RuleLayout;
