import { atom } from "recoil";
import { StaticImageData } from "next/image";

interface UserInfoProps {
  userId: string;
  nickName: string;
  profileImage?: string | StaticImageData;
}

const UserInfoState = atom<UserInfoProps>({
  key: "UserInfoState",
  default: {
    userId: "",
    nickName: "",
    profileImage: "",
  },
});

export type { UserInfoProps };
export { UserInfoState };
