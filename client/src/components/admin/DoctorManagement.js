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
  InputAdornment
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
  FilterList,
  MoreVert,
  LocalHospital,
  Phone,
  Email,
  Work,
  Star
} from '@mui/icons-material';

function DoctorManagement() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual API calls
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Smith',
      email: 'sarah.smith@healthcare.com',
      phone: '+1 234-567-8900',
      specialization: 'Cardiology',
      licenseNumber: 'MD12345',
      experience: '10 years',
      rating: 4.8,
      patientsCount: 156,
      status: 'Active',
      schedule: 'Mon-Fri 9AM-5PM'
    },
    {
      id: 2,
      name: 'Dr. Michael Brown',
      email: 'michael.brown@healthcare.com',
      phone: '+1 234-567-8901',
      specialization: 'Neurology',
      licenseNumber: 'MD12346',
      experience: '8 years',
      rating: 4.6,
      patientsCount: 134,
      status: 'Active',
      schedule: 'Mon-Thu 8AM-4PM'
    },
    {
      id: 3,
      name: 'Dr. Emily Johnson',
      email: 'emily.johnson@healthcare.com',
      phone: '+1 234-567-8902',
      specialization: 'Pediatrics',
      licenseNumber: 'MD12347',
      experience: '12 years',
      rating: 4.9,
      patientsCount: 189,
      status: 'On Leave',
      schedule: 'Tue-Sat 10AM-6PM'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    experience: '',
    schedule: ''
  });

  const specializations = [
    'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology',
    'Psychiatry', 'Oncology', 'Gynecology', 'Urology', 'Ophthalmology',
    'ENT', 'General Medicine', 'Emergency Medicine', 'Radiology'
  ];

  const handleOpenDialog = (doctor = null) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData(doctor);
    } else {
      setEditingDoctor(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        licenseNumber: '',
        experience: '',
        schedule: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDoctor(null);
  };

  const handleSave = () => {
    if (editingDoctor) {
      // Update existing doctor
      setDoctors(doctors.map(d => d.id === editingDoctor.id ? { 
        ...formData, 
        id: editingDoctor.id,
        rating: editingDoctor.rating,
        patientsCount: editingDoctor.patientsCount,
        status: editingDoctor.status
      } : d));
    } else {
      // Add new doctor
      const newDoctor = { 
        ...formData, 
        id: Date.now(), 
        rating: 0,
        patientsCount: 0,
        status: 'Active'
      };
      setDoctors([...doctors, newDoctor]);
    }
    handleCloseDialog();
  };

  const handleDelete = (doctorId) => {
    setDoctors(doctors.filter(d => d.id !== doctorId));
    setAnchorEl(null);
  };

  const handleMenuOpen = (event, doctor) => {
    setAnchorEl(event.currentTarget);
    setSelectedDoctor(doctor);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDoctor(null);
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#4caf50';
      case 'On Leave': return '#ff9800';
      case 'Inactive': return '#f44336';
      default: return '#757575';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#011D4D' }}>
          Doctor Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: '#011D4D', '&:hover': { bgcolor: '#034078' } }}
        >
          Add Doctor
        </Button>
      </Box>

      {/* Search and Filter Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search doctors..."
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

      {/* Doctors Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#E4DFDA' }}>
              <TableCell>Doctor</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Patients</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDoctors.map((doctor) => (
              <TableRow key={doctor.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: '#1282A2', mr: 2 }}>
                      <LocalHospital />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {doctor.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        License: {doctor.licenseNumber}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Email sx={{ fontSize: 16, mr: 1, color: '#011D4D' }} />
                      <Typography variant="body2">{doctor.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Phone sx={{ fontSize: 16, mr: 1, color: '#011D4D' }} />
                      <Typography variant="body2">{doctor.phone}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={doctor.specialization}
                    size="small"
                    sx={{ bgcolor: '#E4DFDA', color: '#011D4D' }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{doctor.experience}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Star sx={{ fontSize: 16, color: '#ffc107', mr: 0.5 }} />
                    <Typography variant="body2">{doctor.rating}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{doctor.patientsCount}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={doctor.status}
                    size="small"
                    sx={{
                      bgcolor: getStatusColor(doctor.status),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, doctor)}
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
        <MenuItem onClick={() => { handleOpenDialog(selectedDoctor); handleMenuClose(); }}>
          <Edit sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => { /* View doctor details */ handleMenuClose(); }}>
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => { handleDelete(selectedDoctor?.id); }}>
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Add/Edit Doctor Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="License Number"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Specialization"
                select
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              >
                {specializations.map((spec) => (
                  <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="e.g., 5 years"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Schedule"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                placeholder="e.g., Mon-Fri 9AM-5PM"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#011D4D' }}>
            {editingDoctor ? 'Update' : 'Add'} Doctor
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DoctorManagement;
