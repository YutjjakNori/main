import { atom, useRecoilValue, selector } from "recoil";
import type { UserInfoProps } from "@/store/UserStore";
import { userInfoState } from "@/store/UserStore";

interface UserIsReadyProps extends UserInfoProps {
  isReady: boolean;
}

const userReadySelector = selector<UserIsReadyProps>({
  key: "userReadySelector",
  get: ({ get }) => {
    const userInfo = get(userInfoState);
    return {
      userId: userInfo.userId,
      // profileImage: userInfo.profileImage,
      isReady: false,
    };
  },
});

export type { UserIsReadyProps };
export { userReadySelector };
