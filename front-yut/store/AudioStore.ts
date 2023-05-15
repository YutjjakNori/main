import { atom } from "recoil";

const BgmMuteState = atom<boolean>({
  key: "BgmMute",
  default: false,
});

const UserInteractionState = atom<boolean>({
  key: "UserInteraction",
  default: false,
});

export { BgmMuteState, UserInteractionState };
