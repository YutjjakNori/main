import { atom } from "recoil";
import { StaticImageData } from "next/image";
import { CompatClient } from "@stomp/stompjs";

interface MemberInfoProps {
  userId?: string;
  playerName?: string;
  profileImage?: string | StaticImageData;
}

//Partial은  Type 형식의 모든 속성을 선택적으로 만드는 타입입니다.
//즉, Partial<Type>을 사용하면 Type 형식에 정의된 모든 속성을 선택적으로 사용할 수 있습니다.
const MemberInfoState = atom<Partial<MemberInfoProps[]>>({
  key: "MemberInfoState",
  default: {
    userId: "",
    playerName: "",
    profileImage: "",
  },
});

export type { MemberInfoProps };
export { MemberInfoState };
