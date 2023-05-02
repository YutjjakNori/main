import { atom } from "recoil";

const showState = atom({
  key: "showState",
  default: false,
});

export { showState };
