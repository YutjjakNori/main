import CircleButton from "./CircleButton";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "CircleButton", //storybook에서 보이는 실제 title
  component: CircleButton, //rendering 할 componenet
};

export default meta;
type Story = StoryObj<typeof CircleButton>;

export const Default: Story = {};
