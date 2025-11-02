import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Schedule,
  Person,
  LocalHospital
} from '@mui/icons-material';

function ScheduleManagement() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  // Mock data
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patient: 'John Doe',
      date: '2024-01-20',
      time: '09:00 AM',
      type: 'Follow-up',
      duration: '30 min',
      status: 'Scheduled',
      notes: 'Regular check-up'
    },
    {
      id: 2,
      patient: 'Jane Smith',
      date: '2024-01-20',
      time: '10:30 AM',
      type: 'Consultation',
      duration: '45 min',
      status: 'Scheduled',
      notes: 'New patient consultation'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return '#2196f3';
      case 'Completed': return '#4caf50';
      case 'Cancelled': return '#f44336';
      default: return '#757575';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#011D4D' }}>
          Schedule Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
          sx={{ bgcolor: '#1282A2' }}
        >
          Add Appointment
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#E4DFDA' }}>
              <TableCell>Patient</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Person sx={{ mr: 1, color: '#1282A2' }} />
                    {appointment.patient}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{appointment.date}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {appointment.time}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{appointment.type}</TableCell>
                <TableCell>{appointment.duration}</TableCell>
                <TableCell>
                  <Chip
                    label={appointment.status}
                    size="small"
                    sx={{
                      bgcolor: getStatusColor(appointment.status),
                      color: 'white'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <Edit />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Appointment</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Patient" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Date" type="date" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Time" type="time" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select label="Type">
                  <MenuItem value="consultation">Consultation</MenuItem>
                  <MenuItem value="follow-up">Follow-up</MenuItem>
                  <MenuItem value="check-up">Check-up</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Notes" multiline rows={3} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: '#1282A2' }}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ScheduleManagement;
