import { ThemeProvider, createTheme, type ThemeOptions } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import React from 'react';
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import muiThemeJson from 'arcos-harmony-design-system/theme/mui-theme.json';
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AdditionalDetails from "./pages/AdditionalDetails";
import Account from "./pages/Account";
import Convoys from "./pages/Convoys";
import Assess from "./pages/Assess";
import Repairs from "./pages/Repairs";
import Expenses from "./pages/Expenses";


const queryClient = new QueryClient();

const inputFillColor = 'var(--theme-base-components-input-filled-enabled-fill)';
const baseTheme = createTheme(muiThemeJson as ThemeOptions);
const theme = createTheme(baseTheme, {
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: inputFillColor,
          '&:hover': {
            backgroundColor: inputFillColor,
          },
          '&.Mui-focused': {
            backgroundColor: inputFillColor,
          },
          '&.Mui-disabled': {
            backgroundColor: inputFillColor,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: inputFillColor,
          '&:hover': {
            backgroundColor: inputFillColor,
          },
          '&.Mui-focused': {
            backgroundColor: inputFillColor,
          },
          '&.Mui-disabled': {
            backgroundColor: inputFillColor,
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: inputFillColor,
          '&:hover': {
            backgroundColor: inputFillColor,
          },
          '&.Mui-focused': {
            backgroundColor: inputFillColor,
          },
          '&.Mui-disabled': {
            backgroundColor: inputFillColor,
          },
        },
      },
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', bgcolor: 'var(--theme-base-background-elevations-level-5)' }}>
        <Typography variant="body1" color="text.secondary">Loading...</Typography>
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'common.black',
          py: 4,
          px: 2,
        }}
      >
        <Box
          sx={{
            width: 393,
            maxWidth: '100%',
            height: '100vh',
            maxHeight: 850,
            bgcolor: 'background.default',
            borderRadius: '2.5rem',
            overflow: 'hidden',
            boxShadow: 12,
            border: '8px solid',
            borderColor: 'grey.900',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translate(-50%, 0)',
              width: 128,
              height: 24,
              bgcolor: 'common.black',
              borderBottomLeftRadius: '1.5rem',
              borderBottomRightRadius: '1.5rem',
              zIndex: 50,
            }}
          />

          <QueryClientProvider client={queryClient}>
            <HelmetProvider>
              <ToastContainer position="top-right" theme="dark" />
              <BrowserRouter>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                  <Route path="/convoys" element={<ProtectedRoute><Convoys /></ProtectedRoute>} />
                  <Route path="/time-tracking" element={<Navigate to="/" replace />} />
                  <Route path="/assess" element={<ProtectedRoute><Assess /></ProtectedRoute>} />
                  <Route path="/repairs" element={<ProtectedRoute><Repairs /></ProtectedRoute>} />
                  <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
                  <Route path="/additional-details" element={<ProtectedRoute><AdditionalDetails /></ProtectedRoute>} />
                  <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </HelmetProvider>
          </QueryClientProvider>
        </Box>
      </Box>
    </LocalizationProvider>
  </ThemeProvider>
);

export default App;
