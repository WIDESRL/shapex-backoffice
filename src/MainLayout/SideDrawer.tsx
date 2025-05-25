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
import { useNavigate, useLocation } from 'react-router-dom';

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
// Use this filter for active icon color (yellow)
const activeIconFilter =
  'brightness(0) saturate(100%) invert(73%) sepia(74%) saturate(749%) hue-rotate(352deg) brightness(92%) contrast(95%)';

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
  Dashboard = 'dashboard',
  Abbonamenti = 'subscriptions',
  Clienti = 'clients',
  Allenamento = 'training',
  Chat = 'chat',
  Banners = 'banners',
  Logout = 'logout',
}

export enum ClientiSubMenu {
  Anagrafica = 'Anagrafica',
  Allenamenti = 'Allenamenti',
  Diario = 'Diario',
  Alimentazione = 'Alimentazione',
  Altro = 'Altro',
}

export enum TrainingSubMenu {
  Test1 = 'Test Submenu 1',
  Test2 = 'Test Submenu 2',
}

// Add enum for navigation paths
export enum MenuPath {
  Dashboard = '/dashboard',
  Subscriptions = '/subscriptions',
  Clients = '/clients',
  ClientsAnagrafica = '/clients/anagrafica',
  ClientsAllenamenti = '/clients/allenamenti',
  ClientsDiario = '/clients/diario',
  ClientsAlimentazione = '/clients/alimentazione',
  ClientsAltro = '/clients/altro',
  Training = '/training',
  TrainingTest1 = '/training/test1',
  TrainingTest2 = '/training/test2',
  Chat = '/chat',
  Banners = '/banners',
}

export enum ActiveMenu {
  Dashboard = MainMenu.Dashboard,
  Subscriptions = MainMenu.Abbonamenti,
  Clients = MainMenu.Clienti,
  Training = MainMenu.Allenamento,
  Chat = MainMenu.Chat,
  Banners = MainMenu.Banners,
  None = '',
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
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Memoize currentWidth calculation
  const currentWidth = React.useMemo(
    () => (miniDrawer ? miniDrawerWidth : drawerWidth),
    [miniDrawer, miniDrawerWidth, drawerWidth]
  );

  // Memoize activeMenu and activeSubmenu calculations
  const { activeMenu, activeSubmenu } = React.useMemo(() => {
    const path = location.pathname;
    let activeMenu: ActiveMenu = ActiveMenu.None;
    let activeSubmenu: string | null = null;

    if (path.startsWith(MenuPath.Dashboard)) {
      activeMenu = ActiveMenu.Dashboard;
    } else if (path.startsWith(MenuPath.Subscriptions)) {
      activeMenu = ActiveMenu.Subscriptions;
    } else if (path.startsWith(MenuPath.Clients)) {
      activeMenu = ActiveMenu.Clients;
      if (path.startsWith(MenuPath.ClientsAnagrafica)) activeSubmenu = ClientiSubMenu.Anagrafica;
      else if (path.startsWith(MenuPath.ClientsAllenamenti)) activeSubmenu = ClientiSubMenu.Allenamenti;
      else if (path.startsWith(MenuPath.ClientsDiario)) activeSubmenu = ClientiSubMenu.Diario;
      else if (path.startsWith(MenuPath.ClientsAlimentazione)) activeSubmenu = ClientiSubMenu.Alimentazione;
      else if (path.startsWith(MenuPath.ClientsAltro)) activeSubmenu = ClientiSubMenu.Altro;
    } else if (path.startsWith(MenuPath.Training)) {
      activeMenu = ActiveMenu.Training;
      if (path.startsWith(MenuPath.TrainingTest1)) activeSubmenu = TrainingSubMenu.Test1;
      else if (path.startsWith(MenuPath.TrainingTest2)) activeSubmenu = TrainingSubMenu.Test2;
    } else if (path.startsWith(MenuPath.Chat)) {
      activeMenu = ActiveMenu.Chat;
    } else if (path.startsWith(MenuPath.Banners)) {
      activeMenu = ActiveMenu.Banners;
    }

    return { activeMenu, activeSubmenu };
  }, [location.pathname]);

  // Automatically open submenu if route matches
  React.useEffect(() => {
    if (activeMenu === ActiveMenu.Clients) {
      setOpenSubmenu(ActiveMenu.Clients);
    } else if (activeMenu === ActiveMenu.Training) {
      setOpenSubmenu(ActiveMenu.Training);
    } else {
      setOpenSubmenu(null);
    }
  }, [activeMenu]);

