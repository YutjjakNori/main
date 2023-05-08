import { atom } from "recoil";
import { StaticImageData } from "next/image";

interface UserInfoProps {
  userId: string;
  profileImage?: string | StaticImageData;
}

const userInfoState = atom<UserInfoProps>({
  key: "userInfoState",
  default: {
    userId: "",
    profileImage: "",
  },
});

const roomCodeAtom = atom<string>({
  key: "roomCodeAtom",
  default: "ccccg",
});

export type { UserInfoProps };
export { userInfoState, roomCodeAtom };
