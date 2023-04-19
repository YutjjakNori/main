import * as style from "./StyledLobbyButton.style";
import { ButtonInfo } from "../../pages/robby";

function StyledLobbyButton({ backgroundColor, text }: ButtonInfo) {
  return (
    <style.StyledDiv>
      <style.StyledButton backgroundColor={backgroundColor}>
        {text}
      </style.StyledButton>
    </style.StyledDiv>
  );
}

export default StyledLobbyButton;
