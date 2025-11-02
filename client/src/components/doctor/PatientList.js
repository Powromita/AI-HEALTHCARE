import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  IconButton,
  Chip,
  TextField,
  Grid,
  Avatar,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  Person,
  Phone,
  Email,
  Visibility,
  Edit,
  Schedule,
  Medication,
  Assessment
} from '@mui/icons-material';

function PatientList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Mock data - replace with actual API calls
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 234-567-8900',
      age: 35,
      gender: 'Male',
      condition: 'Hypertension',
      status: 'Active',
      lastVisit: '2024-01-15',
      nextAppointment: '2024-01-22',
      medications: 3,
      riskLevel: 'Low'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+1 234-567-8901',
      age: 28,
      gender: 'Female',
      condition: 'Diabetes Type 2',
      status: 'Active',
      lastVisit: '2024-01-14',
      nextAppointment: '2024-01-21',
      medications: 2,
      riskLevel: 'Medium'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@email.com',
      phone: '+1 234-567-8902',
      age: 45,
      gender: 'Male',
      condition: 'Asthma',
      status: 'Monitoring',
      lastVisit: '2024-01-10',
      nextAppointment: '2024-01-25',
      medications: 1,
      riskLevel: 'Low'
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice.brown@email.com',
      phone: '+1 234-567-8903',
      age: 52,
      gender: 'Female',
      condition: 'Cardiac Condition',
      status: 'High Risk',
      lastVisit: '2024-01-12',
      nextAppointment: '2024-01-18',
      medications: 4,
      riskLevel: 'High'
    }
  ]);

  const handleMenuOpen = (event, patient) => {
    setAnchorEl(event.currentTarget);
    setSelectedPatient(patient);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPatient(null);
  };

  const handleViewPatient = () => {
    navigate(`/doctor/patients/${selectedPatient.id}`);
    handleMenuClose();
  };

  const handleScheduleAppointment = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  const handlePrescribeMedication = () => {
    // Navigate to prescription page
    handleMenuClose();
  };

  const handleViewReports = () => {
    // Navigate to reports page
    handleMenuClose();
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#4caf50';
      case 'Monitoring': return '#ff9800';
      case 'High Risk': return '#f44336';
      case 'Inactive': return '#757575';
      default: return '#2196f3';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return '#4caf50';
      case 'Medium': return '#ff9800';
      case 'High': return '#f44336';
      default: return '#757575';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#011D4D' }}>
          My Patients
        </Typography>
        <Button
          variant="contained"
          startIcon={<Person />}
          sx={{ bgcolor: '#1282A2', '&:hover': { bgcolor: '#034078' } }}
        >
          Add Patient
        </Button>
      </Box>

      {/* Search and Filter Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Monitoring">Monitoring</MenuItem>
                <MenuItem value="High Risk">High Risk</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              sx={{ color: '#011D4D', borderColor: '#011D4D' }}
            >
              More Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Patients Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#E4DFDA' }}>
              <TableCell>Patient</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Condition</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Risk Level</TableCell>
              <TableCell>Last Visit</TableCell>
              <TableCell>Next Appointment</TableCell>
              <TableCell>Medications</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: '#1282A2', mr: 2 }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {patient.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {patient.age} years, {patient.gender}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Email sx={{ fontSize: 16, mr: 1, color: '#011D4D' }} />
                      <Typography variant="body2">{patient.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Phone sx={{ fontSize: 16, mr: 1, color: '#011D4D' }} />
                      <Typography variant="body2">{patient.phone}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {patient.condition}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={patient.status}
                    size="small"
                    sx={{
                      bgcolor: getStatusColor(patient.status),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={patient.riskLevel}
                    size="small"
                    sx={{
                      bgcolor: getRiskColor(patient.riskLevel),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{patient.lastVisit}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{patient.nextAppointment}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Medication sx={{ fontSize: 16, mr: 1, color: '#011D4D' }} />
                    <Typography variant="body2">{patient.medications}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, patient)}
                    size="small"
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewPatient}>
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleScheduleAppointment}>
          <Schedule sx={{ mr: 1 }} />
          Schedule Appointment
        </MenuItem>
        <MenuItem onClick={handlePrescribeMedication}>
          <Medication sx={{ mr: 1 }} />
          Prescribe Medication
        </MenuItem>
        <MenuItem onClick={handleViewReports}>
          <Assessment sx={{ mr: 1 }} />
          View Reports
        </MenuItem>
      </Menu>

      {/* Schedule Appointment Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule Appointment</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Schedule appointment for {selectedPatient?.name}
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
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
              <FormControl fullWidth>
                <InputLabel>Appointment Type</InputLabel>
                <Select label="Appointment Type">
                  <MenuItem value="consultation">Consultation</MenuItem>
                  <MenuItem value="follow-up">Follow-up</MenuItem>
                  <MenuItem value="check-up">Check-up</MenuItem>
                  <MenuItem value="treatment">Treatment</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                placeholder="Additional notes or instructions..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: '#1282A2' }}>
            Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PatientList;
