import { SVGProps, memo } from "react";
const AssignIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={18}
    fill="none"
    {...props}
  >
    <path
      stroke="#616160"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7.871 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM1 17c0-3.096 3.08-5.6 6.872-5.6M15.398 14.6l-2.4-2.4M12.67 14.6l-2.4-2.4M15.398 14.6l-2.4 2.4M12.67 14.6l-2.4 2.4"
    />
  </svg>
);
const Memo = memo(AssignIcon);
export default Memo;
