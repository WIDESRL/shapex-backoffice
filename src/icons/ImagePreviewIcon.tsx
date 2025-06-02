import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

const ImagePreviewIcon: React.FC<SvgIconProps & { colorOverride?: string }> = ({ colorOverride, ...props }) => (
  <SvgIcon {...props} style={{ fill: colorOverride || props.style?.fill }} viewBox="0 0 24 24">
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-2 0H5V5h14v14zm-8-3l2.03 2.71 2.97-3.87L19 19H5l4-5z" />
  </SvgIcon>
);

export default ImagePreviewIcon;
