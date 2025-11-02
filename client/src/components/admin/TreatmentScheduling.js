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
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Avatar,
  Menu,
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
  FilterList,
  MoreVert,
  Schedule,
  Person,
  LocalHospital,
  CalendarToday
} from '@mui/icons-material';

function TreatmentScheduling() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual API calls
  const [treatments, setTreatments] = useState([
    {
      id: 1,
      patientName: 'John Doe',
      patientId: 1,
      doctorName: 'Dr. Sarah Smith',
      doctorId: 1,
      treatmentType: 'Cardiac Checkup',
      scheduledDate: '2024-01-20',
      scheduledTime: '10:00 AM',
      duration: '60 minutes',
      status: 'Scheduled',
      notes: 'Regular follow-up appointment',
      room: 'Room 101'
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      patientId: 2,
      doctorName: 'Dr. Michael Brown',
      doctorId: 2,
      treatmentType: 'Neurological Assessment',
      scheduledDate: '2024-01-21',
      scheduledTime: '02:30 PM',
      duration: '90 minutes',
      status: 'Completed',
      notes: 'MRI scan and consultation',
      room: 'Room 205'
    },
    {
      id: 3,
      patientName: 'Bob Johnson',
      patientId: 3,
      doctorName: 'Dr. Emily Johnson',
      doctorId: 3,
      treatmentType: 'Pediatric Consultation',
      scheduledDate: '2024-01-22',
      scheduledTime: '09:30 AM',
      duration: '45 minutes',
      status: 'Cancelled',
      notes: 'Patient cancelled due to illness',
      room: 'Room 103'
    }
  ]);

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    treatmentType: '',
    scheduledDate: '',
    scheduledTime: '',
    duration: '',
    notes: '',
    room: ''
  });

  const treatmentTypes = [
    'Consultation', 'Follow-up', 'Surgery', 'Therapy', 'Diagnostic Test',
    'Emergency Treatment', 'Preventive Care', 'Rehabilitation', 'Check-up'
  ];

  const rooms = ['Room 101', 'Room 102', 'Room 103', 'Room 201', 'Room 202', 'Room 205', 'Room 301', 'Room 302'];

  const handleOpenDialog = (treatment = null) => {
    if (treatment) {
      setEditingTreatment(treatment);
      setFormData(treatment);
    } else {
      setEditingTreatment(null);
      setFormData({
        patientId: '',
        doctorId: '',
        treatmentType: '',
        scheduledDate: '',
        scheduledTime: '',
        duration: '',
        notes: '',
        room: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTreatment(null);
  };

  const handleSave = () => {
    if (editingTreatment) {
      // Update existing treatment
      setTreatments(treatments.map(t => t.id === editingTreatment.id ? { 
        ...formData, 
        id: editingTreatment.id,
        patientName: 'John Doe', // This should come from patient lookup
        doctorName: 'Dr. Sarah Smith' // This should come from doctor lookup
      } : t));
    } else {
      // Add new treatment
      const newTreatment = { 
        ...formData, 
        id: Date.now(),
        patientName: 'New Patient', // This should come from patient lookup
        doctorName: 'Dr. New Doctor' // This should come from doctor lookup
      };
      setTreatments([...treatments, newTreatment]);
    }
    handleCloseDialog();
  };

  const handleDelete = (treatmentId) => {
    setTreatments(treatments.filter(t => t.id !== treatmentId));
    setAnchorEl(null);
  };

  const handleMenuOpen = (event, treatment) => {
    setAnchorEl(event.currentTarget);
    setSelectedTreatment(treatment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTreatment(null);
  };

  const filteredTreatments = treatments.filter(treatment =>
    treatment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    treatment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    treatment.treatmentType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return '#2196f3';
      case 'Completed': return '#4caf50';
      case 'Cancelled': return '#f44336';
      case 'In Progress': return '#ff9800';
      default: return '#757575';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#011D4D' }}>
          Treatment Scheduling
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: '#011D4D', '&:hover': { bgcolor: '#034078' } }}
        >
          Schedule Treatment
        </Button>
      </Box>

      {/* Search and Filter Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search treatments..."
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
          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              sx={{ color: '#011D4D', borderColor: '#011D4D' }}
            >
              Filter
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Treatments Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#E4DFDA' }}>
              <TableCell>Patient</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Treatment Type</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTreatments.map((treatment) => (
              <TableRow key={treatment.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: '#1282A2', mr: 2 }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {treatment.patientName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        ID: {treatment.patientId}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: '#63372C', mr: 2 }}>
                      <LocalHospital />
                    </Avatar>
                    <Typography variant="body2">{treatment.doctorName}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={treatment.treatmentType}
                    size="small"
                    sx={{ bgcolor: '#E4DFDA', color: '#011D4D' }}
                  />
                </TableCell>
                <TableCell>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <CalendarToday sx={{ fontSize: 16, mr: 1, color: '#011D4D' }} />
                      <Typography variant="body2">{treatment.scheduledDate}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Schedule sx={{ fontSize: 16, mr: 1, color: '#011D4D' }} />
                      <Typography variant="body2">{treatment.scheduledTime}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{treatment.duration}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{treatment.room}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={treatment.status}
                    size="small"
                    sx={{
                      bgcolor: getStatusColor(treatment.status),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, treatment)}
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
        <MenuItem onClick={() => { handleOpenDialog(selectedTreatment); handleMenuClose(); }}>
          <Edit sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => { /* View treatment details */ handleMenuClose(); }}>
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => { handleDelete(selectedTreatment?.id); }}>
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Add/Edit Treatment Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTreatment ? 'Edit Treatment Schedule' : 'Schedule New Treatment'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Patient</InputLabel>
                <Select
                  value={formData.patientId}
                  label="Patient"
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                >
                  <MenuItem value={1}>John Doe</MenuItem>
                  <MenuItem value={2}>Jane Smith</MenuItem>
                  <MenuItem value={3}>Bob Johnson</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Doctor</InputLabel>
                <Select
                  value={formData.doctorId}
                  label="Doctor"
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                >
                  <MenuItem value={1}>Dr. Sarah Smith</MenuItem>
                  <MenuItem value={2}>Dr. Michael Brown</MenuItem>
                  <MenuItem value={3}>Dr. Emily Johnson</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Treatment Type</InputLabel>
                <Select
                  value={formData.treatmentType}
                  label="Treatment Type"
                  onChange={(e) => setFormData({ ...formData, treatmentType: e.target.value })}
                >
                  {treatmentTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Room</InputLabel>
                <Select
                  value={formData.room}
                  label="Room"
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                >
                  {rooms.map((room) => (
                    <MenuItem key={room} value={room}>{room}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Scheduled Date"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Scheduled Time"
                type="time"
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 60 minutes"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes or instructions..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#011D4D' }}>
            {editingTreatment ? 'Update' : 'Schedule'} Treatment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TreatmentScheduling;
