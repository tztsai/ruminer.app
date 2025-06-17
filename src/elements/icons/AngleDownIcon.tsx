import { config } from "../../../tokens/stitches.config";

type AngleDownIconProps = {
  color?: string;
  width?: number;
  height?: number;
};

export function AngleDownIcon({
  color,
  height,
  width,
}: AngleDownIconProps): JSX.Element {
  const strokeColor = color || config.theme.colors.graySolid;
  return (
    <svg
      width={width ?? "9"}
      height={height ?? "6"}
      viewBox="0 0 9 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.3335 1.33333L4.66683 4.66667L8.00016 1.33333"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
