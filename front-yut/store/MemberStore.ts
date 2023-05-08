import { atom } from "recoil";

const memberListAtom = atom<string[]>({
  key: "memberListAtom",
  default: [], //들어온 유저 아이디 저장할 배열
});

export { memberListAtom };
