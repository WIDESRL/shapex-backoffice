import { SVGProps, memo } from "react"

const ArrowBackIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={9}
    height={16}
    fill="none"
    {...props}
  >
    <path
      stroke="#616160"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 1 1 8l7 7"
    />
  </svg>
)

const Memo = memo(ArrowBackIcon)
export default Memo
