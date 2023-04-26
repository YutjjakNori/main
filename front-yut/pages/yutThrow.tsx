import { useState } from "react";
import styled from "styled-components";
import CircleButton from "@/present/common/Button/CircleButton";
import { CircleButtonProps } from "@/present/common/Button/CircleButton";

import Svg from "@/public/icon/do.svg";
import { StyledThrow } from "./YutImage.style";
import { YutImageProps } from "./StyledThrow";

const YutThrow = () => {
  const [name, setName] = useState("aaa");
  const [resList, setResList] = useState<Array<string>>([
    "윷",
    "모",
    "윷",
    "도",
  ]);

  const yutResultInfo: CircleButtonProps = {
    text: "윷",
    fontSize: "",
    color: "black",
    backgroundColor: "#D9D9D9",
    borderColor: "transparent",
  };

  const yutImageInfo: YutImageProps = {
    Icon: Svg,
    width: "100px",
    height: "50px",
  };

  return (
    <StyledContainer>
      <StyledName>{name}님의 차례</StyledName>
      <StyledContainer2>
        <StyledResult>
          {resList.map((data, index) => {
            return (
              <CircleButton
                text={data}
                fontSize={yutResultInfo.fontSize}
                color={yutResultInfo.color}
                backgroundColor={yutResultInfo.backgroundColor}
                borderColor={yutResultInfo.borderColor}
              />
            );
          })}
        </StyledResult>
        <StyledThrow
          Icon={yutImageInfo.Icon}
          width={yutImageInfo.width}
          height={yutImageInfo.height}
        />
        {/* <Svg></Svg> */}
      </StyledContainer2>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  text-align: center;
  background-color: #f0f6ff;
`;

const StyledName = styled.h2`
  /* font-family: */
  margin-bottom: 1%;
`;

const StyledContainer2 = styled.div`
  width: 50%;
  margin: auto;
`;

const StyledResult = styled.div`
  font-weight: bold;
  width: 60px;
  font-size: 30px;
  color: red;
  margin: auto;
  display: flex;
  justify-content: space-evenly;
`;

// const StyledThrow = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;

export default YutThrow;
