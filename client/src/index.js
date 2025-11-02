import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';

// Blue Jungle Color Palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#011D4D', // Dark blue
      light: '#034078', // Medium blue
      dark: '#011D4D',
    },
    secondary: {
      main: '#1282A2', // Teal blue
      light: '#1282A2',
      dark: '#034078',
    },
    background: {
      default: '#E4DFDA', // Light off-white
      paper: '#FFFFFF',
    },
    text: {
      primary: '#011D4D',
      secondary: '#63372C', // Brown
    },
    accent: {
      main: '#63372C', // Brown
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      color: '#011D4D',
      fontWeight: 600,
    },
    h2: {
      color: '#011D4D',
      fontWeight: 500,
    },
    h3: {
      color: '#011D4D',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(1, 29, 77, 0.1)',
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
