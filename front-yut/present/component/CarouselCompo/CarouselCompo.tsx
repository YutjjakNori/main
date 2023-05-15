import Image, { StaticImageData } from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as style from "./CarouselCompo.style";

interface CarouselCompoProps {
  contents: Array<string>;
}

const CarouselCompo = ({ contents }: CarouselCompoProps) => {
  const [nowItemIndex, setNowItemIndex] = useState(0);
  const [isHover, setIsHover] = useState(false);
  const [indicatorActiveList, setIndicatorActiveList] = useState<
    Array<boolean>
  >([]);
  const contentSize = useMemo(() => contents.length, [contents]);

  // prev
  const onClickLeft = useCallback(() => {
    setNowItemIndex((current) =>
      current - 1 < 0 ? contentSize - 1 : current - 1
    );
  }, [nowItemIndex]);
  // next
  const onClickRight = useCallback(() => {
    setNowItemIndex((current) => (current + 1) % contentSize);
  }, [nowItemIndex]);

  useEffect(() => {
    const newArr = Array(contentSize).fill(false);
    newArr[nowItemIndex] = true;
    setIndicatorActiveList(newArr);
  }, [nowItemIndex]);

  useEffect(() => {
    //새로운 컨텐츠가 들어오면 index reset
    setNowItemIndex(0);
  }, [contents]);

  return (
    <>
      <style.Container
        onMouseOver={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {/* contents */}
        <style.StyledImgBox>
          <Image
            src={contents[nowItemIndex]}
            alt={""}
            width={500}
            height={500}
          />
        </style.StyledImgBox>
        {/* hover box */}
        <style.HoverContainer isHover={isHover}>
          <style.SideBox onClick={onClickLeft}>
            <style.Button>{"<"}</style.Button>
          </style.SideBox>
          <style.SideBox onClick={onClickRight}>
            <style.Button>{">"}</style.Button>
          </style.SideBox>
        </style.HoverContainer>
      </style.Container>
      {/* indicator */}
      <style.IndicatorBox>
        {indicatorActiveList.map((value, index) => (
          <style.Indicator
            key={`${index}-value`}
            active={value}
          ></style.Indicator>
        ))}
      </style.IndicatorBox>
    </>
  );
};

export type { CarouselCompoProps };
export default CarouselCompo;
