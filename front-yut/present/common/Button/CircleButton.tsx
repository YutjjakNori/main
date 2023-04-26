import * as style from "./CircleButton.style";

interface CircleButtonProps {
  Icon?: any;
  text?: string;
  fontSize: string;
  color: string;
  backgroundColor?: string;
  borderColor?: string;
  width?: string;
}

function CircleButton({
  Icon,
  text,
  fontSize,
  color,
  backgroundColor,
  borderColor,
}: CircleButtonProps) {
  return (
    <>
      <style.StyledButton
        fontSize={fontSize}
        color={color}
        backgroundColor={backgroundColor}
        borderColor={borderColor}
      >
        {Icon ? <Icon /> : text ?? ""}
      </style.StyledButton>
    </>
  );
}

export type { CircleButtonProps };
export default CircleButton;
