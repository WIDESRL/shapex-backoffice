import { SVGProps, memo } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={23}
    fill="none"
    {...props}
  >
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M18.495 14.532A2.507 2.507 0 0 0 21 17.027c0 3.997-1.002 5-5 5H6c-3.998 0-5-1.003-5-5v-.49a2.516 2.516 0 0 0 2.505-2.506A2.516 2.516 0 0 0 1 11.526v-.49c.01-3.999 1.002-5 5-5h9.99c3.997 0 5 1.001 5 5v1.001a2.491 2.491 0 0 0-2.495 2.495ZM15.617 6.035H5.926L9.049 2.91c2.548-2.548 3.828-2.548 6.376 0l.64.64a2.193 2.193 0 0 0-.448 2.484Z"
    />
    <path
      stroke="#fff"
      strokeDasharray="5 5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8.867 6.035v15.992"
    />
  </svg>
)
const Memo = memo(SvgComponent)
export default Memo
