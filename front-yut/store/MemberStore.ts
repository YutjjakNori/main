import { atom } from "recoil";

interface Member {
  userId: string;
  isReady: boolean;
}

const memberListAtom = atom<Member[]>({
  key: "memberListAtom",
  default: [], //들어온 유저 아이디와 isReady 값 저장할 배열
});

export { memberListAtom };
