import React from 'react';
import { Button } from '@mui/material';

interface TabButtonProps {
  title: string;
  onClick: () => void;
  active: boolean;
}

const styles = {
  tabButton: {
    textTransform: 'none',
    fontSize: 14,
    fontWeight: 400,
    color: '#616160',
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: 2,
    padding: '8px 20px',
    minHeight: 36,
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },
  activeTabButton: {
    backgroundColor: '#616160',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#616160',
    },
  },
};

const TabButton: React.FC<TabButtonProps> = ({ title, onClick, active }) => {
  return (
    <Button
      sx={{
        ...styles.tabButton,
        ...(active ? styles.activeTabButton : {}),
      }}
      onClick={onClick}
    >
      {title}
    </Button>
  );
};

export default TabButton;
