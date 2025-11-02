import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Settings,
  Security,
  Notifications,
  Backup,
  Delete,
  Add,
  Edit,
  Save,
  Refresh
} from '@mui/icons-material';

function SystemSettings() {
  const [settings, setSettings] = useState({
    // General Settings
    systemName: 'AI Healthcare System',
    timezone: 'UTC-5',
    language: 'English',
    dateFormat: 'MM/DD/YYYY',
    
    // Security Settings
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      sessionTimeout: 30
    },
    twoFactorAuth: false,
    loginAttempts: 5,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    appointmentReminders: true,
    medicineReminders: true,
    
    // Backup Settings
    autoBackup: true,
    backupFrequency: 'Daily',
    backupRetention: 30,
    cloudBackup: false
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [tempValue, setTempValue] = useState('');

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleGeneralChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleOpenDialog = (type, currentValue = '') => {
    setDialogType(type);
    setTempValue(currentValue);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogType('');
    setTempValue('');
  };

  const handleSaveDialog = () => {
    if (dialogType === 'systemName') {
      handleGeneralChange('systemName', tempValue);
    } else if (dialogType === 'timezone') {
      handleGeneralChange('timezone', tempValue);
    } else if (dialogType === 'language') {
      handleGeneralChange('language', tempValue);
    } else if (dialogType === 'dateFormat') {
      handleGeneralChange('dateFormat', tempValue);
    }
    handleCloseDialog();
  };

  const handleSaveSettings = () => {
    // Here you would typically save to backend
    console.log('Saving settings:', settings);
    // Show success message
  };

  const systemUsers = [
    { id: 1, name: 'Admin User', role: 'Administrator', lastLogin: '2024-01-15 10:30 AM', status: 'Active' },
    { id: 2, name: 'Dr. Sarah Smith', role: 'Doctor', lastLogin: '2024-01-15 09:15 AM', status: 'Active' },
    { id: 3, name: 'Dr. Michael Brown', role: 'Doctor', lastLogin: '2024-01-14 16:45 PM', status: 'Active' },
    { id: 4, name: 'Nurse Johnson', role: 'Nurse', lastLogin: '2024-01-15 08:00 AM', status: 'Active' }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: '#011D4D', mb: 3 }}>
        System Settings
      </Typography>

      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Settings sx={{ mr: 1, color: '#011D4D' }} />
                <Typography variant="h6" sx={{ color: '#011D4D' }}>
                  General Settings
                </Typography>
              </Box>
              
              <List>
                <ListItem>
                  <ListItemText
                    primary="System Name"
                    secondary={settings.systemName}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => handleOpenDialog('systemName', settings.systemName)}>
                      <Edit />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Timezone"
                    secondary={settings.timezone}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => handleOpenDialog('timezone', settings.timezone)}>
                      <Edit />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Language"
                    secondary={settings.language}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => handleOpenDialog('language', settings.language)}>
                      <Edit />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Date Format"
                    secondary={settings.dateFormat}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => handleOpenDialog('dateFormat', settings.dateFormat)}>
                      <Edit />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Security sx={{ mr: 1, color: '#011D4D' }} />
                <Typography variant="h6" sx={{ color: '#011D4D' }}>
                  Security Settings
                </Typography>
              </Box>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.twoFactorAuth}
                    onChange={(e) => handleGeneralChange('twoFactorAuth', e.target.checked)}
                    color="primary"
                  />
                }
                label="Two-Factor Authentication"
              />
              
              <TextField
                fullWidth
                label="Minimum Password Length"
                type="number"
                value={settings.passwordPolicy.minLength}
                onChange={(e) => handleSettingChange('passwordPolicy', 'minLength', parseInt(e.target.value))}
                margin="normal"
                size="small"
              />
              
              <TextField
                fullWidth
                label="Session Timeout (minutes)"
                type="number"
                value={settings.passwordPolicy.sessionTimeout}
                onChange={(e) => handleSettingChange('passwordPolicy', 'sessionTimeout', parseInt(e.target.value))}
                margin="normal"
                size="small"
              />
              
              <TextField
                fullWidth
                label="Max Login Attempts"
                type="number"
                value={settings.loginAttempts}
                onChange={(e) => handleGeneralChange('loginAttempts', parseInt(e.target.value))}
                margin="normal"
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Notifications sx={{ mr: 1, color: '#011D4D' }} />
                <Typography variant="h6" sx={{ color: '#011D4D' }}>
                  Notification Settings
                </Typography>
              </Box>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={(e) => handleGeneralChange('emailNotifications', e.target.checked)}
                    color="primary"
                  />
                }
                label="Email Notifications"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.smsNotifications}
                    onChange={(e) => handleGeneralChange('smsNotifications', e.target.checked)}
                    color="primary"
                  />
                }
                label="SMS Notifications"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.pushNotifications}
                    onChange={(e) => handleGeneralChange('pushNotifications', e.target.checked)}
                    color="primary"
                  />
                }
                label="Push Notifications"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.appointmentReminders}
                    onChange={(e) => handleGeneralChange('appointmentReminders', e.target.checked)}
                    color="primary"
                  />
                }
                label="Appointment Reminders"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.medicineReminders}
                    onChange={(e) => handleGeneralChange('medicineReminders', e.target.checked)}
                    color="primary"
                  />
                }
                label="Medicine Reminders"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Backup Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Backup sx={{ mr: 1, color: '#011D4D' }} />
                <Typography variant="h6" sx={{ color: '#011D4D' }}>
                  Backup Settings
                </Typography>
              </Box>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoBackup}
                    onChange={(e) => handleGeneralChange('autoBackup', e.target.checked)}
                    color="primary"
                  />
                }
                label="Automatic Backup"
              />
              
              <FormControl fullWidth margin="normal" size="small">
                <InputLabel>Backup Frequency</InputLabel>
                <Select
                  value={settings.backupFrequency}
                  label="Backup Frequency"
                  onChange={(e) => handleGeneralChange('backupFrequency', e.target.value)}
                >
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Backup Retention (days)"
                type="number"
                value={settings.backupRetention}
                onChange={(e) => handleGeneralChange('backupRetention', parseInt(e.target.value))}
                margin="normal"
                size="small"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.cloudBackup}
                    onChange={(e) => handleGeneralChange('cloudBackup', e.target.checked)}
                    color="primary"
                  />
                }
                label="Cloud Backup"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* System Users */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#011D4D' }}>
                  System Users
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  size="small"
                  sx={{ bgcolor: '#011D4D' }}
                >
                  Add User
                </Button>
              </Box>
              
              <List>
                {systemUsers.map((user) => (
                  <ListItem key={user.id} divider>
                    <ListItemText
                      primary={user.name}
                      secondary={`${user.role} • Last login: ${user.lastLogin}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton size="small">
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Save />}
              onClick={handleSaveSettings}
              sx={{ 
                bgcolor: '#011D4D', 
                '&:hover': { bgcolor: '#034078' },
                px: 4,
                py: 1.5
              }}
            >
              Save All Settings
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit {dialogType}</DialogTitle>
        <DialogContent>
          {dialogType === 'systemName' && (
            <TextField
              fullWidth
              label="System Name"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              margin="normal"
            />
          )}
          {dialogType === 'timezone' && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Timezone</InputLabel>
              <Select
                value={tempValue}
                label="Timezone"
                onChange={(e) => setTempValue(e.target.value)}
              >
                <MenuItem value="UTC-5">UTC-5 (EST)</MenuItem>
                <MenuItem value="UTC-6">UTC-6 (CST)</MenuItem>
                <MenuItem value="UTC-7">UTC-7 (MST)</MenuItem>
                <MenuItem value="UTC-8">UTC-8 (PST)</MenuItem>
                <MenuItem value="UTC+0">UTC+0 (GMT)</MenuItem>
              </Select>
            </FormControl>
          )}
          {dialogType === 'language' && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Language</InputLabel>
              <Select
                value={tempValue}
                label="Language"
                onChange={(e) => setTempValue(e.target.value)}
              >
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Spanish">Spanish</MenuItem>
                <MenuItem value="French">French</MenuItem>
                <MenuItem value="German">German</MenuItem>
              </Select>
            </FormControl>
          )}
          {dialogType === 'dateFormat' && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Date Format</InputLabel>
              <Select
                value={tempValue}
                label="Date Format"
                onChange={(e) => setTempValue(e.target.value)}
              >
                <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveDialog} variant="contained" sx={{ bgcolor: '#011D4D' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SystemSettings;
