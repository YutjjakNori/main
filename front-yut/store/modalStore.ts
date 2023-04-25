import { atom } from "recoil";

//모달 상태
const modalStateAtom = atom({
  key: "modalStateAtom",
  default: false,
});

//모달 뒷배경 상태
const isBackgroundAtom = atom({
  key: "isBackgroundAtom",
  default: false,
});

//모달 브라우저에 띄울 지 상태
const isBrowserAtom = atom({
  key: "isBrowserAtom",
  default: false,
});

export { modalStateAtom, isBackgroundAtom, isBrowserAtom };
