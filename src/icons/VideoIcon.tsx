import { SVGProps, memo } from "react"

const VideoIconComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <path
      stroke="#616160"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Z"
    />
    <path
      fill="#616160"
      d="M6 7.993V6.744c0-1.554.977-2.19 2.174-1.412l.964.628.964.627c1.197.778 1.197 2.048 0 2.826l-.964.627-.964.628C6.977 11.445 6 10.81 6 9.256V7.993Z"
    />
  </svg>
)
const Memo = memo(VideoIconComponent)
export default Memo
