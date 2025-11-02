import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Add,
  TrendingUp,
  Favorite,
  Assessment,
  Scale,
  Thermostat,
  MonitorHeart,
  Schedule
} from '@mui/icons-material';

function HealthTracking() {
  const [trackingType, setTrackingType] = useState('bloodPressure');
  const [openDialog, setOpenDialog] = useState(false);

  // Mock data
  const trackingData = [
    { id: 1, type: 'Blood Pressure', value: '130/85', date: '2024-01-15', time: '08:00 AM', status: 'Normal' },
    { id: 2, type: 'Heart Rate', value: '72 bpm', date: '2024-01-15', time: '08:00 AM', status: 'Good' },
    { id: 3, type: 'Weight', value: '180 lbs', date: '2024-01-14', time: '07:30 AM', status: 'Stable' },
    { id: 4, type: 'Blood Sugar', value: '95 mg/dL', date: '2024-01-14', time: '09:00 AM', status: 'Normal' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Normal': return '#4caf50';
      case 'Good': return '#4caf50';
      case 'Stable': return '#ff9800';
      case 'High': return '#f44336';
      default: return '#757575';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Blood Pressure': return <MonitorHeart />;
      case 'Heart Rate': return <Favorite />;
      case 'Weight': return <Scale />;
      case 'Blood Sugar': return <Assessment />;
      default: return <TrendingUp />;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#011D4D' }}>
          Health Tracking
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
          sx={{ bgcolor: '#63372C' }}
        >
          Add Reading
        </Button>
      </Box>

      {/* Health Trends */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Blood Pressure
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ color: '#1282A2', fontWeight: 'bold' }}>
                    130/85
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Last reading: Today
                  </Typography>
                </Box>
                <MonitorHeart sx={{ fontSize: 40, color: '#1282A2' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Heart Rate
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                    72
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    bpm
                  </Typography>
                </Box>
                <Favorite sx={{ fontSize: 40, color: '#f44336' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Weight
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                    180
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    lbs
                  </Typography>
                </Box>
                <Scale sx={{ fontSize: 40, color: '#ff9800' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Blood Sugar
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                    95
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    mg/dL
                  </Typography>
                </Box>
                <Assessment sx={{ fontSize: 40, color: '#4caf50' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tracking History */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: '#011D4D' }}>
            Recent Readings
          </Typography>
          <List>
            {trackingData.map((data) => (
              <ListItem key={data.id} divider>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: '#1282A2' }}>
                    {getIcon(data.type)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={`${data.type}: ${data.value}`}
                  secondary={`${data.date} at ${data.time}`}
                />
                <Chip
                  label={data.status}
                  size="small"
                  sx={{
                    bgcolor: getStatusColor(data.status),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Add Reading Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Health Reading</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Reading Type</InputLabel>
                <Select
                  value={trackingType}
                  label="Reading Type"
                  onChange={(e) => setTrackingType(e.target.value)}
                >
                  <MenuItem value="bloodPressure">Blood Pressure</MenuItem>
                  <MenuItem value="heartRate">Heart Rate</MenuItem>
                  <MenuItem value="weight">Weight</MenuItem>
                  <MenuItem value="bloodSugar">Blood Sugar</MenuItem>
                  <MenuItem value="temperature">Temperature</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Value"
                placeholder={trackingType === 'bloodPressure' ? '120/80' : 
                           trackingType === 'heartRate' ? '72' :
                           trackingType === 'weight' ? '180' :
                           trackingType === 'bloodSugar' ? '95' : '98.6'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Time"
                type="time"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={2}
                placeholder="Any additional notes about this reading..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: '#63372C' }}>
            Add Reading
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default HealthTracking;
