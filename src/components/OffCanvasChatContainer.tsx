import React from 'react';
import { Box } from '@mui/material';
import { useOffCanvasChat } from '../Context/OffCanvasChatContext';
import OffCanvasChatWindow from './OffCanvasChatWindow';

const OffCanvasChatContainer: React.FC = () => {
  const { activeChats } = useOffCanvasChat();

  if (activeChats.length === 0) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        right: 16,
        zIndex: 1300,
        display: 'flex',
        alignItems: 'flex-end', // Align chat windows to the bottom
        gap: 1,
        maxWidth: 'calc(100vw - 32px)',
        overflowX: 'auto',
        overflowY: 'visible',
        paddingBottom: 0,
        scrollBehavior: 'smooth',
        // Ensure horizontal scrolling works
        flexWrap: 'nowrap',
        // Make container only as wide as needed
        width: 'fit-content',
        pointerEvents: 'none',
        // Custom scrollbar styling
        '&::-webkit-scrollbar': {
          height: 8,
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'rgba(0,0,0,0.1)',
          borderRadius: 4,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.3)',
          borderRadius: 4,
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
        },
      }}
    >
      {activeChats
        .sort((a, b) => a.position - b.position)
        .map((chat) => (
          <OffCanvasChatWindow key={chat.id} chat={chat} />
        ))
      }
    </Box>
  );
};

export default OffCanvasChatContainer;
