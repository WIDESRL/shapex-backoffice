import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import AppRoutes from './Routes';
// import { Box, AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Container, Drawer, List, ListItemText, Divider, ListItemButton } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
import MainLayout from './MainLayout';

const App: React.FC = () => {
  return (
        <Router>
          <MainLayout />
        </Router>
  );
};


export default App;