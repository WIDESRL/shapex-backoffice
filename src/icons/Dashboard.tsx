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
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M21 9.9V3.1c0-1.5-.64-2.1-2.23-2.1h-4.04c-1.59 0-2.23.6-2.23 2.1v6.8c0 1.5.64 2.1 2.23 2.1h4.04c1.59 0 2.23-.6 2.23-2.1ZM21 18.9v-1.8c0-1.5-.64-2.1-2.23-2.1h-4.04c-1.59 0-2.23.6-2.23 2.1v1.8c0 1.5.64 2.1 2.23 2.1h4.04c1.59 0 2.23-.6 2.23-2.1ZM9.5 12.1v6.8c0 1.5-.64 2.1-2.23 2.1H3.23C1.64 21 1 20.4 1 18.9v-6.8c0-1.5.64-2.1 2.23-2.1h4.04c1.59 0 2.23.6 2.23 2.1ZM9.5 3.1v1.8C9.5 6.4 8.86 7 7.27 7H3.23C1.64 7 1 6.4 1 4.9V3.1C1 1.6 1.64 1 3.23 1h4.04c1.59 0 2.23.6 2.23 2.1Z"
    />
  </svg>
)
const Memo = memo(SvgComponent)
export default Memo
