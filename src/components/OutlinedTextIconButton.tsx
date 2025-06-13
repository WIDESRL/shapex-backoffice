import React from 'react';
import { Button, CircularProgress, Box } from '@mui/material';

interface OutlinedTextIconButtonProps {
  text: React.ReactNode;
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  sx?: object;
}

const OutlinedTextIconButton: React.FC<OutlinedTextIconButtonProps> = ({ text, icon, onClick, disabled, loading, sx }) => {
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      disabled={disabled || loading}
      sx={{
        borderRadius: 2,
        fontWeight: 500,
        color: '#616160',
        borderColor: '#bdbdbd',
        background: 'transparent',
        fontFamily: 'Montserrat, sans-serif',
        fontSize: 20,
        boxShadow: 0,
        textTransform: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        minWidth: 0,
        px: 2.5,
        py: 1.2,
        '&:hover': { background: '#f5f5f5', borderColor: '#bdbdbd' },
        ...sx,
      }}
    >
      <Box sx={{ flex: 1, textAlign: 'left', pr: 1 }}>{text}</Box>
      {loading ? (
        <CircularProgress size={22} sx={{ ml: 1 }} />
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>{icon}</Box>
      )}
    </Button>
  );
};

export default OutlinedTextIconButton;
