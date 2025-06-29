import * as React from "react";
import { SVGProps, memo } from "react";

const DiarioIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={26}
    height={24}
    fill="none"
    {...props}
  >
    <path
      stroke="#616160"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M25 3.366v14.222c0 1.132-.936 2.192-2.088 2.334l-.396.047c-2.616.341-6.648 1.65-8.952 2.898-.312.177-.828.177-1.152 0l-.048-.023c-2.304-1.237-6.324-2.534-8.928-2.875l-.348-.047C1.936 19.78 1 18.72 1 17.588V3.354C1 1.952 2.164.89 3.592 1.009c2.52.2 6.336 1.45 8.472 2.757l.3.177c.348.212.924.212 1.272 0l.204-.13c.756-.46 1.716-.919 2.76-1.331V7.29L19 5.722l2.4 1.568V1.139c.324-.06.636-.095.924-.118h.072C23.824.903 25 1.95 25 3.366ZM13 4v18"
    />
    <path
      stroke="#616160"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M21.445 1.297v5.778L19 5.47l-2.444 1.604V2.63c1.31-.597 3.659-1.103 4.889-1.333Z"
    />
  </svg>
);

export default memo(DiarioIcon);
