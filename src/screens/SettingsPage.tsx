import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Button, 
  TextField, 
  Avatar, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Fade,
  CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import DialogCloseIcon from '../icons/DialogCloseIcon2';
import { useAuth } from '../Context/AuthContext';
import { useSnackbar } from '../Context/SnackbarContext';
import { uploadFileAndGetId } from '../utils/uploadFileAndGetId';


  const styles = {
    container: {
      p: 4,
      maxWidth: 800,
      mx: 'auto',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
    },
    pageTitle: {
      fontSize: 38,
      fontWeight: 400,
      color: '#616160',
      fontFamily: 'Montserrat, sans-serif',
      mb: 4,
    },
    sectionPaper: {
      p: 4,
      mb: 3,
      borderRadius: 3,
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      border: '1px solid #f0f0f0',
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 500,
      color: '#333',
      fontFamily: 'Montserrat, sans-serif',
      mb: 1,
    },
    profileSection: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      mb: 4,
    },
    avatarContainer: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
      '&:hover': {
        '& .MuiAvatar-root': {
          transform: 'scale(1.05)',
          transition: 'transform 0.2s ease-in-out',
        },
        '& .MuiTypography-caption': {
          color: '#E6BB4A',
        },
      },
    },
    avatar: {
      width: 120,
      height: 120,
      border: '4px solid #E6BB4A',
      fontSize: 48,
      fontWeight: 600,
      color: '#fff',
      backgroundColor: '#E6BB4A',
      transition: 'transform 0.2s ease-in-out',
      '&:hover': {
        borderColor: '#d4a943',
      },
    },
    formFields: {
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      flex: 1,
    },
    actionButton: {
      backgroundColor: '#E6BB4A',
      color: 'white',
      px: 4,
      py: 1.5,
      borderRadius: 2,
      textTransform: 'none',
      fontSize: 16,
      fontWeight: 500,
      '&:hover': {
        backgroundColor: '#d4a943',
      },
    },
    outlinedButton: {
      borderColor: '#E6BB4A',
      color: '#E6BB4A',
      px: 4,
      py: 1.5,
      borderRadius: 2,
      textTransform: 'none',
      fontSize: 16,
      fontWeight: 500,
      '&:hover': {
        borderColor: '#d4a943',
        backgroundColor: 'rgba(230, 187, 74, 0.04)',
      },
    },
    languageSelector: {
      display: 'flex',
      alignItems: 'center',
      gap: 2,
    },
    flagEmoji: {
      fontSize: 24,
      mr: 1,
    },
    dialogPaper: {
      borderRadius: 4,
      p: 0,
      background: '#fff',
      boxShadow: '0 4px 32px 0 rgba(33,33,33,0.10)',
      width: 480,
      maxWidth: '95vw',
    },
    dialogBackdrop: {
      backgroundColor: 'rgba(33,33,33,0.8)',
      backdropFilter: 'blur(5px)',
    },
    dialogTitle: {
      fontSize: 32,
      fontWeight: 400,
      color: '#616160',
      fontFamily: 'Montserrat, sans-serif',
      textAlign: 'left',
      pb: 0,
      pt: 4,
      pl: 4,
      letterSpacing: 0,
      lineHeight: 1.1,
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      right: 24,
      top: 24,
      background: 'transparent',
      boxShadow: 'none',
      p: 0,
    },
    dialogContent: {
      pt: 4,
      px: 4,
      pb: 4,
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    },
  };

