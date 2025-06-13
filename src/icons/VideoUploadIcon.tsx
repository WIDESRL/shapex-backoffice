import { SVGProps, memo } from "react"

const VideoUploadIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={21}
    height={19}
    fill="none"
    {...props}
  >
    <path
      stroke="#616160"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.25 5.936v12.04M7.334 8.863l2.916-2.928 2.916 2.928"
    />
    <path
      stroke="#616160"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M5.617 13.244h-.933A3.684 3.684 0 0 1 1 9.56V4.675A3.675 3.675 0 0 1 4.675 1h11.14A3.685 3.685 0 0 1 19.5 4.685V9.57a3.675 3.675 0 0 1-3.675 3.674h-.942"
    />
  </svg>
)
const Memo = memo(VideoUploadIcon)
export default Memo
