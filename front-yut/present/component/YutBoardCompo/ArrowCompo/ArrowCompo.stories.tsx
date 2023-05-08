import ArrowCompo from "./ArrowCompo";
import type { Meta, StoryObj } from "@storybook/react";
import { RecoilRoot } from "recoil";

const meta: Meta = {
  title: "윷 판 화살표",
  component: ArrowCompo,
  decorators: [
    (Story) => (
      <RecoilRoot>
        <Story />
      </RecoilRoot>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ArrowCompo>;

export const Default: Story = {};
