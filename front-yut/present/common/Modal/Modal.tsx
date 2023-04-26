import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import * as style from "./Modal.style";
import { useRecoilState } from "recoil";
import { modalState } from "@/store/modalStore";

function Modal() {
  const [modalProps, setModalProps] = useRecoilState(modalState);
  useEffect(() => {
    setModalProps({ ...modalProps, isShow: true, isBrowser: true });
    // if (typeof window !== "undefined" && typeof document !== "undefined") {
    //   setModalProps({ ...modalProps, isShow: true, isBrowser: true });
    //   // modal 닫히면 원래 있는 위치에서 다시 스크롤 가능하도록 함
    //   return () => {
    //     const scrollY = document.body.style.top;
    //     document.body.style.cssText = "";
    //     window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
    //   };
    // }
  }, []);

  const handleClose = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    modalProps.onClose();
  };

  const modalContent = modalProps.isShow ? (
    <style.Overlay>
      <style.Modal>
        <style.Header>
          <a href="#" onClick={handleClose}>
            <button className="btn">Close</button>
          </a>
        </style.Header>
        <style.Body>{modalProps.modalChildren}</style.Body>
      </style.Modal>
    </style.Overlay>
  ) : null;

  if (modalProps.isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")!
    );
  } else {
    return null;
  }
}

export default Modal;
