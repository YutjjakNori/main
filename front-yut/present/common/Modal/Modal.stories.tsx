import Modal from "./Modal";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "common modal", //storybook에서 보이는 실제 title
  component: Modal, //rendering 할 componenet
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    title: "TestTitle",
  },
};
