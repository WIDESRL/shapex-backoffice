import React from 'react';
import { Box } from '@mui/material';

interface VideoPlayerProps {
  src: string;
  alt?: string;
  style?: React.CSSProperties;
  maxWidth?: number;
  maxHeight?: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  src, 
  alt = 'Video', 
  style,
  maxWidth = 400,
  maxHeight = 300
}) => {
  return (
    <Box
      component="video"
      src={src}
      controls
      controlsList="nodownload"
      preload="metadata"
      style={{
        maxWidth,
        maxHeight,
        width: '100%',
        borderRadius: 8,
        ...style,
      }}
    >
      {alt}
    </Box>
  );
};

export default VideoPlayer;
