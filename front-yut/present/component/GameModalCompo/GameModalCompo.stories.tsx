import GameModalCompo from "./GameModalCompo";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "게임 용 modal",
  component: GameModalCompo,
};

export default meta;
type Story = StoryObj<typeof GameModalCompo>;

export const Default: Story = {
  args: {
    data: {
      nowTurnPlayerNickname: "JJ",
      isMyTurn: true,
    },
  },
};
