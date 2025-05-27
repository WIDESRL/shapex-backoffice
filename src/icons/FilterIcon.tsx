import { SVGProps, memo } from "react";
const FilterIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    {...props}
  >
    <path
      stroke="#616160"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M19 21V10M19 6V1M11 21v-5M11 12V1M3 21V10M3 6V1M1 10h4M17 10h4M9 12h4"
    />
  </svg>
);
export default memo(FilterIcon);
