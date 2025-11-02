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
  Button,
  LinearProgress
} from '@mui/material';
import {
  Schedule,
  Medication,
  Assessment,
  TrendingUp,
  Warning,
  CheckCircle,
  Add,
  Visibility,
  Favorite,
  LocalHospital
} from '@mui/icons-material';

function PatientOverview() {
  // Mock data - replace with actual API calls
  const healthStats = [
    { title: 'Blood Pressure', value: '130/85', status: 'Normal', color: '#4caf50', icon: <Assessment /> },
    { title: 'Heart Rate', value: '72 bpm', status: 'Good', color: '#4caf50', icon: <Favorite /> },
    { title: 'Weight', value: '180 lbs', status: 'Stable', color: '#ff9800', icon: <TrendingUp /> },
    { title: 'Blood Sugar', value: '95 mg/dL', status: 'Normal', color: '#4caf50', icon: <Assessment /> }
  ];

  const upcomingAppointments = [
    { id: 1, doctor: 'Dr. Sarah Smith', date: '2024-01-22', time: '10:00 AM', type: 'Follow-up', status: 'Scheduled' },
    { id: 2, doctor: 'Dr. Michael Brown', date: '2024-01-25', time: '02:30 PM', type: 'Consultation', status: 'Scheduled' }
  ];

  const currentMedications = [
    { id: 1, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', nextDose: 'Today 8:00 AM' },
    { id: 2, name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', nextDose: 'Today 2:00 PM' },
    { id: 3, name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', nextDose: 'Tomorrow 8:00 AM' }
  ];

  const healthReminders = [
    { id: 1, task: 'Take morning medication', time: '8:00 AM', completed: true },
    { id: 2, task: 'Blood pressure check', time: '9:00 AM', completed: false },
    { id: 3, task: 'Take afternoon medication', time: '2:00 PM', completed: false },
    { id: 4, task: 'Evening walk', time: '6:00 PM', completed: false }
  ];

  const recentLabResults = [
    { id: 1, test: 'Blood Glucose', result: '95 mg/dL', status: 'Normal', date: '2024-01-15' },
    { id: 2, test: 'Cholesterol', result: '185 mg/dL', status: 'Normal', date: '2024-01-15' },
    { id: 3, test: 'HbA1c', result: '6.2%', status: 'Good', date: '2024-01-08' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Normal': return '#4caf50';
      case 'Good': return '#4caf50';
      case 'Stable': return '#ff9800';
      case 'High': return '#f44336';
      case 'Scheduled': return '#2196f3';
      case 'Completed': return '#4caf50';
      default: return '#757575';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: '#011D4D', mb: 3 }}>
        Health Dashboard
      </Typography>

      {/* Health Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {healthStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ color: stat.color, fontWeight: 'bold' }}>
                      {stat.value}
                    </Typography>
                    <Chip 
                      label={stat.status} 
                      size="small" 
                      sx={{ 
                        bgcolor: stat.color, 
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
        {/* Upcoming Appointments */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#011D4D' }}>
                  Upcoming Appointments
                </Typography>
                <Button size="small" startIcon={<Add />}>
                  Book Appointment
                </Button>
              </Box>
              <List>
                {upcomingAppointments.map((appointment) => (
                  <ListItem key={appointment.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#1282A2', width: 32, height: 32 }}>
                        <LocalHospital />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${appointment.doctor} - ${appointment.date}`}
                      secondary={`${appointment.time} • ${appointment.type}`}
                      primaryTypographyProps={{ fontSize: '0.9rem' }}
                      secondaryTypographyProps={{ fontSize: '0.8rem' }}
                    />
                    <Chip
                      label={appointment.status}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(appointment.status),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Current Medications */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#011D4D' }}>
                  Current Medications
                </Typography>
                <Button size="small" startIcon={<Visibility />}>
                  View All
                </Button>
              </Box>
              <List>
                {currentMedications.map((medication) => (
                  <ListItem key={medication.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#63372C', width: 32, height: 32 }}>
                        <Medication />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${medication.name} - ${medication.dosage}`}
                      secondary={`${medication.frequency} • Next: ${medication.nextDose}`}
                      primaryTypographyProps={{ fontSize: '0.9rem' }}
                      secondaryTypographyProps={{ fontSize: '0.8rem' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Health Reminders */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#011D4D' }}>
                Today's Health Reminders
              </Typography>
              <List>
                {healthReminders.map((reminder) => (
                  <ListItem key={reminder.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        bgcolor: reminder.completed ? '#4caf50' : '#ff9800', 
                        width: 32, 
                        height: 32 
                      }}>
                        {reminder.completed ? <CheckCircle /> : <Warning />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={reminder.task}
                      secondary={`Due: ${reminder.time}`}
                      primaryTypographyProps={{ fontSize: '0.9rem' }}
                      secondaryTypographyProps={{ fontSize: '0.8rem' }}
                    />
                    <Chip
                      label={reminder.completed ? 'Done' : 'Pending'}
                      size="small"
                      sx={{
                        bgcolor: reminder.completed ? '#4caf50' : '#ff9800',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Lab Results */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#011D4D' }}>
                Recent Lab Results
              </Typography>
              <List>
                {recentLabResults.map((result) => (
                  <ListItem key={result.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#034078', width: 32, height: 32 }}>
                        <Assessment />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${result.test} - ${result.result}`}
                      secondary={`Date: ${result.date}`}
                      primaryTypographyProps={{ fontSize: '0.9rem' }}
                      secondaryTypographyProps={{ fontSize: '0.8rem' }}
                    />
                    <Chip
                      label={result.status}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(result.status),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Health Progress */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#011D4D' }}>
                Health Progress This Month
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Medication Adherence
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
                      Appointment Attendance
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={100} 
                      sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      100% - Perfect
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Health Goals Achievement
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={78} 
                      sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      78% - Good
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

export default PatientOverview;
