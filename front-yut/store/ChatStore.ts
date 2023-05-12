import { atom } from "recoil";

type MessageLogProps = {
  [key: string]: string;
};

const messageLogState = atom<MessageLogProps>({
  key: "messageLogState",
  default: {},
});

export type { MessageLogProps };
export { messageLogState };
