import BackgroundTextCompo from "./BackgroundTextCompo";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "로비 메인 글씨",
  component: BackgroundTextCompo,
};

export default meta;
type Story = StoryObj<typeof BackgroundTextCompo>;

export const Default: Story = {};
