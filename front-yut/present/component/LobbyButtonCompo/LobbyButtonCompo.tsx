import React, { useCallback, useState } from "react";
import * as style from "./LobbyButtonCompo.style";

interface LobbyButtonCompoProps {
  color: string;
  text: string;
  isEditable: boolean;
  handler: (code?: string) => void;
}

const LobbyButtonCompo = ({
  text,
  color,
  isEditable,
  handler,
}: LobbyButtonCompoProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [inputText, setInputText] = useState("");

  const onClick = useCallback(() => {
    //edit mode로 바꿀수 없는 버튼은 handler 실행
    if (!isEditable) {
      handler();
      return;
    }

    //edit mode로 바꿀수 있는 버튼은 edit mode로 변환
    setIsEditMode(true);
  }, []);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  }, []);

  const onKeyPress = useCallback(
    (e: any) => {
      if (e.key === "Enter") {
        handler(inputText);
      }
    },
    [inputText],
  );

  return (
    <>
      <style.Button color={color} isEditMode={isEditMode} onClick={onClick}>
        {isEditMode ? (
          <style.InputContainer>
            <style.Icon />
            <style.Input
              color={color}
              placeholder="방 코드 입력"
              value={inputText}
              onChange={onChange}
              onKeyDown={onKeyPress}
            ></style.Input>
          </style.InputContainer>
        ) : (
          text
        )}
      </style.Button>
    </>
  );
};

export default LobbyButtonCompo;
export type { LobbyButtonCompoProps };
