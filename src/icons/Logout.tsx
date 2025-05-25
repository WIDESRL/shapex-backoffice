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
      d="m18.5 14.75 1.793-1.793a1 1 0 0 0 0-1.414L18.5 9.75"
    />
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M19.75 12.25h-7.5M1 18.833v-12.5m15 12.5a2.5 2.5 0 0 1-2.5 2.5h-5m7.5-15a2.5 2.5 0 0 0-2.5-2.5h-5M2.113 22.075l2.5 1.667c1.662 1.107 3.887-.084 3.887-2.08V3.504c0-1.997-2.225-3.188-3.887-2.08l-2.5 1.667A2.5 2.5 0 0 0 1 5.17v14.824a2.5 2.5 0 0 0 1.113 2.08Z"
    />
  </svg>
)
const Memo = memo(SvgComponent)
export default Memo
