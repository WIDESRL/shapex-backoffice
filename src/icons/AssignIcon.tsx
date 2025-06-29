import * as React from "react";
import { SVGProps, memo } from "react";
const AssignIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    {...props}
  >
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7.233 11.895C3.87 11.895 1 12.402 1 14.439S3.854 17 7.233 17c3.362 0 6.233-.509 6.233-2.544s-2.853-2.563-6.233-2.563ZM7.232 8.99a3.995 3.995 0 1 0-3.994-3.995A3.98 3.98 0 0 0 7.205 8.99h.027Z"
      clipRule="evenodd"
    />
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15.388 6.176v3.507M17.178 7.93h-3.576"
    />
  </svg>
);
const Memo = memo(AssignIcon);
export default Memo;
