import { SVGProps, memo } from "react";

const PlusIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    {...props}
  >
    <path
      stroke="#616160"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M9 1v16M17 9H1"
    />
  </svg>
);
const Memo = memo(PlusIcon);
export default Memo;