const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { userData, userDataLoading, getMyUserData, changePassword, updateUserProfile } = useAuth();
  const { showSnackbar } = useSnackbar();
  
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMyUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName || '');
      setLastName(userData.lastName || '');
      setProfilePicture(userData.profilePictureFile?.signedUrl || '');
    }
  }, [userData]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || i18n.language;
    setCurrentLanguage(savedLanguage);
  }, [i18n.language]);

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  };

  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      let profilePictureId = userData?.profilePicture;
      
      if (profilePictureFile) {
        profilePictureId = await uploadFileAndGetId(profilePictureFile);
      }
      
      await updateUserProfile({
        firstName,
        lastName,
        ...(profilePictureId && { profilePicture: profilePictureId })
      });
      
      setProfilePictureFile(null);
      showSnackbar(t('settings.messages.profileUpdatedSuccess'), 'success');
        getMyUserData();
    } catch {
      showSnackbar(t('settings.messages.profileUpdateFailed'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword.length < 8) {
      showSnackbar(t('settings.messages.passwordTooShort'), 'error');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      showSnackbar(t('settings.messages.passwordMismatch'), 'error');
      return;
    }
    
    try {
      await changePassword(newPassword);
      setPasswordDialogOpen(false);
      setNewPassword('');
      setConfirmPassword('');
      showSnackbar(t('settings.messages.passwordChangedSuccess'), 'success');
    } catch {
        showSnackbar(t('settings.messages.passwordChangeError'), 'error');
      // Error is already handled in the context
    }
  };

  const handleClosePasswordDialog = () => {
    setPasswordDialogOpen(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <Box sx={styles.container}>
      {/* Page Title */}
      <Typography sx={styles.pageTitle}>
        {t('settings.title')}
      </Typography>

      {/* Profile Section */}
      <Paper sx={styles.sectionPaper}>
        <Typography sx={styles.sectionTitle}>
          {t('settings.profileInformation')}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {userDataLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#E6BB4A' }} />
          </Box>
        ) : (
          <Box sx={styles.profileSection}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-picture-upload"
              type="file"
              onChange={handleProfilePictureChange}
            />
            <label htmlFor="profile-picture-upload">
              <Box sx={{ ...styles.avatarContainer, cursor: 'pointer' }}>
                <Avatar
                  src={profilePicture}
                  sx={styles.avatar}
                >
                  {!profilePicture && userData && `${userData.firstName?.charAt(0) || ''}${userData.lastName?.charAt(0) || ''}`}
                </Avatar>
                <Typography variant="caption" sx={{ color: '#666', textAlign: 'center', maxWidth: 120 }}>
                  {t('settings.uploadProfilePicture')}
                </Typography>
              </Box>
            </label>

            <Box sx={styles.formFields}>
              <TextField
                label={t('settings.firstName')}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
              />
              <TextField
                label={t('settings.lastName')}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
              />
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button 
                  variant="contained" 
                  sx={styles.actionButton}
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} /> : null}
                  {t('settings.saveChanges')}
                </Button>
                <Button 
                  variant="outlined" 
                  sx={styles.outlinedButton}
                  onClick={() => setPasswordDialogOpen(true)}
                >
                  {t('settings.changePassword')}
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Language Settings Section */}
      <Paper sx={styles.sectionPaper}>
        <Typography sx={styles.sectionTitle}>
          {t('settings.languageRegion')}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Box sx={styles.languageSelector}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>{t('settings.language')}</InputLabel>
            <Select
              value={currentLanguage}
              label={t('settings.language')}
              onChange={(e) => handleLanguageChange(e.target.value)}
              size="small"
            >
              <MenuItem value="en">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: 20, marginRight: 8 }}>🇺🇸</span>
                  English
                </Box>
              </MenuItem>
              <MenuItem value="it">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: 20, marginRight: 8 }}>🇮🇹</span>
                  Italiano
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" sx={{ color: '#666', ml: 2 }}>
            {t('settings.languageChangeEffect')}
          </Typography>
        </Box>
      </Paper>

      {/* Password Change Dialog */}
      <Dialog 
        open={passwordDialogOpen} 
        onClose={handleClosePasswordDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: styles.dialogPaper }}
        TransitionComponent={Fade}
        slotProps={{
          backdrop: {
            timeout: 300,
            sx: styles.dialogBackdrop,
          },
        }}
      >
        <DialogTitle sx={styles.dialogTitle}>
          {t('settings.passwordDialog.title')}
          <IconButton
            onClick={handleClosePasswordDialog}
            sx={styles.closeButton}
          >
            <DialogCloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={styles.dialogContent}>
          <TextField
            label={t('settings.passwordDialog.newPassword')}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            error={newPassword !== '' && newPassword.length < 8}
            helperText={newPassword !== '' && newPassword.length < 8 ? t('settings.passwordDialog.passwordTooShort') : ''}
            style={{marginTop: 10}}
          />
          <TextField
            label={t('settings.passwordDialog.confirmPassword')}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            error={confirmPassword !== '' && newPassword !== confirmPassword}
            helperText={confirmPassword !== '' && newPassword !== confirmPassword ? t('settings.passwordDialog.passwordMismatch') : ''}
          />
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 0 }}>
          <Button 
            onClick={handleClosePasswordDialog}
            sx={{ ...styles.outlinedButton, mr: 2 }}
            variant="outlined"
          >
            {t('settings.passwordDialog.cancel')}
          </Button>
          <Button 
            onClick={handlePasswordChange}
            sx={styles.actionButton}
            variant="contained"
            disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 8}
          >
            {t('settings.passwordDialog.change')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsPage;
