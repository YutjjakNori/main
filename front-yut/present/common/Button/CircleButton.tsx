import * as style from "./CircleButton.style";

interface CircleButtonProps {
  Icon?: any;
  text?: string;
  backgroundColor?: string;
  borderColor?: string;
  width?: string;
}

function CircleButton({
  Icon,
  text,
  backgroundColor,
  borderColor,
}: CircleButtonProps) {
  return (
    <>
      <style.StyledButton
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
