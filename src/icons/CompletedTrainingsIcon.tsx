import { SVGProps, memo } from "react";
const CompletedTrainingsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={20}
    fill="none"
    viewBox="0 0 18 22"
    {...props}
  >
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M1 10.02v4.97c0 1.82 0 1.82 1.72 2.98l4.73 2.73c.71.41 1.87.41 2.58 0l4.73-2.73c1.72-1.16 1.72-1.16 1.72-2.98v-4.97c0-1.82 0-1.82-1.72-2.98l-4.73-2.73c-.71-.41-1.87-.41-2.58 0L2.72 7.04C1 8.2 1 8.2 1 10.02Z"
    />
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M14.24 6.63V4c0-2-1-3-3-3h-5c-2 0-3 1-3 3v2.56M9.37 9.99l.57.89c.09.14.29.28.44.32l1.02.26c.63.16.8.7.39 1.2l-.67.81c-.1.13-.18.36-.17.52l.06 1.05c.04.65-.42.98-1.02.74l-.98-.39a.863.863 0 0 0-.55 0l-.98.39c-.6.24-1.06-.1-1.02-.74l.06-1.05c.01-.16-.07-.4-.17-.52l-.67-.81c-.41-.5-.24-1.04.39-1.2l1.02-.26c.16-.04.36-.19.44-.32l.57-.89c.36-.54.92-.54 1.27 0Z"
    />
  </svg>
);
const Memo = memo(CompletedTrainingsIcon);
export default Memo;
