import * as style from "./RectButton.style";
import { RectButtonProps } from "@/pages/compoTest";

function RectButton({ backgroundColor, text, fontSize }: RectButtonProps) {
  return (
    <style.StyledButton backgroundColor={backgroundColor} fontSize={fontSize}>
      {text}
    </style.StyledButton>
  );
}

export default RectButton;
