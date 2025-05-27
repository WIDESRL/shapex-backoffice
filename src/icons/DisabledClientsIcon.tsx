import { SVGProps, memo } from "react";
const DisabledClientsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    {...props}
  >
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9.59 11a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM1 21c0-3.87 3.85-7 8.59-7"
    />
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M21 17c0 .32-.04.63-.12.93-.09.4-.25.79-.46 1.13A3.97 3.97 0 0 1 17 21a3.92 3.92 0 0 1-2.66-1.03c-.3-.26-.56-.57-.76-.91A3.92 3.92 0 0 1 13 17a3.995 3.995 0 0 1 4-4c1.18 0 2.25.51 2.97 1.33.64.71 1.03 1.65 1.03 2.67ZM18.03 15.94l-2.11 2.11M15.94 15.959l2.12 2.11"
    />
  </svg>
);
export default memo(DisabledClientsIcon);
