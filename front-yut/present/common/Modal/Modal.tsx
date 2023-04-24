import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import * as style from "./Modal.style";

interface Props {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ show, onClose, children }: Props) {
  const [isBrowser, setIsBrowser] = useState(false);

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
        <style.Body>{children}</style.Body>
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
