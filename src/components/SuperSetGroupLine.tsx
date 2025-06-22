import React from 'react';

interface MultiRowBraceProps {
  rows?: number;
  rowHeight?: number;
  strokeColor?: string;
  strokeWidth?: number;
}

const SuperSetGroupLine: React.FC<MultiRowBraceProps> = ({
  rows = 1,
  rowHeight = 28,
  strokeColor = '#EDB528',
  strokeWidth = 5,
}) => {
  const width = 11;
  const height = rows * rowHeight;
  const bracketLength = 8; // length of the top/bottom horizontal lines

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Top horizontal (right side) */}
      <line
        x1={0}
        y1={strokeWidth / 2}
        x2={bracketLength}
        y2={strokeWidth / 2}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Vertical (right side) */}
      <line
        x1={0}
        y1={strokeWidth / 2}
        x2={0}
        y2={height - strokeWidth / 2}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Bottom horizontal (right side) */}
      <line
        x1={0}
        y1={height - strokeWidth / 2}
        x2={bracketLength}
        y2={height - strokeWidth / 2}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default SuperSetGroupLine;