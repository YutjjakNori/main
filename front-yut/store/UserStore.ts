import { atom } from "recoil";
import { StaticImageData } from "next/image";
import { CompatClient } from "@stomp/stompjs";

interface UserInfoProps {
  userId: string;
  playerName?: string;
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

const roomCodeAtom = atom<string>({
  key: "roomCodeAtom",
  default: "ccccd",
});

export type { UserInfoProps };
export { userInfoState, roomCodeAtom };
