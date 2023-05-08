import CarouselCompo from "./CarouselCompo";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "캐러셀",
  component: CarouselCompo,
};

export default meta;
type Story = StoryObj<typeof CarouselCompo>;

export const Default: Story = {
  args: {
    contents: [
      "https://cdn.pixabay.com/photo/2023/04/23/11/11/flowers-7945521_960_720.jpg",
      "https://cdn.pixabay.com/photo/2023/05/02/17/33/blue-tit-7965696_960_720.jpg",
      "https://cdn.pixabay.com/photo/2023/04/24/03/16/camping-7947056_960_720.jpg",
    ],
  },
};
