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
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar
} from '@mui/material';
import {
  Assessment,
  Download,
  Visibility,
  LocalHospital,
  Schedule,
  Medication,
  TrendingUp,
  Warning
} from '@mui/icons-material';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`records-tabpanel-${index}`}
      aria-labelledby={`records-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function HealthRecords() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Mock data
  const labResults = [
    { id: 1, test: 'Blood Glucose', result: '95 mg/dL', status: 'Normal', date: '2024-01-15', doctor: 'Dr. Sarah Smith' },
    { id: 2, test: 'Cholesterol', result: '185 mg/dL', status: 'Normal', date: '2024-01-15', doctor: 'Dr. Sarah Smith' },
    { id: 3, test: 'HbA1c', result: '6.2%', status: 'Good', date: '2024-01-08', doctor: 'Dr. Sarah Smith' }
  ];

  const vitalSigns = [
    { id: 1, date: '2024-01-15', bloodPressure: '130/85', heartRate: '72', temperature: '98.6°F', weight: '180 lbs' },
    { id: 2, date: '2024-01-08', bloodPressure: '135/88', heartRate: '75', temperature: '98.4°F', weight: '182 lbs' }
  ];

  const medicalHistory = [
    { id: 1, date: '2024-01-15', condition: 'Hypertension', status: 'Active', doctor: 'Dr. Sarah Smith' },
    { id: 2, date: '2023-12-10', condition: 'High Cholesterol', status: 'Controlled', doctor: 'Dr. Sarah Smith' },
    { id: 3, date: '2023-08-20', condition: 'Minor Surgery', status: 'Recovered', doctor: 'Dr. Michael Brown' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Normal': return '#4caf50';
      case 'Good': return '#4caf50';
      case 'Active': return '#f44336';
      case 'Controlled': return '#4caf50';
      case 'Recovered': return '#2196f3';
      default: return '#757575';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#011D4D' }}>
          Health Records
        </Typography>
        <Button
          variant="contained"
          startIcon={<Download />}
          sx={{ bgcolor: '#63372C' }}
        >
          Download Records
        </Button>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Lab Results" />
            <Tab label="Vital Signs" />
            <Tab label="Medical History" />
            <Tab label="Imaging" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#E4DFDA' }}>
                  <TableCell>Test</TableCell>
                  <TableCell>Result</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {labResults.map((result) => (
                  <TableRow key={result.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Assessment sx={{ mr: 1, color: '#1282A2' }} />
                        {result.test}
                      </Box>
                    </TableCell>
                    <TableCell>{result.result}</TableCell>
                    <TableCell>
                      <Chip
                        label={result.status}
                        size="small"
                        sx={{
                          bgcolor: getStatusColor(result.status),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell>{result.date}</TableCell>
                    <TableCell>{result.doctor}</TableCell>
                    <TableCell>
                      <Button size="small" startIcon={<Visibility />}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#E4DFDA' }}>
                  <TableCell>Date</TableCell>
                  <TableCell>Blood Pressure</TableCell>
                  <TableCell>Heart Rate</TableCell>
                  <TableCell>Temperature</TableCell>
                  <TableCell>Weight</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vitalSigns.map((vital) => (
                  <TableRow key={vital.id} hover>
                    <TableCell>{vital.date}</TableCell>
                    <TableCell>{vital.bloodPressure}</TableCell>
                    <TableCell>{vital.heartRate}</TableCell>
                    <TableCell>{vital.temperature}</TableCell>
                    <TableCell>{vital.weight}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <List>
            {medicalHistory.map((history) => (
              <ListItem key={history.id} divider>
                <ListItemIcon>
                  <LocalHospital sx={{ color: '#1282A2' }} />
                </ListItemIcon>
                <ListItemText
                  primary={history.condition}
                  secondary={`Diagnosed: ${history.date} • Doctor: ${history.doctor}`}
                />
                <Chip
                  label={history.status}
                  size="small"
                  sx={{
                    bgcolor: getStatusColor(history.status),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" color="textSecondary" align="center" sx={{ py: 4 }}>
            No imaging records available
          </Typography>
        </TabPanel>
      </Card>
    </Box>
  );
}

export default HealthRecords;
