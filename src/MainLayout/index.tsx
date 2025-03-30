import React, { useEffect } from 'react';
import { Box, Toolbar, CssBaseline, useMediaQuery } from '@mui/material';

import { useAuth } from '../Context/AuthContext';
import AppRoutes from '../Routes';
import { useTheme } from '@mui/material/styles';
import TopBar from './TopBar';
import SideDrawer
 from './SideDrawer';
const drawerWidth = 240;

const MainLayout: React.FC = () => {
  const { isAuth, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Detect screen width below 'sm' breakpoint

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  // Automatically close the drawer when the screen width decreases
  useEffect(() => {
    if (isSmallScreen) {
      setDrawerOpen(false);
    }
  }, [isSmallScreen]);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />

      {/* Topbar */}
      {isAuth && (
        <TopBar
            isSmallScreen={isSmallScreen}
            drawerOpen={drawerOpen}
            toggleDrawer={toggleDrawer}
            handleMenuOpen={handleMenuOpen}
            handleMenuClose={handleMenuClose}
            anchorEl={anchorEl}
            logout={logout}
            drawerWidth={drawerWidth}
            theme={theme}
        />
      )}

      {/* Left Drawer */}
      {isAuth && (
       <SideDrawer
          isSmallScreen={isSmallScreen}
          drawerOpen={drawerOpen}
          toggleDrawer={toggleDrawer}
          drawerWidth={drawerWidth}
        />
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: isSmallScreen ? 0 : drawerOpen ? `${drawerWidth}px` : 0,
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Toolbar />
        <AppRoutes />
      </Box>
    </Box>
  );
};

export default MainLayout;