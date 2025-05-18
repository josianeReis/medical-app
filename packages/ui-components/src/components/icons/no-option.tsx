import type { SVGProps } from "react";

export const NoOptionIcon = ({ ...props }: SVGProps<SVGSVGElement>) => (
  <svg width="1em" height="1em" fill="#5e5e5f" {...props}>
    <rect width={3} height={1.5} x={1.5} y={7.25} opacity={0.9} rx={0.5} />
    <rect width={3} height={1.5} x={6.5} y={7.25} opacity={0.9} rx={0.5} />
    <rect width={3} height={1.5} x={11.5} y={7.25} opacity={0.9} rx={0.5} />
  </svg>
);
