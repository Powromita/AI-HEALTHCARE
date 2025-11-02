import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Notifications,
  Security,
  Save,
  Edit,
  LocalHospital,
  Emergency
} from '@mui/icons-material';

function PatientSettings() {
  const [openDialog, setOpenDialog] = useState(false);
  const [settings, setSettings] = useState({
    // Personal Information
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 234-567-8900',
    address: '123 Main St, City, State 12345',
    dateOfBirth: '1989-05-15',
    emergencyContact: 'Jane Doe',
    emergencyPhone: '+1 234-567-8901',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    appointmentReminders: true,
    medicationReminders: true,
    labResultNotifications: true,
    
    // Privacy Settings
    shareDataWithDoctors: true,
    allowResearchData: false,
    dataRetentionPeriod: '7 years'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // Here you would typically save to backend
    console.log('Saving settings:', settings);
    setOpenDialog(true);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: '#011D4D', mb: 3 }}>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Person sx={{ mr: 1, color: '#011D4D' }} />
                <Typography variant="h6" sx={{ color: '#011D4D' }}>
                  Personal Information
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={settings.name}
                    onChange={(e) => handleSettingChange('name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleSettingChange('email', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={settings.phone}
                    onChange={(e) => handleSettingChange('phone', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    multiline
                    rows={2}
                    value={settings.address}
                    onChange={(e) => handleSettingChange('address', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    value={settings.dateOfBirth}
                    onChange={(e) => handleSettingChange('dateOfBirth', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Emergency Contact */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Emergency sx={{ mr: 1, color: '#011D4D' }} />
                <Typography variant="h6" sx={{ color: '#011D4D' }}>
                  Emergency Contact
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Emergency Contact Name"
                    value={settings.emergencyContact}
                    onChange={(e) => handleSettingChange('emergencyContact', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Emergency Contact Phone"
                    value={settings.emergencyPhone}
                    onChange={(e) => handleSettingChange('emergencyPhone', e.target.value)}
                  />
                </Grid>
              </Grid>
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
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    color="primary"
                  />
                }
                label="Email Notifications"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.smsNotifications}
                    onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                    color="primary"
                  />
                }
                label="SMS Notifications"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.pushNotifications}
                    onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                    color="primary"
                  />
                }
                label="Push Notifications"
              />
              
              <Divider sx={{ my: 2 }} />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.appointmentReminders}
                    onChange={(e) => handleSettingChange('appointmentReminders', e.target.checked)}
                    color="primary"
                  />
                }
                label="Appointment Reminders"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.medicationReminders}
                    onChange={(e) => handleSettingChange('medicationReminders', e.target.checked)}
                    color="primary"
                  />
                }
                label="Medication Reminders"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.labResultNotifications}
                    onChange={(e) => handleSettingChange('labResultNotifications', e.target.checked)}
                    color="primary"
                  />
                }
                label="Lab Result Notifications"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Privacy Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Security sx={{ mr: 1, color: '#011D4D' }} />
                <Typography variant="h6" sx={{ color: '#011D4D' }}>
                  Privacy Settings
                </Typography>
              </Box>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.shareDataWithDoctors}
                    onChange={(e) => handleSettingChange('shareDataWithDoctors', e.target.checked)}
                    color="primary"
                  />
                }
                label="Share data with doctors"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.allowResearchData}
                    onChange={(e) => handleSettingChange('allowResearchData', e.target.checked)}
                    color="primary"
                  />
                }
                label="Allow data for research (anonymized)"
              />
              
              <TextField
                fullWidth
                label="Data Retention Period"
                value={settings.dataRetentionPeriod}
                onChange={(e) => handleSettingChange('dataRetentionPeriod', e.target.value)}
                margin="normal"
                select
                SelectProps={{
                  native: true,
                }}
              >
                <option value="1 year">1 year</option>
                <option value="3 years">3 years</option>
                <option value="5 years">5 years</option>
                <option value="7 years">7 years</option>
                <option value="10 years">10 years</option>
              </TextField>
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
                bgcolor: '#63372C', 
                '&:hover': { bgcolor: '#4a2c1f' },
                px: 4,
                py: 1.5
              }}
            >
              Save Settings
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Success Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Settings Saved</DialogTitle>
        <DialogContent>
          <Typography>
            Your settings have been successfully saved.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PatientSettings;
