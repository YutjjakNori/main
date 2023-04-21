import * as style from "./RectButton.style";

interface RectButtonProps {
  text: string;
  fontSize: string;
  backgroundColor: string;
}

function RectButton({ backgroundColor, text, fontSize }: RectButtonProps) {
  return (
    <style.StyledButton backgroundColor={backgroundColor} fontSize={fontSize}>
      {text}
    </style.StyledButton>
  );
}

export type { RectButtonProps };
export default RectButton;
