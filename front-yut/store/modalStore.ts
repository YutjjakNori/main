import { atom } from "recoil";

interface ModalProps {
  isShow: boolean;
  isBrowser: boolean;
  onClose: () => void;
  modalChildren: React.ReactNode;
}

const modalState = atom<ModalProps>({
  key: "modalState",
  default: {
    isShow: false,
    isBrowser: false,
    onClose: () => {},
    modalChildren: null,
  },
});

export { modalState };
