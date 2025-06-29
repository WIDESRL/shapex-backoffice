import { SVGProps, memo } from "react";

const AllenamentiIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={26}
    height={18}
    fill="none"
    {...props}
  >
    <path
      stroke="#616160"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M18.92 16.429c2.743 0 3.428-1.736 3.428-3.858V4.857C22.348 2.736 21.663 1 18.92 1S15.49 2.736 15.49 4.857v7.714c0 2.122.686 3.858 3.429 3.858ZM7.08 16.429c-2.742 0-3.428-1.736-3.428-3.858V4.857C3.652 2.736 4.338 1 7.081 1s3.428 1.736 3.428 3.857v7.714c0 2.122-.685 3.858-3.428 3.858ZM10.51 8.715h4.983M25 11.929V5.5M1 11.929V5.5"
    />
  </svg>
);

export default memo(AllenamentiIcon);
