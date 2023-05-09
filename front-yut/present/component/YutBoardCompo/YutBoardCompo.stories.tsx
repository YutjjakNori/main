import YutBoardCompo from "./YutBoardCompo";
import type { Meta, StoryObj } from "@storybook/react";
import { RecoilRoot } from "recoil";

const meta: Meta = {
  title: "윷놀이판", //storybook에서 보이는 실제 title
  component: YutBoardCompo, //rendering 할 componenet
  decorators: [
    (Story) => (
      <RecoilRoot>
        <Story />
      </RecoilRoot>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof YutBoardCompo>;

export const Default: Story = {};
