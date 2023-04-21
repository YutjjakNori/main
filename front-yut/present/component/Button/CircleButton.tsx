import { CircleButtonProps } from "@/pages/compoTest";
import * as style from "./CircleButton.style";

function CircleButton({
  Icon,
  text,
  backgroundColor,
  borderColor,
}: CircleButtonProps) {
  return (
    <>
      {/* 그림 존재 유무 따라: 이미지 버튼, 텍스트 버튼으로 나뉨 */}
      {Icon ? (
        <style.StyledButton
          backgroundColor={backgroundColor}
          borderColor={borderColor}
        >
          {<Icon />}
        </style.StyledButton>
      ) : (
        <style.StyledButton
          borderColor={borderColor}
          backgroundColor={backgroundColor}
        >
          {text}
        </style.StyledButton>
      )}
    </>
  );
}

export default CircleButton;
