import { SVGProps, memo } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={24}
    fill="none"
    {...props}
  >
    <path
      stroke="#616160"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M18.6 7.877v10.725c0 3.3-1.969 4.4-4.4 4.4H5.4c-2.431 0-4.4-1.1-4.4-4.4V7.877c0-3.575 1.969-4.4 4.4-4.4 0 .682.275 1.298.726 1.749a2.46 2.46 0 0 0 1.749.726h3.85A2.479 2.479 0 0 0 14.2 3.477c2.431 0 4.4.825 4.4 4.4Z"
    />
    <path
      stroke="#616160"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M14.2 3.475a2.479 2.479 0 0 1-2.475 2.475h-3.85a2.46 2.46 0 0 1-1.749-.726A2.46 2.46 0 0 1 5.4 3.475 2.479 2.479 0 0 1 7.875 1h3.85a2.46 2.46 0 0 1 1.75.726 2.46 2.46 0 0 1 .725 1.749ZM5.4 13.102h4.4M5.4 17.5h8.8"
    />
  </svg>
)
const Memo = memo(SvgComponent)
export default Memo
