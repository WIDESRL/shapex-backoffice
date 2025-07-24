import React, { useEffect } from 'react';
import { Box, CssBaseline, useMediaQuery } from '@mui/material';

import { useAuth } from '../Context/AuthContext';
import AppRoutes from '../Routes';
import { useTheme } from '@mui/material/styles';
import SideDrawer from './SideDrawer';
import OffCanvasChatContainer from '../components/OffCanvasChatContainer';
const drawerWidth = 240;
const miniDrawerWidth = 65;

const MainLayout: React.FC = () => {
  const { isAuth } = useAuth();
  const [_, setDrawerOpen] = React.useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Detect screen width below 'sm' breakpoint

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  // Automatically close the drawer when the screen width decreases
  useEffect(() => {
    if (isSmallScreen) {
      setDrawerOpen(false);
    }
  }, [isSmallScreen]);


  // Drawer state for mini/expanded on small screens
  const [miniDrawer, setMiniDrawer] = React.useState(isSmallScreen);

  useEffect(() => {
    setMiniDrawer(isSmallScreen); // Mini by default on small screens
  }, [isSmallScreen]);


  // Remove hover handlers from the main content area to prevent rapid toggling
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />

      {isAuth && (
        <SideDrawer
          isSmallScreen={isSmallScreen}
          drawerOpen={!miniDrawer}
          miniDrawer={miniDrawer}
          toggleDrawer={toggleDrawer}
          toggleMiniDrawer={setMiniDrawer}
          drawerWidth={drawerWidth}
          miniDrawerWidth={miniDrawerWidth}
        />
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3, 
          transition: 'margin-left 0.3s cubic-bezier(.4,0,.2,1)',
        }}
      >
        <AppRoutes />
      </Box>
      
      {/* Off-canvas chat windows */}
      <OffCanvasChatContainer />
    </Box>
  );
};

export default MainLayout;