import { createRoom, enterRoom } from "@/actions/http-api/lobbyApi";
import BackgroundTextCompo from "@/present/component/BackgroundTextCompo/BackgroundTextCompo";
import LobbyButtonCompo from "@/present/component/LobbyButtonCompo/LobbyButtonCompo";
import { RoomCodeState, UserInteractionState } from "@/store/GameStore";
import { colors } from "@/styles/theme";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import * as style from "./LobbyLayout.style";

const LobbyLayout = () => {
  const router = useRouter();
  const setRoomCode = useSetRecoilState(RoomCodeState);
  const [userInteraction, setUserInteraction] =
    useRecoilState(UserInteractionState);

  // 방 만들기 onClick
  const onClickMakeRoom = useCallback(async () => {
    const { isSuccess, result } = await createRoom();

    if (!isSuccess) {
      throw Error("방 생성에 실패했습니다");
    } else {
      setRoomCode(result.roomCode);
      router.push("/ready");
    }
  }, [router]);

  // 게임 설명 onClick
  const onClickGameRule = useCallback(() => {
    router.push("/game/rule");
  }, [router]);

  const onInputRoomCode = useCallback(
    (code?: string) => {
      if (!code) return;

      enterRoom(code).then((response) => {
        const { isSuccess, result } = response;

        if (!isSuccess) {
          switch (result) {
            case "fullRoom":
              alert("이미 인원이 다 찬 방입니다");
              return;
            case "gameOn":
              alert("이미 게임이 시작한 방입니다");
              return;
            case "fail":
              alert("잘못된 방 번호입니다");
              return;
          }
        }
        setRoomCode(code);
        router.push("/ready");
      });
    },
    [router]
  );

  const buttonInfoList = [
    {
      color: colors.gamePlayer[0],
      text: "방 만들기",
      isEditable: false,
      handler: onClickMakeRoom,
    },
    {
      color: colors.gamePlayer[1],
      text: "참여하기",
      isEditable: true,
      handler: onInputRoomCode,
    },
    {
      color: colors.gamePlayer[3],
      text: "게임 방법",
      isEditable: false,
      handler: onClickGameRule,
    },
  ];

  const userInteract = () => {
    console.log(userInteraction);
    setUserInteraction(!userInteraction);
  };

  return (
    <>
      <style.Container onClick={userInteract}>
        <BackgroundTextCompo />
        <style.ButtonContainer>
          {buttonInfoList.map((button) => (
            <LobbyButtonCompo key={button.text} {...button} />
          ))}
        </style.ButtonContainer>
      </style.Container>
    </>
  );
};

export default LobbyLayout;
