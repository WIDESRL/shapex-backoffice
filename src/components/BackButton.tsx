import React from 'react';
import { Box, Typography } from '@mui/material';
import ArrowBackIcon from '../icons/ArrowBackIcon';

interface BackButtonProps {
  onClick: () => void;
}

const styles = {
  backContainer: {
    display: 'flex',
    alignItems: 'center',
    mb: 3,
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7,
    },
  },
  backText: {
    fontSize: 20,
    color: '#616160',
    fontWeight: 400,
    ml: 0.5,
  },
};

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <Box sx={styles.backContainer} onClick={onClick}>
      <ArrowBackIcon style={{ width: 9, height: 16 }} />
      <Typography sx={styles.backText}>
        Indietro
      </Typography>
    </Box>
  );
};

export default BackButton;
