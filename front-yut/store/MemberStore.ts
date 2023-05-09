import { atom } from "recoil";

interface Member {
  userId: string;
  isReady: boolean;
}

const MemberListState = atom<string[]>({
  key: "MemberListState",
  default: [], //들어온 유저 아이디 저장할 배열
});

const MemberReadyListState = atom<Member[]>({
  key: "MemberReadyListState",
  default: [], //들어온 유저 아이디와 isReady 값 저장할 배열
});

export { MemberListState, MemberReadyListState };
