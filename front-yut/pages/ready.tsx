//게임 대기 페이지

import GameProfile from "@/present/common/GameProfile/GameProfile";
import Modal from "@/present/common/Modal/Modal";
import Timer from "@/present/common/Timer/Timer";
import useModal from "@/actions/hook/controlModal";
import ChatCompo from "@/present/component/ChatCompo/ChatCompo";

const Ready = () => {
  const { openModal, closeModal } = useModal(); //모달 열기

  return (
    <>
      <GameProfile
        profileImage={
          "https://cdn.pixabay.com/photo/2023/04/07/06/42/bird-7905654__340.jpg"
        }
        isReady={true}
        playerName={"박재희"}
      />
      <button onClick={() => openModal()} className="btn">
        준비
      </button>
      <Modal title={"게임을 시작합니다"}>
        <Timer
          ss={5}
          size={65}
          color={"#000"}
          handleOver={() => {
            closeModal();
          }}
        />
      </Modal>
      <ChatCompo></ChatCompo>
    </>
  );
};

export default Ready;
