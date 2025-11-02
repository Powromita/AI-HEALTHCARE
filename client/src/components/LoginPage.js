import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import {
  AdminPanelSettings,
  LocalHospital,
  Person,
  Login as LoginIcon,
  PersonAdd
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function LoginPage() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    phone: '',
    specialization: '', // for doctors
    licenseNumber: '' // for doctors
  });

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Determine role from email for demo purposes
    let role = 'patient';
    if (loginData.email.includes('admin')) role = 'admin';
    else if (loginData.email.includes('doctor')) role = 'doctor';

    const result = await login(loginData.email, loginData.password, role);
    
    if (result.success) {
      navigate(`/${role}`);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const result = await signup(signupData);
    
    if (result.success) {
      navigate(`/${signupData.role}`);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const roleCards = [
    {
      role: 'admin',
      title: 'Admin',
      description: 'Manage the entire healthcare system',
      icon: <AdminPanelSettings sx={{ fontSize: 40 }} />,
      color: '#011D4D'
    },
    {
      role: 'doctor',
      title: 'Doctor',
      description: 'Manage patients and treatments',
      icon: <LocalHospital sx={{ fontSize: 40 }} />,
      color: '#1282A2'
    },
    {
      role: 'patient',
      title: 'Patient',
      description: 'Track your health and appointments',
      icon: <Person sx={{ fontSize: 40 }} />,
      color: '#63372C'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          AI Healthcare System
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Comprehensive Healthcare Management Platform
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h5" gutterBottom align="center">
              Choose Your Role
            </Typography>
            <Grid container spacing={2}>
              {roleCards.map((card) => (
                <Grid item xs={12} key={card.role}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      border: signupData.role === card.role ? `2px solid ${card.color}` : '1px solid #ddd',
                      '&:hover': { boxShadow: 3 }
                    }}
                    onClick={() => setSignupData({...signupData, role: card.role})}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      <Avatar sx={{ bgcolor: card.color, mx: 'auto', mb: 1 }}>
                        {card.icon}
                      </Avatar>
                      <Typography variant="h6">{card.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {card.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={3}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} centered>
                <Tab 
                  icon={<LoginIcon />} 
                  label="Login" 
                  iconPosition="start"
                />
                <Tab 
                  icon={<PersonAdd />} 
                  label="Sign Up" 
                  iconPosition="start"
                />
              </Tabs>
            </Box>

            {error && (
              <Alert severity="error" sx={{ m: 2 }}>
                {error}
              </Alert>
            )}

            <TabPanel value={tabValue} index={0}>
              <Box component="form" onSubmit={handleLogin}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  margin="normal"
                  required
                  placeholder="admin@healthcare.com, doctor@healthcare.com, or patient@healthcare.com"
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  margin="normal"
                  required
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Login'}
                </Button>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box component="form" onSubmit={handleSignup}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={signupData.name}
                  onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={signupData.phone}
                  onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                  margin="normal"
                  required
                />
                
                {signupData.role === 'doctor' && (
                  <>
                    <TextField
                      fullWidth
                      label="Specialization"
                      value={signupData.specialization}
                      onChange={(e) => setSignupData({...signupData, specialization: e.target.value})}
                      margin="normal"
                      required
                    />
                    <TextField
                      fullWidth
                      label="License Number"
                      value={signupData.licenseNumber}
                      onChange={(e) => setSignupData({...signupData, licenseNumber: e.target.value})}
                      margin="normal"
                      required
                    />
                  </>
                )}

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={signupData.password}
                  onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                  margin="normal"
                  required
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Sign Up'}
                </Button>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default LoginPage;
