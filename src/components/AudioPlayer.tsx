import React from 'react';
import { Box } from '@mui/material';

interface AudioPlayerProps {
  src: string;
  alt?: string;
  style?: React.CSSProperties;
  minWidth?: number;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  src, 
  alt = 'Audio', 
  style,
  minWidth = 250
}) => {
  return (
    <Box
      component="audio"
      src={src}
      controls
      controlsList="nodownload"
      preload="metadata"
      style={{
        width: '100%',
        minWidth,
        maxWidth: '100%',
        borderRadius: 8,
        ...style,
      }}
      sx={{
        '&:focus': {
          outline: 'none',
        },
      }}
    >
      {alt}
    </Box>
  );
};

export default AudioPlayer;
