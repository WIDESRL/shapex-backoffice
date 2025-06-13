import React from 'react';

const RefreshIcon: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    style={style}
  >
    <path
      d="M17.65 6.35A7.95 7.95 0 0 0 12 4V1l-4 4 4 4V6c1.93 0 3.68.78 4.95 2.05A7 7 0 1 1 5 12H3a9 9 0 1 0 14.65-5.65z"
      fill="#EDB528"
    />
  </svg>
);

export default RefreshIcon;
