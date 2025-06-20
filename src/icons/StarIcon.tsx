import { SVGProps, memo } from "react"
const StarIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={20}
    height={16}
    fill="none"
    {...props}
  >
    <path
      stroke="#616160"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m12.797 2.01 1.243 2.485c.167.344.616.67.995.74l2.247.37c1.436.238 1.77 1.278.74 2.317l-1.753 1.754c-.291.29-.459.863-.362 1.277l.503 2.167c.396 1.71-.52 2.379-2.027 1.48l-2.105-1.25c-.38-.23-1.014-.23-1.392 0L8.78 14.6c-1.506.89-2.423.23-2.026-1.48l.502-2.167c.097-.405-.07-.978-.361-1.277L5.142 7.922c-1.031-1.03-.696-2.07.74-2.317l2.246-.37c.379-.061.828-.396.996-.74l1.242-2.484c.66-1.348 1.753-1.348 2.431 0ZM6.286 1.826H1M3.643 14.16H1M1.881 7.992H1"
    />
  </svg>
)
const Memo = memo(StarIcon)
export default Memo
