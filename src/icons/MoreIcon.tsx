import { SVGProps, memo } from "react";

const MoreIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={21}
    height={3}
    fill="none"
    {...props}
  >
    <path
      stroke="#616160"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M10.486 1.5h.027M2.486 1.5h.027M18.486 1.5h.027"
    />
  </svg>
);

export default memo(MoreIcon);
