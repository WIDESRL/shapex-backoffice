import { SVGProps, memo } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={16}
    fill="none"
    {...props}
  >
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17.426 15.143c2.514 0 3.143-1.591 3.143-3.536V4.536C20.569 2.59 19.94 1 17.426 1s-3.143 1.591-3.143 3.536v7.071c0 1.945.629 3.536 3.143 3.536ZM6.574 15.143c-2.515 0-3.143-1.591-3.143-3.536V4.536C3.43 2.59 4.059 1 6.574 1c2.514 0 3.142 1.591 3.142 3.536v7.071c0 1.945-.628 3.536-3.142 3.536ZM9.717 8.072h4.567M23 11.018V5.125M1 11.018V5.125"
    />
  </svg>
)
const Memo = memo(SvgComponent)
export default Memo
