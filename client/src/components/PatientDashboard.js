import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Dashboard,
  Person,
  Schedule,
  Medication,
  Assessment,
  Settings,
  Logout,
  Menu as MenuIcon,
  Favorite,
  Psychology
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import PatientOverview from './patient/PatientOverview';
import MyAppointments from './patient/MyAppointments';
import MyMedications from './patient/MyMedications';
import HealthRecords from './patient/HealthRecords';
import HealthTracking from './patient/HealthTracking';
import PatientSettings from './patient/PatientSettings';
import EmotionAssessment from './patient/EmotionAssessment';

const drawerWidth = 280;

function PatientDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/patient' },
    { text: 'Emotion Assessment', icon: <Psychology />, path: '/patient/emotion-assessment' },
    { text: 'My Appointments', icon: <Schedule />, path: '/patient/appointments' },
    { text: 'My Medications', icon: <Medication />, path: '/patient/medications' },
    { text: 'Health Records', icon: <Assessment />, path: '/patient/records' },
    { text: 'Health Tracking', icon: <Favorite />, path: '/patient/tracking' },
    { text: 'Settings', icon: <Settings />, path: '/patient/settings' },
  ];

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ color: '#011D4D', fontWeight: 'bold' }}>
          <Favorite sx={{ mr: 1, verticalAlign: 'middle' }} />
          Patient Portal
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component="a"
              href={item.path}
              sx={{
                '&:hover': {
                  backgroundColor: '#E4DFDA',
                },
                '&.active': {
                  backgroundColor: '#63372C',
                  color: 'white',
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: '#011D4D' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: '#63372C',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Patient Dashboard - {user?.name}
          </Typography>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ bgcolor: '#011D4D' }}>
              {user?.name?.charAt(0)}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <Avatar sx={{ mr: 2, bgcolor: '#011D4D' }}>
            {user?.name?.charAt(0)}
          </Avatar>
          {user?.name}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#E4DFDA',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Routes>
          <Route path="/" element={<PatientOverview />} />
          <Route path="/emotion-assessment" element={<EmotionAssessment />} />
          <Route path="/appointments" element={<MyAppointments />} />
          <Route path="/medications" element={<MyMedications />} />
          <Route path="/records" element={<HealthRecords />} />
          <Route path="/tracking" element={<HealthTracking />} />
          <Route path="/settings" element={<PatientSettings />} />
          <Route path="*" element={<Navigate to="/patient" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default PatientDashboard;
