import { atom } from "recoil";

interface ModalProps {
  isBrowser: boolean;
}

const modalState = atom<ModalProps>({
  key: "modalState",
  default: {
    isBrowser: false,
  },
});

const showState = atom({
  key: "showState",
  default: false,
});

export type { ModalProps };
export { modalState, showState };
