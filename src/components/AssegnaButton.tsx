import React from 'react';
import { Button } from '@mui/material';
import AssignIcon from '../icons/AssignIcon';

interface AssegnaButtonProps {
  onClick: () => void;
  size?: 'small' | 'medium';
}

const styles = {
  assignButton: {
    backgroundColor: '#EDB528',
    color: '#fff',
    textTransform: 'none',
    borderRadius: 2,
    padding: '8px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    '&:hover': {
      backgroundColor: '#d4a226',
    },
  },
  assignButtonSmall: {
    backgroundColor: '#EDB528',
    color: '#fff',
    textTransform: 'none',
    borderRadius: 1,
    padding: '4px 12px',
    fontSize: 12,
    minWidth: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
    '&:hover': {
      backgroundColor: '#d4a226',
    },
  },
  assignIcon: {
    marginRight: 5
  }
};

const AssegnaButton: React.FC<AssegnaButtonProps> = ({ onClick, size = 'medium' }) => {
  return (
    <Button
      sx={size === 'small' ? styles.assignButtonSmall : styles.assignButton}
      onClick={onClick}
    >
      <AssignIcon style={styles.assignIcon} />
      Assegna
    </Button>
  );
};

export default AssegnaButton;
