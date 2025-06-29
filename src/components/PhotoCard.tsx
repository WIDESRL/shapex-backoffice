import React from 'react';
import { Box, Typography } from '@mui/material';
import ImageCustom from './ImageCustom';

interface PhotoCardProps {
  imageUrl: string | null;
  label?: string;
  onClick?: () => void;
  width?: number;
  height?: number;
}

const styles = {
  imageCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 2,
    p: 2,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    mb: 2,
    cursor: 'pointer',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#d0d0d0',
    borderRadius: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
};

const PhotoCard: React.FC<PhotoCardProps> = ({
  imageUrl,
  label,
  onClick,
  height = 300,
}) => {
  const handleClick = () => {
    if (imageUrl && onClick) {
      onClick();
    }
  };

  return (
    <Box sx={styles.imageCard}>
      <Box 
        sx={{
          ...styles.imageContainer,
          height,
          cursor: imageUrl ? 'pointer' : 'default',
        }}
        onClick={handleClick}
      >
        {imageUrl ? (
          <ImageCustom
            src={imageUrl}
            alt="Photo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: 8,
            }}
            spinnerSize={40}
          />
        ) : (
          <Box sx={styles.placeholderImage} />
        )}
      </Box>
      {label && (
        <Typography sx={styles.label}>
          {label}
        </Typography>
      )}
    </Box>
  );
};

export default PhotoCard;
