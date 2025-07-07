import React, { useState } from "react";
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
  Tooltip,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ShapexLogo from "../icons/Shapex";
import DashboardIcon from "../icons/Dashboard";
import SubscriptionsIcon from "../icons/Subscriptions";
import ClientIcon from "../icons/Client";
import TrainingIcon from "../icons/Training";
import ChatIcon from "../icons/Chat";
import BannersIcon from "../icons/Banners";
import LogoutIcon from "../icons/Logout";
import SettingsIcon from "../icons/SettingsIcon";
import { useAuth } from "../Context/AuthContext";

const menuColor = "#EDB528";
const hoverBg = "rgba(237,181,40,0.08)";
const submenuHoverBg = "rgba(237,181,40,0.12)";
const activeIconFilter =
  "brightness(0) saturate(100%) invert(73%) sepia(74%) saturate(749%) hue-rotate(352deg) brightness(92%) contrast(95%)";

const StyleSheet = {
  create: <T extends { [key: string]: React.CSSProperties }>(styles: T) =>
    styles,
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
  Dashboard = "dashboard",
  Abbonamenti = "subscriptions",
  Clienti = "clients",
  Allenamento = "training",
  Chat = "chat",
  Banners = "banners",
  Settings = "settings",
  Logout = "logout",
}

export enum ClientiSubMenu {
  Anagrafica = "Anagrafica",
  Allenamenti = "Allenamenti",
  Diario = "Diario",
  Alimentazione = "Alimentazione",
  Altro = "Altro",
}

export enum TrainingSubMenu {
  Exercise = "Esercizio",
  TrainingProgram = "Programma di Allenamento",
  CompletedTraining = "Allenamenti Completati",
}

// Add enum for navigation paths
export enum MenuPath {
  Dashboard = "/dashboard",
  Subscriptions = "/subscriptions",
  Clients = "/clients",
  ClientsAnagrafica = "/clients/anagrafica",
  ClientsAllenamenti = "/clients/allenamenti",
  ClientsDiario = "/clients/diario",
  ClientsAlimentazione = "/clients/alimentazione",
  ClientsAltro = "/clients/altro",
  Training = "/training",
  TrainingExercise = "/training/exercise",
  TrainingProgram = "/training/training-program",
  CompletedTraining = "/training/completed-training",
  Chat = "/chat",
  Banners = "/banners",
  Settings = "/settings",
}

export enum ActiveMenu {
  Dashboard = MainMenu.Dashboard,
  Subscriptions = MainMenu.Abbonamenti,
  Clients = MainMenu.Clienti,
  Training = MainMenu.Allenamento,
  Chat = MainMenu.Chat,
  Banners = MainMenu.Banners,
  Settings = MainMenu.Settings,
  None = "",
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
  const { t } = useTranslation();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Memoize currentWidth calculation
  const currentWidth = React.useMemo(
    () => (miniDrawer ? miniDrawerWidth : drawerWidth),
    [miniDrawer, miniDrawerWidth, drawerWidth]
  );

