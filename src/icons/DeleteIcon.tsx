import { SVGProps, memo } from "react";
const DeleteIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={17}
    fill="none"
    {...props}
  >
    <path
      stroke="#616160"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.823 3.978c-2.492-.247-5-.374-7.499-.374-1.482 0-2.964.074-4.446.224l-1.526.15M5.47 3.223l.164-.98C5.754 1.53 5.844 1 7.11 1h1.96c1.266 0 1.363.561 1.475 1.25l.165.973M13.214 6.344l-.486 7.536c-.082 1.175-.15 2.089-2.238 2.089H5.685c-2.088 0-2.155-.913-2.238-2.088l-.486-7.537M6.838 11.852H9.33M6.218 8.86H9.96"
    />
  </svg>
);
const Memo = memo(DeleteIcon);
export default Memo;
