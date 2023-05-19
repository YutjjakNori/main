import Timer from "./Timer";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "타이머 텍스트", //storybook에서 보이는 실제 title
  component: Timer, //rendering 할 componenet
};

export default meta;
type Story = StoryObj<typeof Timer>;

export const Default: Story = {
  args: {
    ss: 10,
    size: 22,
    color: "black",
    handleOver: () => {},
  },
};
