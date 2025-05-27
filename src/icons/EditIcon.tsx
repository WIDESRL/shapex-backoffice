import { SVGProps, memo } from "react";
const EditIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <path
      stroke="#616160"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.334 1.176H5.926C2.407 1.176 1 2.583 1 6.102v4.222c0 3.519 1.407 4.926 4.926 4.926h4.222c3.52 0 4.927-1.407 4.927-4.926V8.917"
    />
    <path
      stroke="#616160"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      d="M10.878 1.895 5.333 7.44a1.909 1.909 0 0 0-.465.929l-.302 2.118c-.113.767.429 1.302 1.196 1.196l2.118-.302c.296-.042.71-.254.93-.465l5.544-5.545c.958-.957 1.408-2.069 0-3.476-1.407-1.408-2.519-.957-3.476 0Z"
    />
    <path
      stroke="#616160"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      d="M10.086 2.69a5.028 5.028 0 0 0 3.476 3.476"
    />
  </svg>
);
const Memo = memo(EditIcon);
export default Memo;
