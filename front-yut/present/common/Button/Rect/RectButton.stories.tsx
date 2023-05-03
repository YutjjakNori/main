import RectButton from "./RectButton";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "RectButton", //storybook에서 보이는 실제 title
  component: RectButton, //rendering 할 componenet
};

export default meta;
type Story = StoryObj<typeof RectButton>;

export const Default: Story = {};
