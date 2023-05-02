import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import * as style from "./Modal.style";
import { useRecoilState, useRecoilValue } from "recoil";
import { showState } from "@/store/ModalStore";

interface ReadyModalProps {
  title: string;
  children: React.ReactNode;
}

function Modal({ title, children }: ReadyModalProps) {
  const [mounted, setMounted] = useState(false);
  const isShow = useRecoilValue(showState);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const modalContent = isShow ? (
    <style.Overlay>
      <style.Modal>
        <style.Header>{title}</style.Header>
        <style.Body>{children}</style.Body>
      </style.Modal>
    </style.Overlay>
  ) : null;

  if (mounted) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")!
    );
  } else {
    return null;
  }
}

export default Modal;
