import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar
} from '@mui/material';
import {
  Add,
  Schedule,
  LocalHospital,
  Cancel,
  Edit
} from '@mui/icons-material';

function MyAppointments() {
  const [openDialog, setOpenDialog] = useState(false);

  // Mock data
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctor: 'Dr. Sarah Smith',
      specialty: 'Cardiology',
      date: '2024-01-22',
      time: '10:00 AM',
      type: 'Follow-up',
      status: 'Scheduled',
      notes: 'Regular check-up for hypertension'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Brown',
      specialty: 'Neurology',
      date: '2024-01-25',
      time: '02:30 PM',
      type: 'Consultation',
      status: 'Scheduled',
      notes: 'New patient consultation'
    },
    {
      id: 3,
      doctor: 'Dr. Sarah Smith',
      specialty: 'Cardiology',
      date: '2024-01-15',
      time: '09:30 AM',
      type: 'Check-up',
      status: 'Completed',
      notes: 'Blood pressure monitoring'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return '#2196f3';
      case 'Completed': return '#4caf50';
      case 'Cancelled': return '#f44336';
      case 'Rescheduled': return '#ff9800';
      default: return '#757575';
    }
  };

  const handleCancelAppointment = (appointmentId) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'Cancelled' } : apt
    ));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#011D4D' }}>
          My Appointments
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
          sx={{ bgcolor: '#63372C', '&:hover': { bgcolor: '#4a2c1f' } }}
        >
          Book Appointment
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#E4DFDA' }}>
              <TableCell>Doctor</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: '#1282A2', mr: 2 }}>
                      <LocalHospital />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {appointment.doctor}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {appointment.specialty}
                      </Typography>
                    </Box>
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
                <TableCell>
                  <Chip
                    label={appointment.status}
                    size="small"
                    sx={{
                      bgcolor: getStatusColor(appointment.status),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 200 }}>
                    {appointment.notes}
                  </Typography>
                </TableCell>
                <TableCell>
                  {appointment.status === 'Scheduled' && (
                    <>
                      <Button size="small" startIcon={<Edit />} sx={{ mr: 1 }}>
                        Reschedule
                      </Button>
                      <Button 
                        size="small" 
                        startIcon={<Cancel />} 
                        color="error"
                        onClick={() => handleCancelAppointment(appointment.id)}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Book Appointment Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Book New Appointment</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Doctor</InputLabel>
                <Select label="Doctor">
                  <MenuItem value="dr-smith">Dr. Sarah Smith - Cardiology</MenuItem>
                  <MenuItem value="dr-brown">Dr. Michael Brown - Neurology</MenuItem>
                  <MenuItem value="dr-johnson">Dr. Emily Johnson - Pediatrics</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Appointment Type</InputLabel>
                <Select label="Appointment Type">
                  <MenuItem value="consultation">Consultation</MenuItem>
                  <MenuItem value="follow-up">Follow-up</MenuItem>
                  <MenuItem value="check-up">Check-up</MenuItem>
                  <MenuItem value="emergency">Emergency</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Preferred Date"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Preferred Time"
                type="time"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason for Visit"
                multiline
                rows={3}
                placeholder="Please describe your symptoms or reason for the appointment..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: '#63372C' }}>
            Book Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MyAppointments;
