import { atom } from "recoil";

// type MessageLogProps = {
//   [key: number]: string;
// };

type MessageLogProps = {
  chatName: string;
  chatMessage: string;
};

const messageLogState = atom<MessageLogProps[]>({
  key: "messageLogState",
  default: [{ chatName: "", chatMessage: "" }],
});

export type { MessageLogProps };
export { messageLogState };
