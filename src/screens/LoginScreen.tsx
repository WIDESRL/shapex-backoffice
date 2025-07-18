import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../Context/AuthContext';

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login({ username, password });
      // Redirect to a protected route or dashboard
    } catch (error) {
      console.error('Login failed:', error);
      setError(t('login.errorMessage'));
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        minHeight: '100vh',
        minWidth: '100vw',
        background: 'linear-gradient(180deg, #F5B52A 0%, #E8A723 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        m: 0,
        p: 0,
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        {/* Logo */}
        <Box sx={{ mb: 4, mt: { xs: 2, md: 0 } }}>
          <img
            src="/icons/shapex.svg"
            alt="SHAPEX"
            style={{ width: 180, display: 'block', margin: '0 auto' }}
          />
        </Box>
        {/* Title */}
        <Typography variant="h4" sx={{ fontWeight: 500, mb: 1, textAlign: 'center', marginTop: 10 }}>
          {t('login.title')}
        </Typography>
        {/* Subtitle */}
        <Typography
          sx={{
            color: '#333',
            opacity: 0.7,
            fontSize: 15,
            mb: 3,
            textAlign: 'center',
            maxWidth: 320,
          }}
        >
          {t('login.subtitle')}
        </Typography>
        {/* Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 20 }}>
          <TextField
            placeholder={t('login.emailPlaceholder')}
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src="/icons/user.svg" alt="user" style={{ width: 22, height: 22 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              background: 'transparent',
              borderRadius: 8,
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: 'transparent !important', // force transparent
              },
              '& .MuiInputBase-input': {
                backgroundColor: 'transparent !important', // force transparent
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#5C460F',
              },
            }}
          />
          <TextField
            placeholder={t('login.passwordPlaceholder')}
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src="/icons/lock.svg" alt="lock" style={{ width: 22, height: 22 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              background: 'transparent',
              borderRadius: 8,
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 4,
                backgroundColor: 'transparent !important', // force transparent
              },
              '& .MuiInputBase-input': {
                backgroundColor: 'transparent !important', // force transparent
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#5C460F',
              },
            }}
          />
          {error && (
            <Typography color="error" sx={{ mt: 1, textAlign: 'center' }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="inherit"
            fullWidth
            sx={{
              mt: 2,
              borderRadius: 2,
              fontWeight: 500,
              fontSize: 18,
              background: '#fff',
              color: '#222',
              boxShadow: 'none',
              '&:hover': {
                background: '#f5f5f5',
                boxShadow: 'none',
              },
              height: 48,
            }}
          >
            {t('login.loginButton')}
          </Button>
        </form>
        {/* Bottom link */}
        <Typography
          sx={{
            mt: 6,
            fontSize: 13,
            color: '#222',
            opacity: 0.7,
            textAlign: 'center',
          }}
        >
        
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginScreen;