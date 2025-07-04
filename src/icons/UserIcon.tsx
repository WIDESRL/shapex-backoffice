import { SVGProps, memo } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={20}
    fill="none"
    {...props}
  >
    <path
      stroke="#5C460F"
      strokeLinecap="round"
      strokeMiterlimit={133.33}
      d="M8.538.5a3.768 3.768 0 1 1 0 7.535 3.768 3.768 0 0 1 0-7.535ZM8.535 10.898c2.287 0 4.333.523 5.79 1.342 1.473.828 2.245 1.894 2.245 2.958v.5c-.017 1.104-.132 1.899-.88 2.507-.447.364-1.16.692-2.317.926-1.155.234-2.718.367-4.835.367s-3.68-.133-4.836-.367c-1.157-.234-1.87-.562-2.318-.926C.527 17.508.5 16.567.5 15.198c0-1.064.773-2.13 2.245-2.958 1.457-.819 3.503-1.341 5.79-1.342Z"
    />
  </svg>
)
const Memo = memo(SvgComponent)
export default Memo
