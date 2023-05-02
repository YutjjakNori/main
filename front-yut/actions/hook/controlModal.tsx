//모달 컨트롤 커스텀 훅

import { showState } from "@/store/modalStore";
import { useRecoilState } from "recoil";

const useModal = () => {
  const [isShow, setIsShow] = useRecoilState(showState);

  const openModal = () => {
    setIsShow(true);
  };

  const closeModal = () => {
    setIsShow(false);
  };
  return { openModal, closeModal };
};

export default useModal;