  const handleToggleSubmenu = (menu: string) => {
    setOpenSubmenu((prev) => (prev === menu ? null : menu));
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isSmallScreen) toggleDrawer(false);
  };

  // Helper for submenu navigation
  const handleClientSubmenuNavigation = (submenu: string) => {
    switch (submenu) {
      case ClientiSubMenu.Anagrafica:
        handleNavigation(MenuPath.ClientsAnagrafica);
        break;
      case ClientiSubMenu.Allenamenti:
        handleNavigation(MenuPath.ClientsAllenamenti);
        break;
      case ClientiSubMenu.Diario:
        handleNavigation(MenuPath.ClientsDiario);
        break;
      case ClientiSubMenu.Alimentazione:
        handleNavigation(MenuPath.ClientsAlimentazione);
        break;
      case ClientiSubMenu.Altro:
        handleNavigation(MenuPath.ClientsAltro);
        break;
      default:
        handleNavigation(MenuPath.Clients);
    }
  };

  // Helper for training submenu navigation
  const handleTrainingSubmenuNavigation = (submenu: string) => {
    switch (submenu) {
      case TrainingSubMenu.Test1:
        handleNavigation(MenuPath.TrainingTest1);
        break;
      case TrainingSubMenu.Test2:
        handleNavigation(MenuPath.TrainingTest2);
        break;
      default:
        handleNavigation(MenuPath.Training);
    }
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
            style={{
              ...styles.listItemButton,
              color: activeMenu === ActiveMenu.Dashboard ? menuColor : undefined,
            }}
            onClick={() => handleNavigation(MenuPath.Dashboard)}
            sx={{ '&:hover': { bgcolor: hoverBg } }}
          >
            <DashboardIcon
              style={{
                ...styles.icon,
                color: activeMenu === ActiveMenu.Dashboard ? menuColor : undefined,
                filter: activeMenu === ActiveMenu.Dashboard ? activeIconFilter : undefined,
              }}
            />
            {!miniDrawer && (
              <ListItemText
                primary="Dashboard"
                style={{
                  ...styles.listItemText,
                  color: activeMenu === ActiveMenu.Dashboard ? menuColor : styles.listItemText.color,
                  fontWeight: activeMenu === ActiveMenu.Dashboard ? 600 : undefined,
                }}
              />
            )}
          </ListItemButton>
        </ListItem>
        {/* Abbonamenti */}
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            style={{
              ...styles.listItemButton,
              color: activeMenu === ActiveMenu.Subscriptions ? menuColor : undefined,
            }}
            onClick={() => handleNavigation(MenuPath.Subscriptions)}
            sx={{ '&:hover': { bgcolor: hoverBg } }}
          >
            <SubscriptionsIcon
              style={{
                ...styles.icon,
                color: activeMenu === ActiveMenu.Subscriptions ? menuColor : undefined,
                filter: activeMenu === ActiveMenu.Subscriptions ? activeIconFilter : undefined,
              }}
            />
            {!miniDrawer && (
              <ListItemText
                primary="Abbonamenti"
                style={{
                  ...styles.listItemText,
                  color: activeMenu === ActiveMenu.Subscriptions ? menuColor : styles.listItemText.color,
                  fontWeight: activeMenu === ActiveMenu.Subscriptions ? 600 : undefined,
                }}
              />
            )}
          </ListItemButton>
        </ListItem>
        {/* Clienti with submenu */}
        <ListItem disablePadding sx={{ mb: 0 }}>
          <ListItemButton
            style={{
              ...styles.listItemButton,
              color: activeMenu === ActiveMenu.Clients ? menuColor : undefined,
            }}
            onClick={() => handleToggleSubmenu(ActiveMenu.Clients)}
            sx={{ '&:hover': { bgcolor: hoverBg } }}
          >
            <ClientIcon
              style={{
                ...styles.icon,
                filter: activeMenu === ActiveMenu.Clients ? activeIconFilter : undefined,
                color: activeMenu === ActiveMenu.Clients ? menuColor : undefined,
              }}
            />
            {!miniDrawer && (
              <ListItemText
                primary="Clienti"
                style={{
                  ...styles.listItemText,
                  color: activeMenu === ActiveMenu.Clients ? menuColor : styles.listItemText.color,
                  fontWeight: activeMenu === ActiveMenu.Clients ? 600 : undefined,
                }}
                sx={{ mr: 15 }}
              />
            )}
            {openSubmenu === ActiveMenu.Clients ? (
              <ExpandLess sx={{ color: menuColor }} />
            ) : (
              <ExpandMore sx={{ color: '#fff' }} />
            )}
            {openSubmenu === ActiveMenu.Clients && !miniDrawer && <ActiveMenuIndicator />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openSubmenu === ActiveMenu.Clients} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 9 }}>
            {Object.values(ClientiSubMenu).map((label) => (
              <ListItem disablePadding key={label}>
                <ListItemButton
                  sx={{
                    py: 0.7,
                    color: activeSubmenu === label ? menuColor : '#fff',
                    fontWeight: activeSubmenu === label ? 700 : 400,
                    fontSize: 16,
                    '&:hover': { bgcolor: submenuHoverBg },
                  }}
                  onClick={() => handleClientSubmenuNavigation(label)}
                >
                  <ListItemText
                    primary={label}
                    sx={{
                      color: activeSubmenu === label ? menuColor : '#fff',
                      fontWeight: activeSubmenu === label ? 700 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
        {/* Allenamento with submenu */}
        <ListItem disablePadding sx={{ mb: 0 }}>
          <ListItemButton
            style={{
              ...styles.listItemButton,
              color: activeMenu === ActiveMenu.Training ? menuColor : undefined,
            }}
            onClick={() => handleToggleSubmenu(ActiveMenu.Training)}
            sx={{ position: 'relative', '&:hover': { bgcolor: hoverBg } }}
          >
            <TrainingIcon
              style={{
                ...styles.icon,
                color: activeMenu === ActiveMenu.Training ? menuColor : undefined,
                filter: activeMenu === ActiveMenu.Training ? activeIconFilter : undefined,
              }}
            />
            {!miniDrawer && (
              <ListItemText
                primary="Allenamento"
                style={{
                  ...styles.listItemText,
                  color: activeMenu === ActiveMenu.Training ? menuColor : styles.listItemText.color,
                  fontWeight: activeMenu === ActiveMenu.Training ? 600 : undefined,
                }}
                sx={{ mr: 15 }}
              />
            )}
            {openSubmenu === ActiveMenu.Training ? (
              <ExpandLess sx={{ color: menuColor }} />
            ) : (
              <ExpandMore sx={{ color: '#fff' }} />
            )}
            {openSubmenu === ActiveMenu.Training && !miniDrawer && <ActiveMenuIndicator />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openSubmenu === ActiveMenu.Training} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 9 }}>
            {Object.values(TrainingSubMenu).map((label) => (
              <ListItem disablePadding key={label}>
                <ListItemButton
                  sx={{
                    py: 0.7,
                    color: activeSubmenu === label ? menuColor : '#fff',
                    fontWeight: activeSubmenu === label ? 700 : 400,
                    fontSize: 16,
                    '&:hover': { bgcolor: submenuHoverBg },
                  }}
                  onClick={() => handleTrainingSubmenuNavigation(label)}
                >
                  <ListItemText
                    primary={label}
                    sx={{
                      color: activeSubmenu === label ? menuColor : '#fff',
                      fontWeight: activeSubmenu === label ? 700 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
        {/* Chat */}
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            style={{
              ...styles.listItemButton,
              color: activeMenu === ActiveMenu.Chat ? menuColor : undefined,
            }}
            onClick={() => handleNavigation(MenuPath.Chat)}
            sx={{ '&:hover': { bgcolor: hoverBg } }}
          >
            <ChatIcon
              style={{
                ...styles.icon,
                color: activeMenu === ActiveMenu.Chat ? menuColor : undefined,
                filter: activeMenu === ActiveMenu.Chat ? activeIconFilter : undefined,
              }}
            />
            {!miniDrawer && (
              <ListItemText
                primary="Chat"
                style={{
                  ...styles.listItemText,
                  color: activeMenu === ActiveMenu.Chat ? menuColor : styles.listItemText.color,
                  fontWeight: activeMenu === ActiveMenu.Chat ? 600 : undefined,
                }}
              />
            )}
          </ListItemButton>
        </ListItem>
        {/* Banners pubblicitari */}
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            style={{
              ...styles.listItemButton,
              color: activeMenu === ActiveMenu.Banners ? menuColor : undefined,
            }}
            onClick={() => handleNavigation(MenuPath.Banners)}
            sx={{ '&:hover': { bgcolor: hoverBg } }}
          >
            <BannersIcon
              style={{
                ...styles.icon,
                color: activeMenu === ActiveMenu.Banners ? menuColor : undefined,
                filter: activeMenu === ActiveMenu.Banners ? activeIconFilter : undefined,
              }}
            />
            {!miniDrawer && (
              <ListItemText
                primary="Banners pubblicitari"
                style={{
                  ...styles.listItemText,
                  color: activeMenu === ActiveMenu.Banners ? menuColor : styles.listItemText.color,
                  fontWeight: activeMenu === ActiveMenu.Banners ? 600 : undefined,
                }}
              />
            )}
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