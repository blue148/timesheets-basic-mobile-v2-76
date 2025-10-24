import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Typography, Alert } from '@mui/material';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-toastify';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().trim().min(1, { message: "Username is required" }).max(100, { message: "Username must be less than 100 characters" }),
  password: z.string().min(1, { message: "Password is required" })
});

export default function Auth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/', { replace: true });
      }
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      // Validate input
      const validationResult = loginSchema.safeParse({ username, password });
      
      if (!validationResult.success) {
        const errors: { username?: string; password?: string } = {};
        validationResult.error.errors.forEach((err) => {
          if (err.path[0] === 'username') errors.username = err.message;
          if (err.path[0] === 'password') errors.password = err.message;
        });
        setFieldErrors(errors);
        setLoading(false);
        return;
      }

      // Look up email from username
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('username', validationResult.data.username)
        .maybeSingle();

      if (userError) {
        throw new Error('Failed to verify username');
      }

      if (!userData) {
        throw new Error('Invalid username or password');
      }

      // Authenticate with email and password
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: validationResult.data.password,
      });

      if (authError) {
        throw new Error('Invalid username or password');
      }

      if (data.session) {
        toast.success('Successfully logged in!');
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'var(--theme-base-background-elevations-level-5)',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
            Time Tracking
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom align="center" sx={{ mb: 3 }}>
            Sign in to your account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              autoComplete="username"
              error={!!fieldErrors.username}
              helperText={fieldErrors.username}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="current-password"
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Test Usernames:
            </Typography>
            <Typography variant="caption" display="block" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
              Use the username from the users table
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
