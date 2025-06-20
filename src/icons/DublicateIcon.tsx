import { SVGProps, memo } from "react";
const DublicateIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    {...props}
  >
    <path
      stroke="#616160"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12.2 9.72v3.36c0 2.8-1.12 3.92-3.92 3.92H4.92C2.12 17 1 15.88 1 13.08V9.72C1 6.92 2.12 5.8 4.92 5.8h3.36c2.8 0 3.92 1.12 3.92 3.92Z"
    />
    <path
      stroke="#616160"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M6 3.194c.164-.588.433-1.046.822-1.388C7.453 1.249 8.4 1 9.72 1h3.36C15.88 1 17 2.12 17 4.92v3.36c0 1.78-.453 2.88-1.501 3.447a3.342 3.342 0 0 1-.69.273"
    />
  </svg>
);
const Memo = memo(DublicateIcon);
export default Memo;
