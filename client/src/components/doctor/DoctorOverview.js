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
  LinearProgress,
  Button
} from '@mui/material';
import {
  People,
  Schedule,
  Medication,
  TrendingUp,
  Warning,
  CheckCircle,
  Add,
  Visibility
} from '@mui/icons-material';

function DoctorOverview() {
  // Mock data - replace with actual API calls
  const stats = [
    { title: 'My Patients', value: 45, icon: <People />, color: '#1282A2', change: '+3 this week' },
    { title: 'Today\'s Appointments', value: 8, icon: <Schedule />, color: '#011D4D', change: '2 completed' },
    { title: 'Active Prescriptions', value: 23, icon: <Medication />, color: '#63372C', change: '+5 this week' },
    { title: 'Patient Satisfaction', value: 4.8, icon: <TrendingUp />, color: '#034078', change: '+0.2 this month' }
  ];

  const todayAppointments = [
    { id: 1, patient: 'John Doe', time: '09:00 AM', type: 'Follow-up', status: 'Completed' },
    { id: 2, patient: 'Jane Smith', time: '10:30 AM', type: 'Consultation', status: 'In Progress' },
    { id: 3, patient: 'Bob Johnson', time: '02:00 PM', type: 'Check-up', status: 'Scheduled' },
    { id: 4, patient: 'Alice Brown', time: '03:30 PM', type: 'Treatment', status: 'Scheduled' }
  ];

  const recentPatients = [
    { id: 1, name: 'Sarah Wilson', lastVisit: '2024-01-15', condition: 'Hypertension', status: 'Stable' },
    { id: 2, name: 'Mike Davis', lastVisit: '2024-01-14', condition: 'Diabetes', status: 'Improving' },
    { id: 3, name: 'Lisa Garcia', lastVisit: '2024-01-13', condition: 'Asthma', status: 'Stable' },
    { id: 4, name: 'Tom Anderson', lastVisit: '2024-01-12', condition: 'Cardiac', status: 'Monitoring' }
  ];

  const urgentTasks = [
    { id: 1, task: 'Review lab results for John Doe', priority: 'High', due: 'Today' },
    { id: 2, task: 'Update prescription for Jane Smith', priority: 'Medium', due: 'Tomorrow' },
    { id: 3, task: 'Schedule follow-up for Bob Johnson', priority: 'Low', due: 'This week' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#4caf50';
      case 'In Progress': return '#ff9800';
      case 'Scheduled': return '#2196f3';
      case 'Stable': return '#4caf50';
      case 'Improving': return '#4caf50';
      case 'Monitoring': return '#ff9800';
      default: return '#757575';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#f44336';
      case 'Medium': return '#ff9800';
      case 'Low': return '#4caf50';
      default: return '#757575';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: '#011D4D', mb: 3 }}>
        Doctor Dashboard
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
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                      {stat.change}
                    </Typography>
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
        {/* Today's Appointments */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#011D4D' }}>
                  Today's Appointments
                </Typography>
                <Button size="small" startIcon={<Add />}>
                  Add
                </Button>
              </Box>
              <List>
                {todayAppointments.map((appointment) => (
                  <ListItem key={appointment.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: getStatusColor(appointment.status), width: 32, height: 32 }}>
                        <Schedule />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${appointment.patient} - ${appointment.time}`}
                      secondary={`${appointment.type} • ${appointment.status}`}
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

        {/* Recent Patients */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#011D4D' }}>
                  Recent Patients
                </Typography>
                <Button size="small" startIcon={<Visibility />}>
                  View All
                </Button>
              </Box>
              <List>
                {recentPatients.map((patient) => (
                  <ListItem key={patient.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#1282A2', width: 32, height: 32 }}>
                        <People />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={patient.name}
                      secondary={`${patient.condition} • Last visit: ${patient.lastVisit}`}
                      primaryTypographyProps={{ fontSize: '0.9rem' }}
                      secondaryTypographyProps={{ fontSize: '0.8rem' }}
                    />
                    <Chip
                      label={patient.status}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(patient.status),
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

        {/* Urgent Tasks */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#011D4D' }}>
                Urgent Tasks
              </Typography>
              <List>
                {urgentTasks.map((task) => (
                  <ListItem key={task.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: getPriorityColor(task.priority), width: 32, height: 32 }}>
                        <Warning />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={task.task}
                      secondary={`Due: ${task.due}`}
                      primaryTypographyProps={{ fontSize: '0.9rem' }}
                      secondaryTypographyProps={{ fontSize: '0.8rem' }}
                    />
                    <Chip
                      label={task.priority}
                      size="small"
                      sx={{
                        bgcolor: getPriorityColor(task.priority),
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

        {/* Performance Metrics */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#011D4D' }}>
                Performance Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Patient Satisfaction
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={96} 
                      sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      4.8/5.0 - Excellent
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      On-time Appointments
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={88} 
                      sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      88% - Good
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Treatment Success Rate
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
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DoctorOverview;
