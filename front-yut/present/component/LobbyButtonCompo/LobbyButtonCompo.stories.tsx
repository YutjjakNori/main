import LobbyButtonCompo from "./LobbyButtonCompo";
import type { Meta, StoryObj } from "@storybook/react";
import { RecoilRoot } from "recoil";

const meta: Meta = {
  title: "로비 화면 버튼", //storybook에서 보이는 실제 title
  component: LobbyButtonCompo, //rendering 할 componenet
};

export default meta;
type Story = StoryObj<typeof LobbyButtonCompo>;

const 방만들기: Story = {
  args: {
    color: "#825A92",
    text: "방 만들기",
    isEditable: false,
    handler: () => {},
  },
};
const 참여하기: Story = {
  args: {
    color: "#F07F7F",
    text: "방 만들기",
    isEditable: true,
    handler: () => {},
  },
};

export { 방만들기, 참여하기 };
