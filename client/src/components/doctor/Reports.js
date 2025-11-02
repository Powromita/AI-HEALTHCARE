import React from 'react';
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
  Chip
} from '@mui/material';
import {
  Assessment,
  Download,
  TrendingUp,
  People,
  Schedule,
  Medication
} from '@mui/icons-material';

function Reports() {
  // Mock data
  const reports = [
    {
      id: 1,
      name: 'Patient Summary Report',
      type: 'Patient Data',
      lastGenerated: '2024-01-15',
      status: 'Ready'
    },
    {
      id: 2,
      name: 'Appointment Statistics',
      type: 'Schedule',
      lastGenerated: '2024-01-14',
      status: 'Ready'
    },
    {
      id: 3,
      name: 'Prescription Report',
      type: 'Medications',
      lastGenerated: '2024-01-13',
      status: 'Ready'
    }
  ];

  const getStatusColor = (status) => {
    return status === 'Ready' ? '#4caf50' : '#ff9800';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: '#011D4D', mb: 3 }}>
        Reports & Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Patients
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ color: '#1282A2', fontWeight: 'bold' }}>
                    45
                  </Typography>
                </Box>
                <People sx={{ fontSize: 40, color: '#1282A2' }} />
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
                    This Month Appointments
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ color: '#011D4D', fontWeight: 'bold' }}>
                    89
                  </Typography>
                </Box>
                <Schedule sx={{ fontSize: 40, color: '#011D4D' }} />
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
                    Active Prescriptions
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ color: '#63372C', fontWeight: 'bold' }}>
                    23
                  </Typography>
                </Box>
                <Medication sx={{ fontSize: 40, color: '#63372C' }} />
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
                    Patient Satisfaction
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ color: '#034078', fontWeight: 'bold' }}>
                    4.8
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: '#034078' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Reports Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#011D4D' }}>
                  Available Reports
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Assessment />}
                  sx={{ bgcolor: '#1282A2' }}
                >
                  Generate New Report
                </Button>
              </Box>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#E4DFDA' }}>
                      <TableCell>Report Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Last Generated</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Assessment sx={{ mr: 1, color: '#1282A2' }} />
                            {report.name}
                          </Box>
                        </TableCell>
                        <TableCell>{report.type}</TableCell>
                        <TableCell>{report.lastGenerated}</TableCell>
                        <TableCell>
                          <Chip
                            label={report.status}
                            size="small"
                            sx={{
                              bgcolor: getStatusColor(report.status),
                              color: 'white'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            startIcon={<Download />}
                            sx={{ color: '#1282A2' }}
                          >
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Reports;
