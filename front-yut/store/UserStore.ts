import { atom } from "recoil";
import { StaticImageData } from "next/image";

interface UserInfoProps {
  userId: string;
  playerName: string;
  profileImage?: string | StaticImageData;
}

const userInfoState = atom<UserInfoProps>({
  key: "userInfoState",
  default: {
    userId: "",
    playerName: "",
    profileImage: "",
  },
});

export type { UserInfoProps };
export { userInfoState };
