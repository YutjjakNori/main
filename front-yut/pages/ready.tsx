//게임 대기 페이지

import GameProfile from "@/present/common/GameProfile/GameProfile";
import Modal from "@/present/common/Modal/Modal";
// import { modalState } from "@/store/modalStore";
// import { useRecoilState } from "recoil";

const Ready = () => {
  // const [modalProps, setModalProps] = useRecoilState(modalState);

  return (
    <>
      <GameProfile
        profileImage={
          "https://cdn.pixabay.com/photo/2023/04/07/06/42/bird-7905654__340.jpg"
        }
        isReady={true}
        playerName={"박재희"}
      />
      <Modal>모달 띄웠다!</Modal>
    </>
  );
};

export default Ready;
