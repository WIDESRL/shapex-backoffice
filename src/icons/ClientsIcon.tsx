import { SVGProps, memo } from "react";
const ClientsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={23}
    height={18}
    fill="none"
    {...props}
  >
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17.718 7.885a2.979 2.979 0 0 0 2.56-2.943 2.978 2.978 0 0 0-2.492-2.938M19.624 11.36c1.4.209 2.376.699 2.376 1.709 0 .695-.46 1.146-1.203 1.43"
    />
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M11.501 11.787c-3.33 0-6.173.505-6.173 2.52 0 2.013 2.826 2.532 6.173 2.532 3.33 0 6.172-.5 6.172-2.515 0-2.016-2.825-2.537-6.172-2.537ZM11.501 8.912a3.956 3.956 0 1 0-3.956-3.956 3.94 3.94 0 0 0 3.927 3.956h.029Z"
      clipRule="evenodd"
    />
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M5.282 7.885a2.978 2.978 0 0 1-2.56-2.943 2.978 2.978 0 0 1 2.492-2.938M3.376 11.36c-1.4.209-2.376.699-2.376 1.709 0 .695.46 1.146 1.204 1.43"
    />
  </svg>
);
export default memo(ClientsIcon);
