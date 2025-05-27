import { SVGProps, memo } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={26}
    height={26}
    fill="none"
    {...props}
  >
    <path
      stroke="#616160"
      strokeWidth={1.5}
      d="M13 1.75c6.213 0 11.25 5.037 11.25 11.25S19.213 24.25 13 24.25 1.75 19.213 1.75 13 6.787 1.75 13 1.75Z"
    />
    <path
      stroke="#616160"
      strokeWidth={1.5}
      d="M13 24.5c6.351 0 11.5-5.149 11.5-11.5S19.351 1.5 13 1.5 1.5 6.649 1.5 13 6.649 24.5 13 24.5Z"
    />
    <path
      stroke="#616160"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="m17 9.473-3 3-5 5"
    />
    <path
      stroke="#616160"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="m9 9.473 3 3 5 5"
    />
  </svg>
)
const Memo = memo(SvgComponent)
export default Memo
