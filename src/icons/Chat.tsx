import { SVGProps, memo } from "react"

interface ChatIconProps extends SVGProps<SVGSVGElement> {
  strokeColor?: string;
}

const SvgComponent = ({ strokeColor = '#fff', ...props }: ChatIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={23}
    height={23}
    fill="none"
    {...props}
  >
    <path
      stroke={strokeColor}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M17.753 10.215v4.193c0 .273-.01.535-.042.786-.241 2.83-1.908 4.235-4.98 4.235h-.42a.844.844 0 0 0-.67.336l-1.258 1.677c-.556.744-1.457.744-2.013 0l-1.258-1.677a.968.968 0 0 0-.671-.336h-.42C2.678 19.43 1 18.601 1 14.408v-4.193c0-3.072 1.415-4.739 4.235-4.98.252-.031.514-.042.787-.042h6.709c3.344 0 5.022 1.678 5.022 5.022Z"
    />
    <path
      stroke={strokeColor}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M21.945 6.021v4.193c0 3.082-1.415 4.739-4.235 4.98.031-.252.042-.514.042-.786v-4.194c0-3.344-1.678-5.02-5.022-5.02H6.02c-.272 0-.534.01-.786.041C5.475 2.415 7.142 1 10.214 1h6.71c3.344 0 5.021 1.677 5.021 5.021Z"
    />
    <path
      stroke={strokeColor}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.052 12.794h.01M9.382 12.794h.01M5.713 12.794h.01"
    />
  </svg>
)
const Memo = memo(SvgComponent)
export default Memo
