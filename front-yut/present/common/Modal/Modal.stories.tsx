import Modal, { ReadyModalProps } from "./Modal";
import type { Meta, StoryObj } from "@storybook/react";
import { RecoilRoot, useRecoilState, useSetRecoilState } from "recoil";
import { showState } from "@/store/modalStore";

const TestModal = ({ title = "test", children }: ReadyModalProps) => {
  const setIsShow = useSetRecoilState(showState);

  return (
    <>
      <Modal title={title} children={children} />
      <button onClick={() => setIsShow((current) => !current)}>
        modal open
      </button>
    </>
  );
};

const meta: Meta = {
  title: "common modal", //storybook에서 보이는 실제 title
  component: TestModal, //rendering 할 componenet
  decorators: [
    (Story) => (
      <RecoilRoot>
        <Story />
        <div id="modal-root" />
      </RecoilRoot>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof TestModal>;

export const Default: Story = {};
