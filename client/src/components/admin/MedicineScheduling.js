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
  Medication,
  Person,
  LocalHospital,
  Schedule,
  Warning
} from '@mui/icons-material';

function MedicineScheduling() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual API calls
  const [medicines, setMedicines] = useState([
    {
      id: 1,
      patientName: 'John Doe',
      patientId: 1,
      doctorName: 'Dr. Sarah Smith',
      medicineName: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      instructions: 'Take with food',
      status: 'Active',
      stockLevel: 'High',
      sideEffects: 'Nausea, diarrhea'
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      patientId: 2,
      doctorName: 'Dr. Michael Brown',
      medicineName: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      startDate: '2024-01-10',
      endDate: '2024-04-10',
      instructions: 'Take in the morning',
      status: 'Active',
      stockLevel: 'Medium',
      sideEffects: 'Dry cough, dizziness'
    },
    {
      id: 3,
      patientName: 'Bob Johnson',
      patientId: 3,
      doctorName: 'Dr. Emily Johnson',
      medicineName: 'Albuterol',
      dosage: '90mcg',
      frequency: 'As needed',
      startDate: '2024-01-05',
      endDate: '2024-01-20',
      instructions: 'Use inhaler when needed',
      status: 'Completed',
      stockLevel: 'Low',
      sideEffects: 'Tremor, nervousness'
    }
  ]);

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    medicineName: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
    instructions: '',
    sideEffects: ''
  });

  const commonMedicines = [
    'Metformin', 'Lisinopril', 'Albuterol', 'Atorvastatin', 'Omeprazole',
    'Amlodipine', 'Metoprolol', 'Hydrochlorothiazide', 'Sertraline', 'Tramadol'
  ];

  const frequencies = [
    'Once daily', 'Twice daily', 'Three times daily', 'Four times daily',
    'Every 6 hours', 'Every 8 hours', 'Every 12 hours', 'As needed',
    'Weekly', 'Monthly'
  ];

  const handleOpenDialog = (medicine = null) => {
    if (medicine) {
      setEditingMedicine(medicine);
      setFormData(medicine);
    } else {
      setEditingMedicine(null);
      setFormData({
        patientId: '',
        doctorId: '',
        medicineName: '',
        dosage: '',
        frequency: '',
        startDate: '',
        endDate: '',
        instructions: '',
        sideEffects: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMedicine(null);
  };

  const handleSave = () => {
    if (editingMedicine) {
      // Update existing medicine
      setMedicines(medicines.map(m => m.id === editingMedicine.id ? { 
        ...formData, 
        id: editingMedicine.id,
        patientName: 'John Doe', // This should come from patient lookup
        doctorName: 'Dr. Sarah Smith', // This should come from doctor lookup
        status: editingMedicine.status,
        stockLevel: editingMedicine.stockLevel
      } : m));
    } else {
      // Add new medicine
      const newMedicine = { 
        ...formData, 
        id: Date.now(),
        patientName: 'New Patient', // This should come from patient lookup
        doctorName: 'Dr. New Doctor', // This should come from doctor lookup
        status: 'Active',
        stockLevel: 'High'
      };
      setMedicines([...medicines, newMedicine]);
    }
    handleCloseDialog();
  };

  const handleDelete = (medicineId) => {
    setMedicines(medicines.filter(m => m.id !== medicineId));
    setAnchorEl(null);
  };

  const handleMenuOpen = (event, medicine) => {
    setAnchorEl(event.currentTarget);
    setSelectedMedicine(medicine);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMedicine(null);
  };

  const filteredMedicines = medicines.filter(medicine =>
    medicine.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#4caf50';
      case 'Completed': return '#2196f3';
      case 'Cancelled': return '#f44336';
      case 'Paused': return '#ff9800';
      default: return '#757575';
    }
  };

  const getStockColor = (level) => {
    switch (level) {
      case 'High': return '#4caf50';
      case 'Medium': return '#ff9800';
      case 'Low': return '#f44336';
      default: return '#757575';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#011D4D' }}>
          Medicine Scheduling
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: '#011D4D', '&:hover': { bgcolor: '#034078' } }}
        >
          Prescribe Medicine
        </Button>
      </Box>

      {/* Search and Filter Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search medicines..."
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

      {/* Medicines Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#E4DFDA' }}>
              <TableCell>Patient</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Medicine</TableCell>
              <TableCell>Dosage & Frequency</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Stock Level</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMedicines.map((medicine) => (
              <TableRow key={medicine.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: '#1282A2', mr: 2 }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {medicine.patientName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        ID: {medicine.patientId}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: '#63372C', mr: 2 }}>
                      <LocalHospital />
                    </Avatar>
                    <Typography variant="body2">{medicine.doctorName}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {medicine.medicineName}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {medicine.instructions}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {medicine.dosage}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {medicine.frequency}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {medicine.startDate} to {medicine.endDate}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={medicine.stockLevel}
                    size="small"
                    sx={{
                      bgcolor: getStockColor(medicine.stockLevel),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                    icon={medicine.stockLevel === 'Low' ? <Warning /> : null}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={medicine.status}
                    size="small"
                    sx={{
                      bgcolor: getStatusColor(medicine.status),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, medicine)}
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
        <MenuItem onClick={() => { handleOpenDialog(selectedMedicine); handleMenuClose(); }}>
          <Edit sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => { /* View medicine details */ handleMenuClose(); }}>
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => { handleDelete(selectedMedicine?.id); }}>
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Add/Edit Medicine Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingMedicine ? 'Edit Medicine Prescription' : 'Prescribe New Medicine'}
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
                <InputLabel>Medicine Name</InputLabel>
                <Select
                  value={formData.medicineName}
                  label="Medicine Name"
                  onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                >
                  {commonMedicines.map((medicine) => (
                    <MenuItem key={medicine} value={medicine}>{medicine}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dosage"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                placeholder="e.g., 500mg, 10ml"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={formData.frequency}
                  label="Frequency"
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                >
                  {frequencies.map((freq) => (
                    <MenuItem key={freq} value={freq}>{freq}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Instructions"
                multiline
                rows={2}
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                placeholder="e.g., Take with food, Avoid alcohol"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Side Effects"
                multiline
                rows={2}
                value={formData.sideEffects}
                onChange={(e) => setFormData({ ...formData, sideEffects: e.target.value })}
                placeholder="Common side effects to watch for..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#011D4D' }}>
            {editingMedicine ? 'Update' : 'Prescribe'} Medicine
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MedicineScheduling;
