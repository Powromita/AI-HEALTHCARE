import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Medication,
  Schedule,
  Warning,
  CheckCircle,
  Add,
  LocalHospital,
  CalendarToday
} from '@mui/icons-material';

function MyMedications() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);

  // Mock data
  const medications = [
    {
      id: 1,
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      startDate: '2024-01-01',
      endDate: '2024-04-01',
      prescribedBy: 'Dr. Sarah Smith',
      instructions: 'Take with food in the morning',
      sideEffects: 'Dry cough, dizziness',
      status: 'Active',
      nextDose: 'Today 8:00 AM',
      adherence: 95
    },
    {
      id: 2,
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      startDate: '2024-01-05',
      endDate: '2024-02-05',
      prescribedBy: 'Dr. Sarah Smith',
      instructions: 'Take with meals',
      sideEffects: 'Nausea, diarrhea',
      status: 'Active',
      nextDose: 'Today 2:00 PM',
      adherence: 88
    },
    {
      id: 3,
      name: 'Atorvastatin',
      dosage: '20mg',
      frequency: 'Once daily',
      startDate: '2023-11-20',
      endDate: '2024-05-20',
      prescribedBy: 'Dr. Sarah Smith',
      instructions: 'Take at bedtime',
      sideEffects: 'Muscle pain, liver problems',
      status: 'Active',
      nextDose: 'Tomorrow 10:00 PM',
      adherence: 92
    }
  ];

  const getStatusColor = (status) => {
    return status === 'Active' ? '#4caf50' : '#f44336';
  };

  const getAdherenceColor = (adherence) => {
    if (adherence >= 90) return '#4caf50';
    if (adherence >= 80) return '#ff9800';
    return '#f44336';
  };

  const handleMedicationTaken = (medicationId) => {
    // This would typically update the medication status
    console.log(`Medication ${medicationId} marked as taken`);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: '#011D4D', mb: 3 }}>
        My Medications
      </Typography>

      {/* Medication Adherence Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: '#011D4D' }}>
            Medication Adherence Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Overall Adherence
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
                  On-time Doses
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
                  Missed Doses This Week
                </Typography>
                <Typography variant="h4" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                  1
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Medications List */}
      <Grid container spacing={3}>
        {medications.map((medication) => (
          <Grid item xs={12} md={6} key={medication.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: '#63372C', mr: 2 }}>
                      <Medication />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#011D4D' }}>
                        {medication.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {medication.dosage} • {medication.frequency}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={medication.status}
                    size="small"
                    sx={{
                      bgcolor: getStatusColor(medication.status),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Prescribed by: {medication.prescribedBy}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Instructions: {medication.instructions}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Next dose: {medication.nextDose}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Adherence Rate
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={medication.adherence} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      bgcolor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getAdherenceColor(medication.adherence)
                      }
                    }}
                  />
                  <Typography variant="caption" color="textSecondary">
                    {medication.adherence}%
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<CheckCircle />}
                    onClick={() => handleMedicationTaken(medication.id)}
                    sx={{ 
                      bgcolor: '#4caf50',
                      '&:hover': { bgcolor: '#45a049' }
                    }}
                  >
                    Mark Taken
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Schedule />}
                    sx={{ color: '#63372C', borderColor: '#63372C' }}
                  >
                    Set Reminder
                  </Button>
                </Box>

                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="caption">
                    <strong>Side Effects:</strong> {medication.sideEffects}
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Medication Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Medication</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Medication Name" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Dosage" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Frequency" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Prescribed By" />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Instructions"
                multiline
                rows={3}
                placeholder="Take with food, avoid alcohol, etc."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: '#63372C' }}>
            Add Medication
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MyMedications;
