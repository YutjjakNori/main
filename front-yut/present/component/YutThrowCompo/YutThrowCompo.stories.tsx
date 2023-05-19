import YutThrowCompo from "./YutThrowCompo";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "윷 던지기", //storybook에서 보이는 실제 title
  component: YutThrowCompo, //rendering 할 componenet
};

export default meta;
type Story = StoryObj<typeof YutThrowCompo>;

export const Default: Story = {};
