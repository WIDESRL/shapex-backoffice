import { SVGProps, memo } from "react";

const DayBackground = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 549 60"
    preserveAspectRatio="xMidYMid meet"
    fill="white"
    style={{width: '120%',}}
    {...props}
  >
    <path
      fill="#EDB528"
      d="M0 10C0 4.477 4.477 0 10 0h465.299a30 30 0 0 1 20.312 7.922l32.926 30.292A29.485 29.485 0 0 0 548.5 46v13.201H0V10Z"
    />
  </svg>
);

const Memo = memo(DayBackground);
export default Memo;