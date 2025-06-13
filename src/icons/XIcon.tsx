import { SVGProps, memo } from "react"

const XIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    {...props}
  >
    <path
      stroke="#616160"
      strokeLinecap="round"
      d="M11 1 7.25 4.75 1 11M1 1l3.75 3.75L11 11"
    />
  </svg>
)
const Memo = memo(XIcon)
export default Memo
