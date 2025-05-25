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
      d="M3.21 5.655A2.445 2.445 0 0 1 5.654 3.21h1.112c.646 0 1.264-.257 1.722-.71l.777-.779a2.445 2.445 0 0 1 3.458-.01l.001.001.01.01.778.777c.459.455 1.077.71 1.722.71h1.111a2.445 2.445 0 0 1 2.445 2.446v1.11c0 .645.255 1.264.71 1.723l.779.778c.957.952.963 2.5.01 3.458h0l-.01.01-.779.779a2.438 2.438 0 0 0-.71 1.72v1.113a2.444 2.444 0 0 1-2.444 2.444h0-1.114c-.645 0-1.265.256-1.722.71l-.778.778a2.444 2.444 0 0 1-3.459.01l-.01-.01-.777-.777a2.446 2.446 0 0 0-1.722-.711h-1.11a2.444 2.444 0 0 1-2.444-2.444V15.23a2.44 2.44 0 0 0-.711-1.72l-.777-.779a2.443 2.443 0 0 1-.012-3.455l.002-.004.01-.01.777-.778a2.444 2.444 0 0 0 .711-1.723V5.655M8.223 13.778l5.555-5.555"
    />
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.696 13.7h.01M8.291 8.294h.01"
    />
  </svg>
)
const Memo = memo(SvgComponent)
export default Memo
