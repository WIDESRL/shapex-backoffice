import { SVGProps, memo } from "react";
const MagnifierIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="10.3524" cy="10.3524" r="9.35241" stroke="#616160" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16.8564 17.3438L20.5231 21.0009" stroke="#616160" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export default memo(MagnifierIcon);
