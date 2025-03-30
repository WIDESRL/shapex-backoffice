import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Select, FormControl, SelectChangeEvent, Box } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { Theme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

// Import local flag images
import EnglandFlag from '../assets/flags/gb.png';
import ItalianFlag from '../assets/flags/it.png';

interface TopBarProps {
  isSmallScreen: boolean;
  drawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  handleMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleMenuClose: () => void;
  anchorEl: HTMLElement | null;
  logout: () => void;
  drawerWidth: number;
  theme: Theme;
}

const TopBar: React.FC<TopBarProps> = ({
  isSmallScreen,
  drawerOpen,
  toggleDrawer,
  handleMenuOpen,
  handleMenuClose,
  anchorEl,
  logout,
  drawerWidth,
  theme,
}) => {
  const { t, i18n } = useTranslation(); // Initialize useTranslation hook

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    i18n.changeLanguage(event.target.value); // Change language
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: isSmallScreen ? '100%' : drawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
        ml: isSmallScreen ? 0 : drawerOpen ? `${drawerWidth}px` : 0,
        zIndex: theme.zIndex.drawer + 1, // Ensure AppBar is above the Drawer
        transition: 'width 0.3s ease, margin-left 0.3s ease',
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => toggleDrawer(!drawerOpen)}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {/* Add your app title or logo here */}
        </Typography>

        {/* Language Selector with Flags */}
        <FormControl variant="standard" sx={{ mr: 2, minWidth: 80 }}>
          <Select
            value={i18n.language}
            onChange={handleLanguageChange}
            displayEmpty
            sx={{
              color: 'white',
              '& .MuiSvgIcon-root': {
                color: 'white',
              },
       
              '&:before, &:after, &:hover:not(.Mui-disabled):before': {
                borderBottom: 'none', // Combine all borderBottom rules
              },
            }}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {selected === 'en' ? (
                  <img src={EnglandFlag} alt="English" width="20" />
                ) : (
                  <img src={ItalianFlag} alt="Italian" width="20" />
                )}
                {selected === 'en' ? 'EN' : 'IT'}
              </Box>
            )}
          >
            <MenuItem value="en">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <img src={EnglandFlag} alt="English" width="20" />
                English
              </Box>
            </MenuItem>
            <MenuItem value="it">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <img src={ItalianFlag} alt="Italian" width="20" />
                Italian
              </Box>
            </MenuItem>
          </Select>
        </FormControl>

        {/* User Menu */}
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          onClick={handleMenuOpen}
        >
          <AccountCircle />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>{t('menu.profile')}</MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              logout();
            }}
          >
            {t('menu.logout')}
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;