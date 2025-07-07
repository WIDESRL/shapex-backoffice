import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, IconButton, TextField, InputAdornment, CircularProgress, Divider } from '@mui/material';
import DialogCloseIcon from '../../../../../icons/DialogCloseIcon2';
import MagnifierIcon from '../../../../../icons/MagnifierIcon';
import { useTraining } from '../../../../../Context/TrainingContext';
import type { User } from '../../../../../Context/TrainingContext';
import PendingIcon from '@mui/icons-material/Pending';
import { useSnackbar } from '../../../../../Context/SnackbarContext';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { getServerErrorMessage } from '../../../../../utils/errorUtils';

// --- Styles ---
const styles = {
  dialogPaper: {
    borderRadius: 4,
    p: 0,
    background: '#fff',
    boxShadow: '0 4px 32px 0 rgba(33,33,33,0.10)',
    width: 950,
    height: 650,
    maxWidth: '98vw',
    maxHeight: '90vh',
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
    pt: 0,
    px: 4,
    pb: 0,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 400,
  },
  row: { display: 'flex', gap: 4, mt: 2 },
  col: { flex: 1, display: 'flex', flexDirection: 'column', gap: 2 },
  searchBox: { mb: 1 },
  userList: { background: '#fff', borderRadius: 2, border: '1px solid #ededed', minHeight: 220, maxHeight: 220, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 },
  userRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 2, px: 2, py: 1, fontSize: 18, color: '#616160', fontFamily: 'Montserrat, sans-serif', background: '#fff' },
  assignBtn: { background: '#EDB528', color: '#fff', borderRadius: 2, fontWeight: 500, fontSize: 16, px: 3, py: 0.5, minWidth: 90, textTransform: 'none', boxShadow: 'none', '&:hover': { background: '#d1a53d' } },
  removeBtn: { background: '#616160', color: '#fff', borderRadius: 2, fontWeight: 500, fontSize: 16, px: 3, py: 0.5, minWidth: 90, textTransform: 'none', boxShadow: 'none', '&:hover': { background: '#444' } },
  dialogActions: { px: 4, pb: 4, pt: 0, display: 'flex', justifyContent: 'flex-end' },
  saveButton: { background: '#EDB528', color: '#fff', borderRadius: 2.5, fontWeight: 500, fontSize: 20, px: 8, py: 2, minWidth: 180, boxShadow: 0, textTransform: 'none', fontFamily: 'Montserrat, sans-serif', '&:hover': { background: '#d1a53d' } },
  label: { fontWeight: 500, color: '#616160', fontSize: 18, mb: 1, fontFamily: 'Montserrat, sans-serif' },
  programName: { fontWeight: 600, color: '#616160', fontSize: 20, fontFamily: 'Montserrat, sans-serif', mb: 2 },
  flexCenter120: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: 120 },
  flexColAlignStart: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 },
  flexRowAlignCenter: { display: 'flex', alignItems: 'center', gap: 1 },
  flexColCenter120: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 120 },
  errorText: { color: 'red', fontSize: 11, mt: 0.5, ml: 0, lineHeight: 1 },
  pendingIconRemove: { color: '#616160', fontSize: 18, ml: 1 },
  pendingIconAssign: { color: '#EDB528', fontSize: 18, ml: 1 },
  dialogBackdrop: {
    backgroundColor: 'rgba(33,33,33,0.8)',
    backdropFilter: 'blur(5px)',
  },
};
// --- End Styles ---

interface AssignUsersModalProps {
  open: boolean;
  onClose: () => void;
  programName: string;
}

