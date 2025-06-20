import { SVGProps, memo } from "react"
const OrderIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M1 5.9v4.2C1 13.6 2.4 15 5.9 15h4.2c3.5 0 4.9-1.4 4.9-4.9V5.9C15 2.4 13.6 1 10.1 1H5.9C2.4 1 1 2.4 1 5.9Z"
    />
    <path
      stroke="#616160"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      d="M10 6 8.354 4.16a.47.47 0 0 0-.708 0L6 6M10 10l-1.646 1.84a.47.47 0 0 1-.708 0L6 10"
    />
  </svg>
)
const Memo = memo(OrderIcon)
export default Memo