  // Extract clientId from current URL
  const clientId = React.useMemo(() => {
    const match = location.pathname.match(/\/clients\/([^/]+)\//);
    return match ? match[1] : null;
  }, [location.pathname]);

  // Memoize activeMenu and activeSubmenu calculations
  const { activeMenu, activeSubmenu } = React.useMemo(() => {
    const path = location.pathname;
    let activeMenu: ActiveMenu = ActiveMenu.None;
    let activeSubmenu: string | null = null;

    if (path.startsWith(MenuPath.Dashboard)) {
      activeMenu = ActiveMenu.Dashboard;
    } else if (path.startsWith(MenuPath.Subscriptions)) {
      activeMenu = ActiveMenu.Subscriptions;
    } else if (path.startsWith("/clients")) {
      activeMenu = ActiveMenu.Clients;
      if (path.includes("/anagrafica"))
        activeSubmenu = ClientiSubMenu.Anagrafica;
      else if (path.includes("/allenamenti"))
        activeSubmenu = ClientiSubMenu.Allenamenti;
      else if (path.includes("/diario")) activeSubmenu = ClientiSubMenu.Diario;
      else if (path.includes("/alimentazione"))
        activeSubmenu = ClientiSubMenu.Alimentazione;
      else if (path.includes("/altro")) activeSubmenu = ClientiSubMenu.Altro;
    } else if (path.startsWith(MenuPath.Training)) {
      activeMenu = ActiveMenu.Training;
      if (path.startsWith(MenuPath.TrainingExercise))
        activeSubmenu = TrainingSubMenu.Exercise;
      else if (path.startsWith(MenuPath.TrainingProgram))
        activeSubmenu = TrainingSubMenu.TrainingProgram;
      else if (path.startsWith(MenuPath.CompletedTraining))
        activeSubmenu = TrainingSubMenu.CompletedTraining;
    } else if (path.startsWith(MenuPath.Chat)) {
      activeMenu = ActiveMenu.Chat;
    } else if (path.startsWith(MenuPath.Banners)) {
      activeMenu = ActiveMenu.Banners;
    } else if (path.startsWith(MenuPath.Settings)) {
      activeMenu = ActiveMenu.Settings;
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

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isSmallScreen) toggleDrawer(false);
  };

  // Helper for submenu navigation
  const handleClientSubmenuNavigation = (submenu: string) => {
    switch (submenu) {
      case ClientiSubMenu.Anagrafica: {
        const anagraficaPath = clientId
          ? `/clients/${clientId}/anagrafica`
          : "/clients/anagrafica";
        handleNavigation(anagraficaPath);
        break;
      }
      case ClientiSubMenu.Allenamenti:
      case ClientiSubMenu.Diario:
      case ClientiSubMenu.Alimentazione:
      case ClientiSubMenu.Altro: {
        if (!clientId) {
          handleNavigation("/clients");
          return;
        }
        const baseClientPath = `/clients/${clientId}`;
        const sectionMap = {
          [ClientiSubMenu.Allenamenti]: "allenamenti",
          [ClientiSubMenu.Diario]: "diario",
          [ClientiSubMenu.Alimentazione]: "alimentazione",
          [ClientiSubMenu.Altro]: "altro",
        };
        handleNavigation(
          `${baseClientPath}/${sectionMap[submenu as keyof typeof sectionMap]}`
        );
        break;
      }
      default:
        handleNavigation("/clients");
    }
  };

  return (
    <Drawer
      variant="permanent"
      open={drawerOpen}
      sx={{
        width: currentWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: currentWidth,
          ...styles.drawerPaper,
        },
      }}
      PaperProps={{
        onMouseEnter: () =>
          isSmallScreen && miniDrawer && toggleMiniDrawer(false),
        onMouseLeave: () =>
          isSmallScreen && !miniDrawer && toggleMiniDrawer(true),
      }}
    >
      <Toolbar style={styles.toolbar}>
        {!miniDrawer && (
          <ShapexLogo style={{ width: 170, height: 40, margin: "0 auto" }} />
        )}
      </Toolbar>

      <List sx={{ pt: 2 }}>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            style={{
              ...styles.listItemButton,
              color:
                activeMenu === ActiveMenu.Dashboard ? menuColor : undefined,
            }}
            onClick={() => handleNavigation(MenuPath.Dashboard)}
            sx={{ "&:hover": { bgcolor: hoverBg } }}
          >
            <DashboardIcon
              style={{
                ...styles.icon,
                color:
                  activeMenu === ActiveMenu.Dashboard ? menuColor : undefined,
                filter:
                  activeMenu === ActiveMenu.Dashboard
                    ? activeIconFilter
                    : undefined,
              }}
            />
            {!miniDrawer && (
              <ListItemText
                primary={t("mainMenu.dashboard")}
                style={{
                  ...styles.listItemText,
                  color:
                    activeMenu === ActiveMenu.Dashboard
                      ? menuColor
                      : styles.listItemText.color,
                  fontWeight:
                    activeMenu === ActiveMenu.Dashboard ? 600 : undefined,
                }}
              />
            )}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            style={{
              ...styles.listItemButton,
              color:
                activeMenu === ActiveMenu.Subscriptions ? menuColor : undefined,
            }}
            onClick={() => handleNavigation(MenuPath.Subscriptions)}
            sx={{ "&:hover": { bgcolor: hoverBg } }}
          >
            <SubscriptionsIcon
              style={{
                ...styles.icon,
                color:
                  activeMenu === ActiveMenu.Subscriptions
                    ? menuColor
                    : undefined,
                filter:
                  activeMenu === ActiveMenu.Subscriptions
                    ? activeIconFilter
                    : undefined,
              }}
            />
            {!miniDrawer && (
              <ListItemText
                primary={t("mainMenu.subscriptions")}
                style={{
                  ...styles.listItemText,
                  color:
                    activeMenu === ActiveMenu.Subscriptions
                      ? menuColor
                      : styles.listItemText.color,
                  fontWeight:
                    activeMenu === ActiveMenu.Subscriptions ? 600 : undefined,
                }}
              />
            )}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ mb: 0 }}>
          <ListItemButton
            style={{
              ...styles.listItemButton,
              color: activeMenu === ActiveMenu.Clients ? menuColor : undefined,
            }}
            onClick={() => {
              if (openSubmenu !== ActiveMenu.Clients) {
                setOpenSubmenu(ActiveMenu.Clients);
                handleNavigation(MenuPath.Clients);
              } else {
                setOpenSubmenu(null);
              }
            }}
            sx={{ "&:hover": { bgcolor: hoverBg } }}
          >
            <ClientIcon
              style={{
                ...styles.icon,
                filter:
                  activeMenu === ActiveMenu.Clients
                    ? activeIconFilter
                    : undefined,
                color:
                  activeMenu === ActiveMenu.Clients ? menuColor : undefined,
              }}
            />
            {!miniDrawer && (
              <ListItemText
                primary={t("mainMenu.clients")}
                style={{
                  ...styles.listItemText,
                  color:
                    activeMenu === ActiveMenu.Clients
                      ? menuColor
                      : styles.listItemText.color,
                  fontWeight:
                    activeMenu === ActiveMenu.Clients ? 600 : undefined,
                }}
                sx={{ mr: 15 }}
              />
            )}
            {openSubmenu === ActiveMenu.Clients ? (
              <ExpandLess sx={{ color: menuColor }} />
            ) : (
              <ExpandMore sx={{ color: "#fff" }} />
            )}
            {openSubmenu === ActiveMenu.Clients && !miniDrawer && (
              <ActiveMenuIndicator />
            )}
          </ListItemButton>
        </ListItem>
        <Collapse
          in={openSubmenu === ActiveMenu.Clients}
          timeout="auto"
          unmountOnExit
        >
          <List component="div" disablePadding sx={{ pl: 9 }}>
            {Object.values(ClientiSubMenu).map((label) => {
              const isDisabled = !clientId && label !== ClientiSubMenu.Anagrafica;
              const isActive = activeSubmenu === label;
              
              const menuItem = (
                <ListItem disablePadding key={label}>
                  <ListItemButton
                    disabled={isDisabled}
                    sx={{
                      py: 0.7,
                      color: isDisabled 
                        ? "rgba(255, 255, 255, 0.9)" 
                        : isActive 
                          ? menuColor 
                          : "#fff",
                      fontWeight: isActive ? 700 : 400,
                      fontSize: 16,
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      "&:hover": { 
                        bgcolor: isDisabled ? "transparent" : submenuHoverBg 
                      },
                      "&.Mui-disabled": {
                        color: "rgba(255, 255, 255, 0.9)",
                        cursor: "not-allowed",
                      },
                    }}
                    onClick={isDisabled ? undefined : () => handleClientSubmenuNavigation(label)}
                  >
                    <ListItemText
                      primary={t(`clientiSubMenu.${label}`)}
                      sx={{
                        color: isDisabled 
                          ? "rgba(255, 255, 255, 0.9)" 
                          : isActive 
                            ? menuColor 
                            : "#fff",
                        fontWeight: isActive ? 700 : 400,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );

              return isDisabled ? (
                <Tooltip 
                  key={label}
                  title={t("clientiSubMenu.pleaseSelectClient")}
                  placement="right"
                  arrow
                >
                  <span>{menuItem}</span>
                </Tooltip>
              ) : menuItem;
            })}
          </List>
        </Collapse>
        {/* Allenamento with submenu */}
        <ListItem disablePadding sx={{ mb: 0 }}>
          <ListItemButton
            style={{
              ...styles.listItemButton,
              color: activeMenu === ActiveMenu.Training ? menuColor : undefined,
            }}
            onClick={() => {
              if (openSubmenu !== ActiveMenu.Training) {
                setOpenSubmenu(ActiveMenu.Training);
                handleNavigation(MenuPath.Training);
              } else {
                setOpenSubmenu(null);
              }
            }}
            sx={{ position: "relative", "&:hover": { bgcolor: hoverBg } }}
          >
            <TrainingIcon
              style={{
                ...styles.icon,
                color:
                  activeMenu === ActiveMenu.Training ? menuColor : undefined,
                filter:
                  activeMenu === ActiveMenu.Training
                    ? activeIconFilter
                    : undefined,
              }}
            />
            {!miniDrawer && (
              <ListItemText
                primary={t("mainMenu.training")}
                style={{
                  ...styles.listItemText,
                  color:
                    activeMenu === ActiveMenu.Training
                      ? menuColor
                      : styles.listItemText.color,
                  fontWeight:
                    activeMenu === ActiveMenu.Training ? 600 : undefined,
                }}
                sx={{ mr: 15 }}
              />
            )}
            {openSubmenu === ActiveMenu.Training ? (
              <ExpandLess sx={{ color: menuColor }} />
            ) : (
              <ExpandMore sx={{ color: "#fff" }} />
            )}
            {openSubmenu === ActiveMenu.Training && !miniDrawer && (
              <ActiveMenuIndicator />
            )}
          </ListItemButton>
        </ListItem>
        <Collapse
          in={openSubmenu === ActiveMenu.Training}
          timeout="auto"
          unmountOnExit
        >
          <List component="div" disablePadding sx={{ pl: 9 }}>
            {[
              { key: "Exercise", path: MenuPath.TrainingExercise },
              { key: "TrainingProgram", path: MenuPath.TrainingProgram },
              { key: "CompletedTraining", path: MenuPath.CompletedTraining },
            ].map(({ key, path }) => (
              <ListItem disablePadding key={key}>
                <ListItemButton
                  sx={{
                    py: 0.7,
                    color:
                      activeSubmenu ===
                      TrainingSubMenu[key as keyof typeof TrainingSubMenu]
                        ? menuColor
                        : "#fff",
                    fontWeight:
                      activeSubmenu ===
                      TrainingSubMenu[key as keyof typeof TrainingSubMenu]
                        ? 700
                        : 400,
                    fontSize: 16,
                    "&:hover": { bgcolor: submenuHoverBg },
                  }}
                  onClick={() => handleNavigation(path)}
                >
                  <ListItemText
                    primary={t(
                      `trainingSubMenu.${
                        key.charAt(0).toLowerCase() + key.slice(1)
                      }`
                    )}
                    sx={{
                      color:
                        activeSubmenu ===
                        TrainingSubMenu[key as keyof typeof TrainingSubMenu]
                          ? menuColor
                          : "#fff",
                      fontWeight:
                        activeSubmenu ===
                        TrainingSubMenu[key as keyof typeof TrainingSubMenu]
                          ? 700
                          : 400,
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
            sx={{ "&:hover": { bgcolor: hoverBg } }}
          >
            <ChatIcon
              style={{
                ...styles.icon,
                color: activeMenu === ActiveMenu.Chat ? menuColor : undefined,
                filter:
                  activeMenu === ActiveMenu.Chat ? activeIconFilter : undefined,
              }}
            />
            {!miniDrawer && (
              <ListItemText
                primary={t("mainMenu.chat")}
                style={{
                  ...styles.listItemText,
                  color:
                    activeMenu === ActiveMenu.Chat
                      ? menuColor
                      : styles.listItemText.color,
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
            sx={{ "&:hover": { bgcolor: hoverBg } }}
          >
            <BannersIcon
              style={{
                ...styles.icon,
                color:
                  activeMenu === ActiveMenu.Banners ? menuColor : undefined,
                filter:
                  activeMenu === ActiveMenu.Banners
                    ? activeIconFilter
                    : undefined,
              }}
            />
            {!miniDrawer && (
              <ListItemText
                primary={t("mainMenu.banners")}
                style={{
                  ...styles.listItemText,
                  color:
                    activeMenu === ActiveMenu.Banners
                      ? menuColor
                      : styles.listItemText.color,
                  fontWeight:
                    activeMenu === ActiveMenu.Banners ? 600 : undefined,
                }}
              />
            )}
          </ListItemButton>
        </ListItem>
        {/* Settings */}
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            style={{
              ...styles.listItemButton,
              color:
                activeMenu === ActiveMenu.Settings ? menuColor : undefined,
            }}
            onClick={() => handleNavigation(MenuPath.Settings)}
            sx={{ "&:hover": { bgcolor: hoverBg } }}
          >
            <SettingsIcon
              style={{
                ...styles.icon,
                color:
                  activeMenu === ActiveMenu.Settings ? menuColor : undefined,
                filter:
                  activeMenu === ActiveMenu.Settings
                    ? activeIconFilter
                    : undefined,
              }}
            />
            {!miniDrawer && (
              <ListItemText
                primary={t("mainMenu.settings")}
                style={{
                  ...styles.listItemText,
                  color:
                    activeMenu === ActiveMenu.Settings
                      ? menuColor
                      : styles.listItemText.color,
                  fontWeight:
                    activeMenu === ActiveMenu.Settings ? 600 : undefined,
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
            sx={{ "&:hover": { bgcolor: hoverBg } }}
          >
            <LogoutIcon style={styles.icon} />
            <ListItemText
              primary={t("mainMenu.logout")}
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
    boxSizing: "border-box",
    overflowX: "hidden",
    backgroundColor: "#616160",
    color: "#fff",
    borderRight: 0,
    paddingLeft: 0,
    paddingTop: 0,
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  toolbar: {
    minHeight: 88,
    paddingLeft: 0,
    paddingRight: 0,
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 40,
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  icon: {
    width: 22,
    height: 24,
    minWidth: 22,
    minHeight: 22,
    marginRight: 18,
  },
  activeMenuIndicator: {
    position: "absolute",
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
    position: "relative",
  },
  activeListItemButton: {
    color: menuColor,
  },
  listItemText: {
    color: "#fff",
  },
  activeListItemText: {
    color: menuColor,
    marginRight: 120,
  },
  divider: {
    backgroundColor: "#7B7B7B",
    marginTop: 8,
    marginLeft: 32,
    marginRight: 48,
  },
});
