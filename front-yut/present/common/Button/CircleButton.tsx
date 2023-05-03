import * as style from "@/common/Button/CircleButton.style";

interface CircleButtonProps {
  Icon?: any;
  text?: string;
  fontSize: string;
  color: string;
  backgroundColor?: string;
  borderColor?: string;
  width?: string;
  margin: string;
}

function CircleButton({
  Icon,
  text,
  fontSize,
  color,
  backgroundColor,
  borderColor,
  margin,
}: CircleButtonProps) {
  return (
    <>
      <style.StyledButton
        fontSize={fontSize}
        color={color}
        backgroundColor={backgroundColor}
        borderColor={borderColor}
        margin={margin}
      >
        {Icon ? <Icon /> : text ?? ""}
      </style.StyledButton>
    </>
  );
}

export type { CircleButtonProps };
export default CircleButton;
