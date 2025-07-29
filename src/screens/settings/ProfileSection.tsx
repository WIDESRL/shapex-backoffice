import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  TextField,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Fade,
  Tooltip
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import DialogCloseIcon from '../../icons/DialogCloseIcon2';
import { useAuth } from '../../Context/AuthContext';
import { useSnackbar } from '../../Context/SnackbarContext';
import { compressImage, uploadFileAndGetId } from '../../utils/uploadFileAndGetId';

interface ProfileSectionProps {
  styles: Record<string, Record<string, unknown>>;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ styles }) => {
  const { t } = useTranslation();
  const { userData, userDataLoading, getMyUserData, changePassword, updateUserProfile } = useAuth();
  const { showSnackbar } = useSnackbar();
  
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName || '');
      setLastName(userData.lastName || '');
      setProfilePicture(userData.profilePictureFile?.signedUrl || '');
    }
  }, [userData]);

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
        profilePictureId = await uploadFileAndGetId(
            profilePictureFile?.type?.startsWith('image/') 
            ? await compressImage(profilePictureFile, 0.7) 
            : profilePictureFile
        );
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
    }
  };

  const handleClosePasswordDialog = () => {
    setPasswordDialogOpen(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <>
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
              <Tooltip 
                title={t('settings.profilePictureTooltip')}
                placement="top"
                style={{marginLeft:5}}
                arrow
              >
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
              </Tooltip>
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
        <DialogActions sx={styles.dialogActions}>
          <Button 
            onClick={handleClosePasswordDialog}
            sx={{ ...styles.outlinedButton, ...styles.cancelButton }}
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
    </>
  );
};

export default ProfileSection;
