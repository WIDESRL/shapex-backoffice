import { SVGProps, memo } from "react";
const DeleteIconWhite = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={17}
    fill="none"
    {...props}
  >
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M14.472 3.978c-2.492-.247-5-.374-7.5-.374-1.481 0-2.963.074-4.445.224L1 3.978M5.117 3.223l.165-.98C5.402 1.53 5.492 1 6.756 1h1.961c1.265 0 1.362.561 1.475 1.25l.164.973M12.863 6.344l-.486 7.536c-.083 1.175-.15 2.089-2.238 2.089H5.334c-2.088 0-2.156-.913-2.238-2.088l-.487-7.537M6.484 11.852h2.493M5.867 8.86H9.61"
    />
  </svg>
);
const Memo = memo(DeleteIconWhite);
export default Memo;
