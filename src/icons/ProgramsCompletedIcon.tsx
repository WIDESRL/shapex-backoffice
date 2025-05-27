import { SVGProps, memo } from "react";
const ProgramsCompletedIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={20}
    fill="none"
    viewBox="0 0 18 22"
    {...props}
  >
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17 7.25V17c0 3-1.79 4-4 4H5c-2.21 0-4-1-4-4V7.25c0-3.25 1.79-4 4-4 0 .62.25 1.18.66 1.59.41.41.97.66 1.59.66h3.5C11.99 5.5 13 4.49 13 3.25c2.21 0 4 .75 4 4Z"
    />
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13 3.25c0 1.24-1.01 2.25-2.25 2.25h-3.5c-.62 0-1.18-.25-1.59-.66C5.25 4.43 5 3.87 5 3.25 5 2.01 6.01 1 7.25 1h3.5c.62 0 1.18.25 1.59.66.41.41.66.97.66 1.59ZM5 12h4M5 16h8"
    />
  </svg>
);
const Memo = memo(ProgramsCompletedIcon);
export default Memo;
