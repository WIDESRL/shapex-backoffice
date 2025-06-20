import { SVGProps, memo } from "react";
const DublicateIconWhite = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.8 8.63v2.94c0 2.45-.98 3.43-3.43 3.43H4.43C1.98 15 1 14.02 1 11.57V8.63c0-2.45.98-3.43 3.43-3.43h2.94c2.45 0 3.43.98 3.43 3.43Z"
    />
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M5.375 2.92c.144-.515.38-.915.719-1.215C6.647 1.218 7.475 1 8.63 1h2.94C14.02 1 15 1.98 15 4.43v2.94c0 1.557-.396 2.52-1.313 3.016-.181.097-.382.177-.604.24"
    />
  </svg>
);
const Memo = memo(DublicateIconWhite);
export default Memo;
