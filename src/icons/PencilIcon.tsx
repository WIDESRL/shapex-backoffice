import { SVGProps, memo } from "react";
const PencilIcon = (props: SVGProps<SVGSVGElement>) => (
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
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M10.385 2.327 2.16 10.553c-.313.313-.627.929-.69 1.377l-.448 3.142c-.167 1.138.637 1.931 1.775 1.775l3.142-.449c.438-.063 1.054-.376 1.377-.689l8.226-8.225c1.42-1.42 2.088-3.07 0-5.157-2.088-2.088-3.737-1.42-5.157 0Z"
    />
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M9.212 3.508a7.458 7.458 0 0 0 5.156 5.156"
    />
  </svg>
);
export default memo(PencilIcon);
