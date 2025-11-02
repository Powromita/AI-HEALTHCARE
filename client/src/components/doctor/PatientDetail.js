import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Avatar,
  Divider,
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
  ArrowBack,
  Edit,
  Add,
  Medication,
  Schedule,
  Assessment,
  Warning,
  CheckCircle,
  Person,
  Phone,
  Email,
  LocationOn,
  CalendarToday,
  LocalHospital
} from '@mui/icons-material';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`patient-tabpanel-${index}`}
      aria-labelledby={`patient-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');

  // Mock data - replace with actual API calls
  const patient = {
    id: parseInt(id),
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 234-567-8900',
    age: 35,
    gender: 'Male',
    address: '123 Main St, City, State 12345',
    emergencyContact: 'Jane Doe - +1 234-567-8901',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Shellfish'],
    medicalHistory: [
      { date: '2024-01-15', condition: 'Hypertension', status: 'Active' },
      { date: '2023-12-10', condition: 'High Cholesterol', status: 'Controlled' },
      { date: '2023-08-20', condition: 'Minor Surgery', status: 'Recovered' }
    ],
    currentMedications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', startDate: '2024-01-01' },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', startDate: '2023-12-15' },
      { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', startDate: '2023-11-20' }
    ],
    appointments: [
      { date: '2024-01-22', time: '10:00 AM', type: 'Follow-up', status: 'Scheduled' },
      { date: '2024-01-15', time: '09:30 AM', type: 'Consultation', status: 'Completed' },
      { date: '2024-01-08', time: '02:00 PM', type: 'Check-up', status: 'Completed' }
    ],
    vitalSigns: [
      { date: '2024-01-15', bloodPressure: '130/85', heartRate: '72', temperature: '98.6°F', weight: '180 lbs' },
      { date: '2024-01-08', bloodPressure: '135/88', heartRate: '75', temperature: '98.4°F', weight: '182 lbs' }
    ],
    labResults: [
      { date: '2024-01-15', test: 'Blood Glucose', result: '95 mg/dL', status: 'Normal' },
      { date: '2024-01-15', test: 'Cholesterol', result: '185 mg/dL', status: 'Normal' },
      { date: '2024-01-08', test: 'HbA1c', result: '6.2%', status: 'Good' }
    ]
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogType('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#f44336';
      case 'Controlled': return '#4caf50';
      case 'Recovered': return '#2196f3';
      case 'Scheduled': return '#ff9800';
      case 'Completed': return '#4caf50';
      case 'Normal': return '#4caf50';
      case 'Good': return '#4caf50';
      default: return '#757575';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/doctor/patients')}
          sx={{ mr: 2 }}
        >
          Back to Patients
        </Button>
        <Typography variant="h4" sx={{ color: '#011D4D', flexGrow: 1 }}>
          Patient Details
        </Typography>
        <Button
          variant="contained"
          startIcon={<Edit />}
          sx={{ bgcolor: '#1282A2' }}
        >
          Edit Patient
        </Button>
      </Box>

      {/* Patient Info Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#1282A2', width: 80, height: 80, mr: 2 }}>
                  <Person sx={{ fontSize: 40 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#011D4D' }}>
                    {patient.name}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Patient ID: {patient.id}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={9}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Email sx={{ fontSize: 20, mr: 1, color: '#011D4D' }} />
                    <Typography variant="body2">{patient.email}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Phone sx={{ fontSize: 20, mr: 1, color: '#011D4D' }} />
                    <Typography variant="body2">{patient.phone}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Person sx={{ fontSize: 20, mr: 1, color: '#011D4D' }} />
                    <Typography variant="body2">{patient.age} years, {patient.gender}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ fontSize: 20, mr: 1, color: '#011D4D' }} />
                    <Typography variant="body2">{patient.address}</Typography>
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Emergency Contact:</strong> {patient.emergencyContact}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Blood Type:</strong> {patient.bloodType} | <strong>Allergies:</strong> {patient.allergies.join(', ')}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Medical History" />
            <Tab label="Current Medications" />
            <Tab label="Appointments" />
            <Tab label="Vital Signs" />
            <Tab label="Lab Results" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Medical History</Typography>
            <Button startIcon={<Add />} onClick={() => handleOpenDialog('medicalHistory')}>
              Add Entry
            </Button>
          </Box>
          <List>
            {patient.medicalHistory.map((entry, index) => (
              <ListItem key={index} divider>
                <ListItemIcon>
                  <LocalHospital sx={{ color: '#1282A2' }} />
                </ListItemIcon>
                <ListItemText
                  primary={entry.condition}
                  secondary={`Diagnosed: ${entry.date}`}
                />
                <Chip
                  label={entry.status}
                  size="small"
                  sx={{
                    bgcolor: getStatusColor(entry.status),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Current Medications</Typography>
            <Button startIcon={<Add />} onClick={() => handleOpenDialog('medication')}>
              Prescribe Medication
            </Button>
          </Box>
          <List>
            {patient.currentMedications.map((med, index) => (
              <ListItem key={index} divider>
                <ListItemIcon>
                  <Medication sx={{ color: '#63372C' }} />
                </ListItemIcon>
                <ListItemText
                  primary={`${med.name} - ${med.dosage}`}
                  secondary={`${med.frequency} • Started: ${med.startDate}`}
                />
                <Button size="small" startIcon={<Edit />}>
                  Edit
                </Button>
              </ListItem>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Appointments</Typography>
            <Button startIcon={<Add />} onClick={() => handleOpenDialog('appointment')}>
              Schedule Appointment
            </Button>
          </Box>
          <List>
            {patient.appointments.map((appointment, index) => (
              <ListItem key={index} divider>
                <ListItemIcon>
                  <Schedule sx={{ color: '#011D4D' }} />
                </ListItemIcon>
                <ListItemText
                  primary={`${appointment.type} - ${appointment.date}`}
                  secondary={`Time: ${appointment.time}`}
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
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Vital Signs</Typography>
            <Button startIcon={<Add />} onClick={() => handleOpenDialog('vitals')}>
              Record Vitals
            </Button>
          </Box>
          <List>
            {patient.vitalSigns.map((vital, index) => (
              <ListItem key={index} divider>
                <ListItemIcon>
                  <Assessment sx={{ color: '#034078' }} />
                </ListItemIcon>
                <ListItemText
                  primary={`Date: ${vital.date}`}
                  secondary={`BP: ${vital.bloodPressure} | HR: ${vital.heartRate} | Temp: ${vital.temperature} | Weight: ${vital.weight}`}
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Lab Results</Typography>
            <Button startIcon={<Add />} onClick={() => handleOpenDialog('lab')}>
              Add Lab Result
            </Button>
          </Box>
          <List>
            {patient.labResults.map((result, index) => (
              <ListItem key={index} divider>
                <ListItemIcon>
                  <Assessment sx={{ color: '#1282A2' }} />
                </ListItemIcon>
                <ListItemText
                  primary={`${result.test} - ${result.result}`}
                  secondary={`Date: ${result.date}`}
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
        </TabPanel>
      </Card>

      {/* Add Entry Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add {dialogType === 'medicalHistory' ? 'Medical History Entry' :
                dialogType === 'medication' ? 'Medication' :
                dialogType === 'appointment' ? 'Appointment' :
                dialogType === 'vitals' ? 'Vital Signs' :
                'Lab Result'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {dialogType === 'medicalHistory' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Condition" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Date" type="date" InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select label="Status">
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Controlled">Controlled</MenuItem>
                      <MenuItem value="Recovered">Recovered</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
            {dialogType === 'medication' && (
              <>
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
                  <TextField fullWidth label="Start Date" type="date" InputLabelProps={{ shrink: true }} />
                </Grid>
              </>
            )}
            {dialogType === 'appointment' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Date" type="date" InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Time" type="time" InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select label="Type">
                      <MenuItem value="consultation">Consultation</MenuItem>
                      <MenuItem value="follow-up">Follow-up</MenuItem>
                      <MenuItem value="check-up">Check-up</MenuItem>
                      <MenuItem value="treatment">Treatment</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
            {dialogType === 'vitals' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Blood Pressure" placeholder="120/80" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Heart Rate" placeholder="72" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Temperature" placeholder="98.6°F" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Weight" placeholder="180 lbs" />
                </Grid>
              </>
            )}
            {dialogType === 'lab' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Test Name" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Result" />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select label="Status">
                      <MenuItem value="Normal">Normal</MenuItem>
                      <MenuItem value="Abnormal">Abnormal</MenuItem>
                      <MenuItem value="Good">Good</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: '#1282A2' }}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PatientDetail;
