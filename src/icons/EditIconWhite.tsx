import { SVGProps, memo } from "react";
const EditIconWhite = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7.222 1.172H5.84C2.383 1.172 1 2.555 1 6.012v4.147C1 13.616 2.383 15 5.84 15h4.147c3.457 0 4.84-1.383 4.84-4.84V8.777"
    />
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M10.704 1.879 5.256 7.327a1.875 1.875 0 0 0-.456.912l-.297 2.081c-.11.754.422 1.28 1.175 1.175l2.081-.297c.29-.041.698-.249.913-.456l5.447-5.448c.94-.94 1.383-2.032 0-3.415-1.382-1.383-2.475-.94-3.415 0Z"
    />
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M9.926 2.66a4.94 4.94 0 0 0 3.415 3.415"
    />
  </svg>
);
const Memo = memo(EditIconWhite);
export default Memo;
