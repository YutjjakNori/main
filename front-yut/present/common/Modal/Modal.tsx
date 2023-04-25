import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import * as style from "./Modal.style";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  modalStateAtom,
  isBackgroundAtom,
  isBrowserAtom,
} from "@/store/modalStore";

interface Props {
  show: boolean;
  onClose: () => void;
  modalChildren: React.ReactNode;
}

export default function Modal({ show, onClose, modalChildren }: Props) {
  const [isBrowser, setIsBrowser] = useRecoilState(isBrowserAtom);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleClose = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = show ? (
    <style.Overlay>
      <style.Modal>
        <style.Header>
          <a href="#" onClick={handleClose}>
            <button className="btn">Close</button>
          </a>
        </style.Header>
        <style.Body>{modalChildren}</style.Body>
      </style.Modal>
    </style.Overlay>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")!
    );
  } else {
    return null;
  }
}
