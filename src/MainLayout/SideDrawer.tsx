import React, { useState } from 'react';
import {
  Drawer,
  Toolbar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Collapse,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Import SVGs as React components
import ShapexLogo from '../icons/Shapex';
import DashboardIcon from '../icons/Dashboard';
import SubscriptionsIcon from '../icons/Subscriptions';
import ClientIcon from '../icons/Client';
import TrainingIcon from '../icons/Training';
import ChatIcon from '../icons/Chat';
import BannersIcon from '../icons/Banners';
import LogoutIcon from '../icons/Logout';
import { useAuth } from '../Context/AuthContext';

// Replace useSideDrawerStyles with a StyleSheet-like helper

const menuColor = '#EDB528';
const hoverBg = 'rgba(237,181,40,0.08)';
const submenuHoverBg = 'rgba(237,181,40,0.12)';

// Simple StyleSheet.create helper for JS objects
const StyleSheet = {
  create: <T extends { [key: string]: React.CSSProperties }>(styles: T) => styles,
};

const ActiveMenuIndicator: React.FC = () => (
  <Box style={styles.activeMenuIndicator} />
);

interface SideDrawerProps {
  isSmallScreen: boolean;
  drawerOpen: boolean;
  miniDrawer: boolean;
  toggleDrawer: (open: boolean) => void;
  toggleMiniDrawer: (mini: boolean) => void;
  drawerWidth: number;
  miniDrawerWidth: number;
}

// Add enums for menu and submenu names
export enum MainMenu {
  Dashboard = 'Dashboard',
  Abbonamenti = 'Abbonamenti',
  Clienti = 'Clienti',
  Allenamento = 'Allenamento',
  Chat = 'Chat',
  Banners = 'Banners pubblicitari',
  Logout = 'Logout',
}

export enum ClientiSubMenu {
  Anagrafica = 'Anagrafica',
  Allenamenti = 'Allenamenti',
  Diario = 'Diario',
  Alimentazione = 'Alimentazione',
  Altro = 'Altro',
}

const SideDrawer: React.FC<SideDrawerProps> = ({
  isSmallScreen,
  drawerOpen,
  miniDrawer,
  toggleDrawer,
  toggleMiniDrawer,
  drawerWidth,
  miniDrawerWidth,
}) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>('clients');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const currentWidth = miniDrawer ? miniDrawerWidth : drawerWidth;

  const handleToggleSubmenu = (menu: string) => {
    setOpenSubmenu((prev) => (prev === menu ? null : menu));
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isSmallScreen) toggleDrawer(false);
  };

  return (
    <Drawer
      variant="permanent"
      open={drawerOpen}
      sx={{
        width: currentWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: currentWidth,
          ...styles.drawerPaper,
        },
      }}
      PaperProps={{
        onMouseEnter: () => isSmallScreen && miniDrawer && toggleMiniDrawer(false),
        onMouseLeave: () => isSmallScreen && !miniDrawer && toggleMiniDrawer(true),
      }}
    >
      {/* Logo */}
      <Toolbar style={styles.toolbar}>
        {!miniDrawer && <ShapexLogo style={{ width: 170, height: 40, margin: '0 auto' }} />}
      </Toolbar>

      <List sx={{ pt: 2 }}>
        {/* Dashboard */}
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            style={styles.listItemButton}
            onClick={() => handleNavigation('/dashboard')}
            sx={{ '&:hover': { bgcolor: hoverBg } }}
          >
            <DashboardIcon style={styles.icon} />
            <ListItemText
              primary={MainMenu.Dashboard}
              style={styles.listItemText}
            />
          </ListItemButton>
        </ListItem>

        {/* Abbonamenti */}
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            style={styles.listItemButton}
            onClick={() => handleNavigation('/subscriptions')}
            sx={{ '&:hover': { bgcolor: hoverBg } }}
          >
            <SubscriptionsIcon style={styles.icon} />
            <ListItemText
              primary={MainMenu.Abbonamenti}
              style={styles.listItemText}
            />
          </ListItemButton>
        </ListItem>

        {/* Clienti with submenu */}
        <ListItem disablePadding sx={{ mb: 0 }}>
          <ListItemButton
            style={{
              ...styles.listItemButton,
              ...(openSubmenu === 'clients' ? styles.activeListItemButton : {}),
            }}
            onClick={() => handleToggleSubmenu('clients')}
            sx={{ '&:hover': { bgcolor: hoverBg } }}
          >
            <ClientIcon
              style={{
                ...styles.icon,
                ...(openSubmenu === 'clients'
                  ? { filter: 'brightness(0) saturate(100%) invert(73%) sepia(74%) saturate(749%) hue-rotate(352deg) brightness(92%) contrast(95%)' }
                  : {}),
              }}
            />
            <ListItemText
              primary={MainMenu.Clienti}
              style={openSubmenu === 'clients' ? styles.activeListItemText : styles.listItemText}
              sx={{ mr: 15 }}
            />
            {openSubmenu === 'clients' ? (
              <ExpandLess sx={{ color: menuColor }} />
            ) : (
              <ExpandMore sx={{ color: '#fff' }} />
            )}
            {openSubmenu === 'clients' && !miniDrawer && <ActiveMenuIndicator />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openSubmenu === 'clients'} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 9 }}>
            {Object.values(ClientiSubMenu).map((label) => (
              <ListItem disablePadding key={label}>
                <ListItemButton
                  sx={{
                    py: 0.7,
                    color: menuColor,
                    fontWeight: 400,
                    fontSize: 16,
                    '&:hover': { bgcolor: submenuHoverBg },
                  }}
                  onClick={() => { /* handle submenu navigation */ }}
                >
                  <ListItemText
                    primary={label}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>

        {/* Allenamento with submenu */}
        <ListItem disablePadding sx={{ mb: 0 }}>
          <ListItemButton
            style={styles.listItemButton}
            onClick={() => handleToggleSubmenu('training')}
            sx={{ position: 'relative', '&:hover': { bgcolor: hoverBg } }}
          >
            <TrainingIcon style={styles.icon} />
            <ListItemText
              primary={MainMenu.Allenamento}
              style={styles.listItemText}
              sx={{ mr: 15 }}
            />
            {openSubmenu === 'training' ? (
              <ExpandLess sx={{ color: menuColor }} />
            ) : (
              <ExpandMore sx={{ color: '#fff' }} />
            )}
            {openSubmenu === 'training' && !miniDrawer && <ActiveMenuIndicator />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openSubmenu === 'training'} timeout="auto" unmountOnExit>
          {/* Add submenu items for Allenamento if needed */}
        </Collapse>

        {/* Chat */}
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            style={styles.listItemButton}
            onClick={() => handleNavigation('/chat')}
            sx={{ '&:hover': { bgcolor: hoverBg } }}
          >
            <ChatIcon style={styles.icon} />
            <ListItemText
              primary={MainMenu.Chat}
              style={styles.listItemText}
            />
          </ListItemButton>
        </ListItem>

        {/* Banners pubblicitari */}
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            style={styles.listItemButton}
            onClick={() => handleNavigation('/banners')}
            sx={{ '&:hover': { bgcolor: hoverBg } }}
          >
            <BannersIcon style={styles.icon} />
            <ListItemText
              primary={MainMenu.Banners}
              style={styles.listItemText}
            />
          </ListItemButton>
        </ListItem>
      </List>

      {/* Divider and Logout at the bottom */}
      <Box sx={{ flexGrow: 1 }} />
      <Divider style={styles.divider} />
      <List sx={{ mb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            style={styles.listItemButton}
            onClick={logout}
            sx={{ '&:hover': { bgcolor: hoverBg } }}
          >
            <LogoutIcon style={styles.icon} />
            <ListItemText
              primary={MainMenu.Logout}
              style={styles.listItemText}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default SideDrawer;

const styles = StyleSheet.create({
  drawerPaper: {
    boxSizing: 'border-box',
    overflowX: 'hidden',
    backgroundColor: '#616160',
    color: '#fff',
    borderRight: 0,
    paddingLeft: 0,
    paddingTop: 0,
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    }
  },
  toolbar: {
    minHeight: 88,
    paddingLeft: 0,
    paddingRight: 0,
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 40,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    width: 22,
    height: 22,
    minWidth: 22,
    minHeight: 22,
    marginRight: 18,
  },
  activeMenuIndicator: {
    position: 'absolute',
    right: 0,
    top: 10,
    width: 6,
    height: 40,
    backgroundColor: menuColor,
    borderRadius: 2,
  },
  listItemButton: {
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 9.6,
    paddingBottom: 9.6,
    borderRadius: 0,
    position: 'relative',
  },
  activeListItemButton: {
    color: menuColor,
  },
  listItemText: {
    color: '#fff',
  },
  activeListItemText: {
    color: menuColor,
    marginRight: 120,
  },
  divider: {
    backgroundColor: '#7B7B7B',
    marginTop: 8,
    marginLeft: 32,
    marginRight: 48,
  },
});