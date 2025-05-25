import { SVGProps, memo } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={25}
    fill="none"
    {...props}
  >
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.878 12.5a5.75 5.75 0 1 0 0-11.5 5.75 5.75 0 0 0 0 11.5ZM20.757 24c0-4.451-4.428-8.05-9.879-8.05C5.429 15.95 1 19.548 1 24"
    />
  </svg>
)
const Memo = memo(SvgComponent)
export default Memo
