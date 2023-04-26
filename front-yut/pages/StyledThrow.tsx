import * as style from "./YutImage.style";

interface YutImageProps {
  Icon?: any;
  width?: string;
  height?: string;
}

function StyledThrow({ Icon, width, height }: YutImageProps) {
  return (
    <>
      <style.StyledThrow width={width} height={height}>
        <Icon />
      </style.StyledThrow>
    </>
  );
}

export type { YutImageProps };
export default StyledThrow;
