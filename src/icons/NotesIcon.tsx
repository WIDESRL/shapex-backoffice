
import { SVGProps, memo } from "react"
const NotesIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M11.28 1H4.72C2.432 1 1 2.619 1 4.91v6.18C1 13.382 2.426 15 4.72 15h6.559C13.573 15 15 13.381 15 11.09V4.91C15 2.618 13.573 1 11.28 1Z"
      clipRule="evenodd"
    />
    <path
      stroke="#616160"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.996 11.027V8M7.992 5.128h.007"
    />
  </svg>
)
const Memo = memo(NotesIcon)
export default Memo
