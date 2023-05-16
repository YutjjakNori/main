import { createRoom, enterRoom } from "@/actions/http-api/lobbyApi";
import BackgroundTextCompo from "@/present/component/BackgroundTextCompo/BackgroundTextCompo";
import LobbyButtonCompo from "@/present/component/LobbyButtonCompo/LobbyButtonCompo";
import { RoomCodeState } from "@/store/GameStore";
import { UserInteractionState } from "@/store/AudioStore";
import { colors } from "@/styles/theme";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import * as style from "./LobbyLayout.style";
import useModal from "@/actions/hook/controlModal";
import Modal from "@/present/common/Modal/Modal";
import { UserInfoState } from "@/store/UserStore";
import RectButton, {
  RectButtonProps,
} from "@/present/common/Button/Rect/RectButton";
// import CherryGif from "@/public/image/cherryGif.gif";

const LobbyLayout = () => {
  //모달 나가기 버튼
  const exitModaltBtnInfo: RectButtonProps = {
    text: "돌아가기",
    fontSize: "21px",
    backgroundColor: "#EA857C",
  };
  const ingressModalBtnInfo: RectButtonProps = {
    text: "입장하기",
    fontSize: "21px",
    backgroundColor: "#6eba91",
  };

  const router = useRouter();
  const { openModal, closeModal } = useModal(); //모달 Hook
  const setRoomCode = useSetRecoilState(RoomCodeState);
  const [userInteraction, setUserInteraction] =
    useRecoilState(UserInteractionState);
  const [userInfo, setUserInfo] = useRecoilState(UserInfoState);
  const [nickName, setNickName] = useState("");

  // 방 만들기 onClick
  const onClickMakeRoom = useCallback(async () => {
    const { isSuccess, result } = await createRoom();

    if (!isSuccess) {
      throw Error("방 생성에 실패했습니다");
    } else {
      setRoomCode(result.roomCode);
      inputNickName();
    }
  }, [router]);

  // 게임 설명 onClick
  const onClickGameRule = useCallback(() => {
    router.push("/game/rule");
  }, [router]);

  //참여하기 onClick
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
        } else {
          inputNickName();
        }
        setRoomCode(code);
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
  //닉네임 입력
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickName(e.target.value);
  };

  //닉네임 저장 요청
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // nickName이 빈 값이거나 공백 문자로만 이루어졌거나 10글자 이상이라면
    // 아무것도 하지 않고 함수를 빠져나갑니다.
    if (!nickName || nickName.trim().length === 0 || nickName.length >= 10) {
      alert("10글자 이하 별명을 써주세요");
      return;
    }
    setUserInfo({
      ...userInfo,
      nickName: nickName,
    });
    moveReady();
  };

  //모달창 닫고 대기방으로 이동
  const moveReady = () => {
    closeModal();
    router.push("/ready");
  };
  //별명받는 모달창 실행
  const inputNickName = () => {
    setTimeout(() => {
      openModal();
      if (nickName === "") return;
    }, 1000);
  };

  //돌아가기
  const handleIsExit = (): void => {
    closeModal();
  };

  const userInteract = () => {
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
        <Modal title={"별명을 입력하세요"}>
          <style.ModalFormContainer onSubmit={handleSubmit}>
            <style.inputNickName
              type="text"
              id="nickname-input"
              value={nickName}
              onChange={handleChange}
              placeholder="10글자 미만 별명 작성"
            />

            <style.ExitModalContainer
              onClick={() => {
                handleIsExit();
              }}
            >
              <RectButton
                text={exitModaltBtnInfo.text}
                fontSize={exitModaltBtnInfo.fontSize}
                backgroundColor={exitModaltBtnInfo.backgroundColor}
              />
            </style.ExitModalContainer>
            <style.IngressButton
              type="submit"
              fontSize={ingressModalBtnInfo.fontSize}
              backgroundColor={ingressModalBtnInfo.backgroundColor}
            >
              {ingressModalBtnInfo.text}
            </style.IngressButton>
          </style.ModalFormContainer>
        </Modal>
      </style.Container>
    </>
  );
};

export default LobbyLayout;
