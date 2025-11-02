import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  People,
  LocalHospital,
  Schedule,
  Medication,
  TrendingUp,
  Warning,
  CheckCircle
} from '@mui/icons-material';

function AdminOverview() {
  // Mock data - replace with actual API calls
  const stats = [
    { title: 'Total Patients', value: 1247, icon: <People />, color: '#011D4D', change: '+12%' },
    { title: 'Active Doctors', value: 45, icon: <LocalHospital />, color: '#1282A2', change: '+3%' },
    { title: 'Scheduled Treatments', value: 89, icon: <Schedule />, color: '#63372C', change: '+8%' },
    { title: 'Medicine Orders', value: 156, icon: <Medication />, color: '#034078', change: '+15%' }
  ];

  const recentActivities = [
    { id: 1, type: 'patient', message: 'New patient John Doe registered', time: '2 hours ago', status: 'success' },
    { id: 2, type: 'doctor', message: 'Dr. Smith updated treatment plan', time: '4 hours ago', status: 'info' },
    { id: 3, type: 'treatment', message: 'Emergency treatment scheduled', time: '6 hours ago', status: 'warning' },
    { id: 4, type: 'medicine', message: 'Medicine stock low - Paracetamol', time: '8 hours ago', status: 'warning' },
    { id: 5, type: 'system', message: 'System backup completed', time: '12 hours ago', status: 'success' }
  ];

  const upcomingAppointments = [
    { id: 1, patient: 'Alice Johnson', doctor: 'Dr. Smith', time: '09:00 AM', type: 'Consultation' },
    { id: 2, patient: 'Bob Wilson', doctor: 'Dr. Brown', time: '10:30 AM', type: 'Follow-up' },
    { id: 3, patient: 'Carol Davis', doctor: 'Dr. Smith', time: '02:00 PM', type: 'Treatment' },
    { id: 4, patient: 'David Miller', doctor: 'Dr. Johnson', time: '03:30 PM', type: 'Check-up' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#4caf50';
      case 'warning': return '#ff9800';
      case 'info': return '#2196f3';
      default: return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle />;
      case 'warning': return <Warning />;
      case 'info': return <TrendingUp />;
      default: return <TrendingUp />;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: '#011D4D', mb: 3 }}>
        Dashboard Overview
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ color: stat.color, fontWeight: 'bold' }}>
                      {stat.value.toLocaleString()}
                    </Typography>
                    <Chip 
                      label={stat.change} 
                      size="small" 
                      sx={{ 
                        bgcolor: '#4caf50', 
                        color: 'white', 
                        mt: 1,
                        '& .MuiChip-label': { fontSize: '0.75rem' }
                      }} 
                    />
                  </Box>
                  <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#011D4D' }}>
                Recent Activities
              </Typography>
              <List>
                {recentActivities.map((activity) => (
                  <ListItem key={activity.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: getStatusColor(activity.status), width: 32, height: 32 }}>
                        {getStatusIcon(activity.status)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.message}
                      secondary={activity.time}
                      primaryTypographyProps={{ fontSize: '0.9rem' }}
                      secondaryTypographyProps={{ fontSize: '0.8rem' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Appointments */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#011D4D' }}>
                Today's Appointments
              </Typography>
              <List>
                {upcomingAppointments.map((appointment) => (
                  <ListItem key={appointment.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#1282A2', width: 32, height: 32 }}>
                        <Schedule />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${appointment.patient} - ${appointment.doctor}`}
                      secondary={`${appointment.time} • ${appointment.type}`}
                      primaryTypographyProps={{ fontSize: '0.9rem' }}
                      secondaryTypographyProps={{ fontSize: '0.8rem' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* System Health */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#011D4D' }}>
                System Health
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Server Performance
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={85} 
                      sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      85% - Good
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Database Status
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={92} 
                      sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      92% - Excellent
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Storage Usage
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={67} 
                      sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      67% - Normal
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminOverview;
