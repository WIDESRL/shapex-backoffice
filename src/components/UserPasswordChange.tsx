import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useClientContext } from '../Context/ClientContext';
import { useSnackbar } from '../Context/SnackbarContext';

interface UserPasswordChangeProps {
  userId: string;
}

const styles = {
  container: {
    mt: 2,
  },
  card: {
    maxWidth: 500,
    mb: 3,
  },
  cardContent: {
    p: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 500,
    color: '#333',
    mb: 2,
  },
  description: {
    fontSize: 14,
    color: '#666',
    mb: 3,
  },
  formField: {
    mb: 3,
  },
  buttonContainer: {
    display: 'flex',
    gap: 2,
    justifyContent: 'flex-end',
  },
  actionButton: {
    backgroundColor: '#E6BB4A',
    color: 'white',
    px: 3,
    py: 1,
    borderRadius: 2,
    textTransform: 'none',
    fontSize: 14,
    fontWeight: 500,
    '&:hover': {
      backgroundColor: '#d4a943',
    },
    '&:disabled': {
      backgroundColor: '#f5f5f5',
      color: '#999',
    },
  },
  outlinedButton: {
    borderColor: '#E6BB4A',
    color: '#E6BB4A',
    px: 3,
    py: 1,
    borderRadius: 2,
    textTransform: 'none',
    fontSize: 14,
    fontWeight: 500,
    '&:hover': {
      borderColor: '#d4a943',
      backgroundColor: 'rgba(230, 187, 74, 0.04)',
    },
  },
  passwordRequirements: {
    mt: 1,
    p: 2,
    backgroundColor: '#f8f9fa',
    borderRadius: 1,
  },
  requirementItem: {
    fontSize: 12,
    color: '#666',
    mb: 0.5,
  },
};

const UserPasswordChange: React.FC<UserPasswordChangeProps> = ({ userId }) => {
  const { t } = useTranslation();
  const { changeUserPassword } = useClientContext();
  const { showSnackbar } = useSnackbar();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    };
  };

  const passwordValidation = useMemo(() => validatePassword(newPassword), [newPassword]);
  
  const passwordsMatch = useMemo(() => 
    newPassword === confirmPassword && newPassword !== '', 
    [newPassword, confirmPassword]
  );
  
  const canSubmit = useMemo(() => 
    passwordValidation.isValid && passwordsMatch && !loading, 
    [passwordValidation.isValid, passwordsMatch, loading]
  );
  
  const hasData = useMemo(() => 
    newPassword !== '' || confirmPassword !== '', 
    [newPassword, confirmPassword]
  );

  const handlePasswordChange = async () => {
    if (!canSubmit) return;

    setLoading(true);
    try {
      await changeUserPassword(userId, newPassword);
      showSnackbar(t('client.anagraficapage.passwordChange.messages.success'), 'success');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordRequirements(false);
    } catch (error) {
      console.error('Error changing password:', error);
      showSnackbar(t('client.anagraficapage.passwordChange.messages.error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordRequirements(false);
  };

  return (
    <Box sx={styles.container}>
      <Card sx={styles.card}>
        <CardContent sx={styles.cardContent}>
          <Typography sx={styles.title}>
            {t('client.anagraficapage.passwordChange.title')}
          </Typography>
          
          <Typography sx={styles.description}>
            {t('client.anagraficapage.passwordChange.description')}
          </Typography>

          <Box sx={styles.formField}>
            <TextField
              label={t('client.anagraficapage.passwordChange.fields.newPassword')}
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setShowPasswordRequirements(e.target.value.length > 0);
              }}
              variant="outlined"
              size="small"
              fullWidth
              error={newPassword !== '' && !passwordValidation.isValid}
            />
            
            {showPasswordRequirements && (
              <Box sx={styles.passwordRequirements}>
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                  {t('client.anagraficapage.passwordChange.requirements.title')}
                </Typography>
                <Typography 
                  sx={{
                    ...styles.requirementItem,
                    color: passwordValidation.minLength ? '#4caf50' : '#f44336'
                  }}
                >
                  ✓ {t('client.anagraficapage.passwordChange.requirements.minLength')}
                </Typography>
                <Typography 
                  sx={{
                    ...styles.requirementItem,
                    color: passwordValidation.hasUpperCase ? '#4caf50' : '#f44336'
                  }}
                >
                  ✓ {t('client.anagraficapage.passwordChange.requirements.upperCase')}
                </Typography>
                <Typography 
                  sx={{
                    ...styles.requirementItem,
                    color: passwordValidation.hasLowerCase ? '#4caf50' : '#f44336'
                  }}
                >
                  ✓ {t('client.anagraficapage.passwordChange.requirements.lowerCase')}
                </Typography>
                <Typography 
                  sx={{
                    ...styles.requirementItem,
                    color: passwordValidation.hasNumbers ? '#4caf50' : '#f44336'
                  }}
                >
                  ✓ {t('client.anagraficapage.passwordChange.requirements.numbers')}
                </Typography>
                <Typography 
                  sx={{
                    ...styles.requirementItem,
                    color: passwordValidation.hasSpecialChar ? '#4caf50' : '#f44336'
                  }}
                >
                  ✓ {t('client.anagraficapage.passwordChange.requirements.specialChar')}
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={styles.formField}>
            <TextField
              label={t('client.anagraficapage.passwordChange.fields.confirmPassword')}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
              error={confirmPassword !== '' && !passwordsMatch}
              helperText={
                confirmPassword !== '' && !passwordsMatch 
                  ? t('client.anagraficapage.passwordChange.validation.passwordMismatch') 
                  : ''
              }
            />
          </Box>

          <Box sx={styles.buttonContainer}>
            <Button
              variant="outlined"
              sx={styles.outlinedButton}
              onClick={handleReset}
              disabled={loading || !hasData}
            >
              {t('client.anagraficapage.passwordChange.buttons.reset')}
            </Button>
            
            <Button
              variant="contained"
              sx={styles.actionButton}
              onClick={handlePasswordChange}
              disabled={!canSubmit}
            >
              {loading && <CircularProgress size={16} sx={{ mr: 1, color: 'white' }} />}
              {t('client.anagraficapage.passwordChange.buttons.changePassword')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserPasswordChange;
