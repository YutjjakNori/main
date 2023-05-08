import CarouselCompo from "@/present/component/CarouselCompo/CarouselCompo";
import { RuleLayoutContentType } from "@/types/rule/RuleLayoutTypes";
import { useState } from "react";
import * as style from "./RuleLayout.style";

interface RuleLayoutProps {
  layoutContents: Array<RuleLayoutContentType>;
}

const RuleLayout = ({ layoutContents }: RuleLayoutProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <>
      <style.Container>
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
          <CarouselCompo contents={layoutContents[selectedIndex].contents} />
        </style.CarouselContainer>
      </style.Container>
    </>
  );
};

export type { RuleLayoutProps };
export default RuleLayout;
