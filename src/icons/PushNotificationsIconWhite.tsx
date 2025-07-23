import { SVGProps, memo } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    {...props}
  >
    <path
      stroke="#FFF"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M18 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
    />
    <path
      stroke="#FFF"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13 1H8C3 1 1 3 1 8v6c0 5 2 7 7 7h6c5 0 7-2 7-7V9"
    />
  </svg>
)
const Memo = memo(SvgComponent)
export default Memo
