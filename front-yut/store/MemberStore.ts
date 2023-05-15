import { atom } from "recoil";

interface Member {
  userId: string;
  nickName: string;
}
//TODO : ReadyPage CSS하고 나서 Member 상속받아서 관리하는 걸로 바꾸기
interface ReadyMember extends Member {
  isReady: boolean;
}

const MemberListState = atom<Member[]>({
  key: "MemberListState",
  default: [], //들어온 유저 아이디 저장할 배열
});

const MemberReadyListState = atom<ReadyMember[]>({
  key: "MemberReadyListState",
  default: [], //들어온 유저 아이디와 isReady 값 저장할 배열
});

export type { Member, ReadyMember };
export { MemberListState, MemberReadyListState };
