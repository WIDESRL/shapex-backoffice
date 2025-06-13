import { SVGProps, memo } from "react";

const ArrowRightIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={9}
    height={16}
    fill="none"
    {...props}
  >
    <path
      stroke="#616160"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m1 15 7-7-7-7"
    />
  </svg>
);
const Memo = memo(ArrowRightIcon);
export default Memo;
