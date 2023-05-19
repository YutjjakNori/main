import GameProfile from "./GameProfile";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "사용자 프로필", //storybook에서 보이는 실제 title
  component: GameProfile, //rendering 할 componenet
  argTypes: { onClick: { action: "clicked" } },
};

export default meta;
type Story = StoryObj<typeof GameProfile>;

export const Default: Story = {
  args: {
    playerName: "player name",
    isReady: false,
  },
};