const AssignUsersModal: React.FC<AssignUsersModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { selectedTrainingProgram, fetchAllUsers, fetchAssignedUsers, loadingAssignedUsers, loadingAvailableUsers, availableUsers, assignedUsers, batchAssignAndRemoveUsers } = useTraining();
  const [searchAvailable, setSearchAvailable] = useState('');
  const [searchAssigned, setSearchAssigned] = useState('');
  const [usersToAssign, setUsersToAssign] = useState<User[]>([]);
  const [usersToRemove, setUsersToRemove] = useState<User[]>([]);
  const [saving, setSaving] = useState(false);
  const { showSnackbar } = useSnackbar();

  const prevOpenRef = React.useRef(open);
  useEffect(() => {
    if (!prevOpenRef.current && open) {
        fetchAllUsers();
        fetchAssignedUsers();
    }
    prevOpenRef.current = open;
  }, [open, fetchAllUsers, fetchAssignedUsers, selectedTrainingProgram?.id]);

  // Reset temp arrays when modal closes or opens
  useEffect(() => {
    if (!open) {
      setSearchAvailable('');
      setSearchAssigned('');
      setUsersToAssign([]);
      setUsersToRemove([]);
    }
  }, [open]);

  const handleAssign = (user: User) => {
    if (usersToAssign.some(u => u.id === user.id)) {
      // Undo temp assign
      setUsersToAssign(prev => prev.filter(u => u.id !== user.id));
    } else {
      setUsersToAssign(prev => [...prev, user]);
      setUsersToRemove(prev => prev.filter(u => u.id !== user.id));
    }
  };
  const handleRemove = (user: User) => {
    if (usersToRemove.some(u => u.id === user.id)) {
      // Undo temp remove
      setUsersToRemove(prev => prev.filter(u => u.id !== user.id));
    } else {
      setUsersToRemove(prev => [...prev, user]);
      setUsersToAssign(prev => prev.filter(u => u.id !== user.id));
    }
  };

  const getUserDisplayName = (user: User | undefined | null) => {
    if (!user) return '';
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.username) return user.username;
    return user.email || '';
  };

  // Calculate effective assigned users (right section)
  const effectiveAssignedUsers = useMemo(() => {
    // Start with assignedUsers from API, add usersToAssign, remove usersToRemove
    const assignedSet = new Map<number, User>();
    assignedUsers.forEach(au => {
      const userWithDefaults: User = {
        ...au.user,
        subscriptions: Array.isArray((au.user as User).subscriptions) ? (au.user as User).subscriptions : [],
        assignedPrograms: Array.isArray((au.user as User).assignedPrograms) ? (au.user as User).assignedPrograms : [],
      };
      assignedSet.set(au.user.id, userWithDefaults);
    });
    usersToAssign.forEach(u => assignedSet.set(u.id, u));
    usersToRemove.forEach(u => assignedSet.delete(u.id));
    return Array.from(assignedSet.values());
  }, [assignedUsers, usersToAssign, usersToRemove]);

  const filteredAssignedUsers = useMemo(() => {
    return effectiveAssignedUsers.filter(user => {
      const displayName = getUserDisplayName(user).toLowerCase();
      return displayName.includes(searchAssigned.toLowerCase());
    });
  }, [effectiveAssignedUsers, searchAssigned]);

  // Calculate effective available users (left section)
  const effectiveAvailableUsers = useMemo(() => {
    // Show users that are not in effectiveAssignedUsers
    const assignedIds = new Set(effectiveAssignedUsers.map(u => u.id));
    return availableUsers.filter(u => !assignedIds.has(u.id));
  }, [availableUsers, effectiveAssignedUsers]);

  const filteredAvailableUsers = useMemo(() => {
    return effectiveAvailableUsers.filter(user => {
      const displayName = getUserDisplayName(user).toLowerCase();
      return displayName.includes(searchAvailable.toLowerCase());
    });
  }, [effectiveAvailableUsers, searchAvailable]);

  const NoDataSection = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <Box sx={styles.flexColCenter120}>
      <Typography sx={{ color: '#888', fontSize: 18, fontWeight: 500, mb: 1 }}>{title}</Typography>
      <Typography sx={{ color: '#bbb', fontSize: 14 }}>{subtitle}</Typography>
    </Box>
  );

  // Utility to get assignmentId for a user
  const getAssignmentIdForUser = (user: User) => {
    const found = assignedUsers.find(au => au.user.id === user.id);
    return found ? found.id : undefined;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const userIdsToAssign = usersToAssign.map(u => u.id);
      const assignmentIdsToRemove = usersToRemove
        .map(user => getAssignmentIdForUser(user))
        .filter((id): id is number => typeof id === 'number');
      if(userIdsToAssign.length || assignmentIdsToRemove.length) {
          await batchAssignAndRemoveUsers(userIdsToAssign, assignmentIdsToRemove);
          showSnackbar(t('assignUsersModal.saveSuccess'), 'success');
          setUsersToRemove([]);
          setUsersToAssign([]);
          setTimeout(onClose, 1000);
      }
      else onClose();
    } catch(error) {
      const axiosError = error as AxiosError<{ errorCode?: string }>;
      const errorCode = axiosError?.response?.data?.errorCode;
      const errorMessage = getServerErrorMessage(errorCode, t);
      showSnackbar(errorMessage, 'error');
      console.error('Error saving assignments');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{ sx: styles.dialogPaper }}
      slotProps={{ backdrop: { timeout: 300, sx: styles.dialogBackdrop } }}
    >
      <DialogTitle sx={styles.dialogTitle}>
        {t("assignUsersModal.title")}
        <IconButton onClick={onClose} sx={styles.closeButton}>
          <DialogCloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={styles.dialogContent}>
        <Typography sx={styles.programName}>
          {t("assignUsersModal.programLabel")}:{" "}
          <span style={{ fontWeight: 700 }}>
            {selectedTrainingProgram?.title}
          </span>
        </Typography>
        <Box sx={styles.row}>
          <Box sx={styles.col}>
            <Typography sx={styles.label}>
              {t("assignUsersModal.assignTo")}
            </Typography>
            <TextField
              placeholder={t("assignUsersModal.searchPlaceholder")}
              value={searchAvailable}
              onChange={(e) => setSearchAvailable(e.target.value)}
              sx={styles.searchBox}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <MagnifierIcon style={{ width: 22, height: 22 }} />
                  </InputAdornment>
                ),
              }}
            />
            <Typography sx={styles.label}>
              {t("assignUsersModal.clientsList")}
            </Typography>
            <Box sx={styles.userList}>
              {loadingAvailableUsers ? (
                <Box sx={styles.flexCenter120}>
                  <CircularProgress size={36} sx={{ color: "#EDB528" }} />
                </Box>
              ) : filteredAvailableUsers.length === 0 ? (
                <NoDataSection
                  title={t("assignUsersModal.noAvailableTitle")}
                  subtitle={t("assignUsersModal.noAvailableSubtitle")}
                />
              ) : (
                filteredAvailableUsers.map((user, idx, arr) => {
                  const isTempRemoved = usersToRemove.some(
                    (u) => u.id === user.id
                  );
                  const isAssigned = assignedUsers.some(
                    (au) => au.user.id === user.id
                  );
                  const hasActiveSubscription =
                    user.subscriptions && user.subscriptions.length > 0;
                  return (
                    <React.Fragment key={user.id}>
                      <Box sx={styles.userRow}>
                        <Box sx={styles.flexColAlignStart}>
                          <Box sx={styles.flexRowAlignCenter}>
                            {getUserDisplayName(user)}
                            {isTempRemoved && (
                              <PendingIcon
                                sx={styles.pendingIconRemove}
                                titleAccess={t("assignUsersModal.toRemove")}
                              />
                            )}
                          </Box>
                          {!isAssigned && !hasActiveSubscription && (
                            <Typography sx={styles.errorText}>
                              {t("assignUsersModal.noActiveSubscription")}
                            </Typography>
                          )}
                        </Box>
                        {(isTempRemoved || hasActiveSubscription) &&
                          (isTempRemoved ? (
                            <Button
                              sx={{ ...styles.removeBtn, minWidth: 90 }}
                              onClick={() => handleRemove(user)}
                            >
                              {t("assignUsersModal.undo")}
                            </Button>
                          ) : (
                            <Button
                              sx={styles.assignBtn}
                              onClick={() => handleAssign(user)}
                            >
                              {t("assignUsersModal.assign")}
                            </Button>
                          ))}
                      </Box>
                      {idx < arr.length - 1 && (
                        <Divider sx={{ my: 0.5, borderColor: "#ededed" }} />
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </Box>
          </Box>
          <Box sx={styles.col}>
            <Typography sx={styles.label}>
              {t("assignUsersModal.assignedTo")}
            </Typography>
            <TextField
              placeholder={t("assignUsersModal.searchPlaceholder")}
              value={searchAssigned}
              onChange={(e) => setSearchAssigned(e.target.value)}
              sx={styles.searchBox}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <MagnifierIcon style={{ width: 22, height: 22 }} />
                  </InputAdornment>
                ),
              }}
            />
            <Typography sx={styles.label}>
              {t("assignUsersModal.clientsList")}
            </Typography>
            <Box sx={styles.userList}>
              {loadingAssignedUsers ? (
                <Box sx={styles.flexCenter120}>
                  <CircularProgress size={36} sx={{ color: "#EDB528" }} />
                </Box>
              ) : filteredAssignedUsers.length === 0 ? (
                <NoDataSection
                  title={t("assignUsersModal.noAssignedTitle")}
                  subtitle={t("assignUsersModal.noAssignedSubtitle")}
                />
              ) : (
                filteredAssignedUsers.map((user, idx, arr) => {
                  const isTempAssigned = usersToAssign.some(
                    (u) => u.id === user.id
                  );
                  return (
                    <React.Fragment key={user.id}>
                      <Box sx={styles.userRow}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {getUserDisplayName(user)}
                          {isTempAssigned && (
                            <PendingIcon
                              sx={styles.pendingIconAssign}
                              titleAccess={t("assignUsersModal.toAssign")}
                            />
                          )}
                        </Box>
                        {isTempAssigned ? (
                          <Button
                            sx={{ ...styles.removeBtn, minWidth: 90 }}
                            onClick={() => handleAssign(user)}
                          >
                            {t("assignUsersModal.undo")}
                          </Button>
                        ) : (
                          <Button
                            sx={styles.removeBtn}
                            onClick={() => handleRemove(user)}
                          >
                            {t("assignUsersModal.remove")}
                          </Button>
                        )}
                      </Box>
                      {idx < arr.length - 1 && (
                        <Divider sx={{ my: 0.5, borderColor: "#ededed" }} />
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={styles.dialogActions}>
        <Button
          variant="contained"
          sx={styles.saveButton}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <CircularProgress size={24} sx={{ color: "#fff", mr: 2 }} />
          ) : null}
          {t("assignUsersModal.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignUsersModal;
