import { atom } from "recoil";
import { StaticImageData } from "next/image";

interface UserInfoProps {
  userId: string;
  profileImage?: string | StaticImageData;
}

const UserInfoState = atom<UserInfoProps>({
  key: "UserInfoState",
  default: {
    userId: "",
    profileImage: "",
  },
});

const RoomCodeState = atom<string>({
  key: "RoomCodeState",
  default: "",
});

export type { UserInfoProps };
export { UserInfoState, RoomCodeState };
