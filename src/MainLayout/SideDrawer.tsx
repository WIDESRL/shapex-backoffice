import React, { useState } from 'react';
import {
  Drawer,
  Toolbar,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Collapse,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router

interface SideDrawerProps {
  isSmallScreen: boolean;
  drawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  drawerWidth: number;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ isSmallScreen, drawerOpen, toggleDrawer, drawerWidth }) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleToggleSubmenu = (menu: string) => {
    setOpenSubmenu((prev) => (prev === menu ? null : menu));
  };

  const handleNavigation = (path: string) => {
    navigate(path); // Navigate to the specified path
    if (isSmallScreen) toggleDrawer(false); // Close the drawer on small screens
  };

  return (
    <Drawer
      variant={isSmallScreen ? 'temporary' : 'persistent'}
      anchor="left"
      open={drawerOpen}
      onClose={() => toggleDrawer(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ width: drawerWidth }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          Menu
        </Typography>
        <Divider />
        <List>
          {/* Dashboard */}
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/dashboard')}>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          {/* Subscriptions with Submenu */}
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleToggleSubmenu('subscriptions')}>
              <ListItemText primary="Subscriptions" />
              {openSubmenu === 'subscriptions' ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openSubmenu === 'subscriptions'} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem disablePadding>
                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('/subscriptions/active')}>
                  <ListItemText primary="Active Subscriptions" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('/subscriptions/expired')}>
                  <ListItemText primary="Expired Subscriptions" />
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>

          {/* Settings */}
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/settings')}>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default SideDrawer;