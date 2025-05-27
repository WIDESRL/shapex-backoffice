import { SVGProps, memo } from "react";
const TrashIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={34}
    height={34}
    fill="none"
    {...props}
  >
    <rect
      width={32.5}
      height={32.5}
      x={0.75}
      y={0.75}
      stroke="#616160"
      strokeWidth={1.5}
      rx={5.25}
    />
    <path
      stroke="#616160"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M23.472 12.978a76.11 76.11 0 0 0-7.5-.374c-1.481 0-2.963.074-4.445.224l-1.527.15M14.118 12.223l.165-.98c.12-.712.21-1.243 1.474-1.243h1.961c1.265 0 1.362.561 1.475 1.25l.164.973M21.863 15.344l-.486 7.537c-.083 1.174-.15 2.088-2.238 2.088h-4.805c-2.088 0-2.156-.914-2.238-2.088l-.487-7.537M15.486 20.852h2.493M14.866 17.86h3.742"
    />
  </svg>
);
export default memo(TrashIcon);
