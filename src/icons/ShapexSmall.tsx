import { SVGProps, memo } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 40 40"
    xmlns="http://www.w3.org/2000/svg"
    width={114}
    height={68}
    fill="none"
    {...props}
  >
    <path fill="#DAA521" d="M56.66 67.491H.54v-10.79h61.302l-5.182 10.79Z" />
    <path
      fill="#DAA521"
      d="M113.965.473h-12.731L83.529 25.217 65.825.473H53.094l24.069 33.64L53.28 67.491h12.73L83.53 43.007l17.518 24.484h12.731l-23.884-33.38L113.965.473Z"
    />
    <path
      fill="#DAA521"
      d="M63.355 11.327H.54V.473h58.496l4.32 10.854ZM47.192 28.742H.539v10.313h46.653V28.742Z"
    />
  </svg>
)
const Memo = memo(SvgComponent)
export default Memo
