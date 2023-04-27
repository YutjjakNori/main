import { useEffect } from "react";
import ReactDOM from "react-dom";
import * as style from "./Modal.style";
import { useRecoilState, useRecoilValue } from "recoil";
import { modalState, showState } from "@/store/modalStore";
import useModal from "@/actions/hook/controlModal";

interface ReadyModalProps {
  title: string;
  children: React.ReactNode;
}

function Modal({ title, children }: ReadyModalProps) {
  const [modal, setModal] = useRecoilState(modalState);
  const isShow = useRecoilValue(showState);
  const { closeModal } = useModal();

  useEffect(() => {
    setModal((modalState) => ({ ...modalState, isBrowser: true }));
    const timer = setTimeout(() => {
      closeModal();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const modalContent = isShow ? (
    <style.Overlay>
      <style.Modal>
        <style.Header>{title}</style.Header>
        <style.Body>{children}</style.Body>
      </style.Modal>
    </style.Overlay>
  ) : null;

  if (modal.isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")!
    );
  } else {
    return null;
  }
}

export default Modal;
