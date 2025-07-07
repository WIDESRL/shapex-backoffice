import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  Box,
  Typography,
  IconButton,
  InputBase,
  Paper,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import { useTranslation } from 'react-i18next';
import { useMessages, UserWithoutConversation } from '../Context/MessagesContext';
import DialogCloseIcon from '../icons/DialogCloseIcon2';

const styles = {
  dialog: {
    borderRadius: 4,
    boxShadow: 8,
    px: 4,
    py: 2,
    background: '#fff',
    minWidth: 400,
    fontSize: 16,
  },
  backdrop: {
    timeout: 300,
    sx: {
      backgroundColor: 'rgba(33,33,33,0.8)',
      backdropFilter: 'blur(5px)',
    },
  },
  closeButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    mt: 1,
    mb: 0,
  },
  closeButton: {
    color: '#888',
    background: 'transparent',
    boxShadow: 'none',
    '&:hover': { background: 'rgba(0,0,0,0.04)' },
    mr: '-8px',
    mt: '-8px',
  },
  dialogTitle: {
    fontSize: 32,
    fontWeight: 400,
    textAlign: 'left',
    pb: 0,
    pt: 0,
    position: 'relative',
    letterSpacing: 0.5,
    fontFamily: 'Montserrat, sans-serif',
    color: '#616160',
  },
  dialogContent: {
    pt: 2,
    pb: 0,
    fontSize: 15,
    '& .MuiTypography-root, & .MuiInputBase-root, & .MuiButton-root': {
      fontSize: 15,
    },
    '& .MuiDialogTitle-root': {
      fontSize: 28,
    },
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#ddd',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#ccc',
    },
  },
  searchPaper: {
    mb: 2,
    p: 1,
    borderRadius: 2,
    boxShadow: 'none',
    background: '#f7f6f3',
  },
  searchInput: {
    fontSize: 16,
    fontFamily: 'Montserrat, sans-serif',
    px: 1,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 120,
  },
  loadingSpinner: {
    color: '#FFD600',
  },
  userList: {
    maxHeight: 320,
    minHeight: 120,
    overflowY: 'auto',
    position: 'relative',
  },
  userListItem: {
    borderRadius: 2,
    mb: 1,
    '&:hover': { background: '#f7e7b6' },
  },
  userNameText: {
    fontWeight: 600,
    fontSize: 17,
    color: '#616160',
    fontFamily: 'Montserrat, sans-serif',
  },
  noUsersText: {
    color: '#bdbdbd',
    textAlign: 'center',
    mt: 2,
  },
  loadMoreContainer: {
    display: 'flex',
    justifyContent: 'center',
    py: 1,
    mb: 1,
  },
  loadMoreButton: {
    borderRadius: 2,
    fontWeight: 600,
    color: '#E6BB4A',
    borderColor: '#FFD600',
    '&:hover': { borderColor: '#E6BB4A', background: '#fffbe6' },
  },
  divider: {
    border: 0,
    borderTop: '1px solid #eee',
    margin: 0,
  },
  selectedUserContainer: {
    display: 'flex',
    alignItems: 'center',
    mb: 2,
  },
  selectedUserAvatar: {
    width: 48,
    height: 48,
    mr: 2,
  },
  selectedUserName: {
    fontWeight: 600,
    fontSize: 18,
    color: '#616160',
    fontFamily: 'Montserrat, sans-serif',
  },
  messageInputPaper: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: 24,
    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
    p: 1,
    mb: 2,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Montserrat, sans-serif',
    px: 1,
  },
  attachButton: {
    color: '#E6BB4A',
    mx: 1,
  },
  fileSelectedText: {
    fontSize: 14,
    color: '#616160',
    mb: 1,
  },
  actionButton: {
    color: '#616160',
    fontWeight: 600,
  },
  sendButton: {
    background: '#FFD600',
    color: '#222',
    fontWeight: 700,
    borderRadius: 2,
    px: 3,
  },
};

const StartConversationDialog: React.FC<{ open: boolean; onClose: () => void; onSend: (userId: number, message: string, file?: File) => Promise<void>; }> = ({ open, onClose, onSend }) => {
  const { t } = useTranslation();
  const {
    usersWithoutConversation,
    loadingUsersWithoutConversation,
    fetchUsersWithoutConversation,
    usersWithoutConversationSearch,
    setUsersWithoutConversationSearch,
    usersWithoutConversationPage,
    setUsersWithoutConversationPage,
    usersWithoutConversationHasMore,
    resetUsersWithoutConversation,
  } = useMessages();
  const [selectedUser, setSelectedUser] = useState<UserWithoutConversation | null>(null);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | undefined>();
  const [sending, setSending] = useState(false);
  const [searchInput, setSearchInput] = useState(usersWithoutConversationSearch);

  // Debounce search input and update context search/page
  useEffect(() => {
    const handler = setTimeout(() => {
      setUsersWithoutConversationSearch(searchInput);
      setUsersWithoutConversationPage(1);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchInput, setUsersWithoutConversationSearch, setUsersWithoutConversationPage]);

  // Fetch users on open, search, or page change
  useEffect(() => {
    if (open) {
      fetchUsersWithoutConversation();
    }
    else {
        resetUsersWithoutConversation();
        setSearchInput('');
    }
    // eslint-disable-next-line
  }, [open, usersWithoutConversationSearch, usersWithoutConversationPage]);

  const handleSend = async () => {
    if (!selectedUser || (!message.trim() && !file)) return;
    setSending(true);
    try {
      await onSend(selectedUser.id, message, file);
      setMessage('');
      setFile(undefined);
      setSelectedUser(null);
      onClose();
    } finally {
      setSending(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleLoadMore = () => {
    setUsersWithoutConversationPage(page => page + 1);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{ sx: styles.dialog }}
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: styles.backdrop }}
    >
      <Box sx={styles.closeButtonContainer}>
        <IconButton onClick={onClose} sx={styles.closeButton}>
          <DialogCloseIcon />
        </IconButton>
      </Box>
      <DialogTitle sx={styles.dialogTitle}>
        {t('startConversation.title')}
      </DialogTitle>
      <DialogContent sx={styles.dialogContent}>
        {!selectedUser ? (
          <>
            <Paper sx={styles.searchPaper}>
              <InputBase
                placeholder={t('startConversation.searchPlaceholder')}
                value={searchInput}
                onChange={handleSearchChange}
                fullWidth
                sx={styles.searchInput}
              />
            </Paper>
            {loadingUsersWithoutConversation && usersWithoutConversation.length === 0 ? (
              <Box sx={styles.loadingContainer}>
                <CircularProgress size={40} thickness={4} sx={styles.loadingSpinner} />
              </Box>
            ) : (
              <List sx={styles.userList}>
                {usersWithoutConversation.map(user => (
                  <ListItem 
                    component="button" 
                    key={user.id} 
                    onClick={() => setSelectedUser(user)} 
                    sx={styles.userListItem}
                  >
                    <ListItemAvatar>
                      <Avatar src={user.profilePictureFile?.signedUrl || '/profile.svg'} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography sx={styles.userNameText}>
                          {((user.firstName || '') + ' ' + (user.lastName || '')).trim() || t('startConversation.user')}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
                {usersWithoutConversation.length === 0 && !loadingUsersWithoutConversation && (
                  <Typography sx={styles.noUsersText}>
                    {t('startConversation.noUsersAvailable')}
                  </Typography>
                )}
                {loadingUsersWithoutConversation && usersWithoutConversation.length > 0 && (
                  <Box sx={styles.loadingContainer}>
                    <CircularProgress size={28} thickness={4} sx={styles.loadingSpinner} />
                  </Box>
                )}
                {/* Load More Button */}
                {usersWithoutConversation.length > 0 && usersWithoutConversationHasMore && !loadingUsersWithoutConversation && (
                  <>
                    <Box sx={{ my: 1 }}>
                      <hr style={styles.divider} />
                    </Box>
                    <Box sx={styles.loadMoreContainer}>
                      <Button onClick={handleLoadMore} variant="outlined" sx={styles.loadMoreButton}>
                        {t('startConversation.loadMore')}
                      </Button>
                    </Box>
                  </>
                )}
              </List>
            )}
          </>
        ) : (
          <Box>
            <Box sx={styles.selectedUserContainer}>
              <Avatar 
                src={selectedUser.profilePictureFile?.signedUrl || '/profile.svg'} 
                sx={styles.selectedUserAvatar} 
              />
              <Typography sx={styles.selectedUserName}>
                {((selectedUser.firstName || '') + ' ' + (selectedUser.lastName || '')).trim() || t('startConversation.user')}
              </Typography>
            </Box>
            <Paper sx={styles.messageInputPaper}>
              <InputBase
                placeholder={t('startConversation.messageePlaceholder')}
                value={message}
                onChange={e => setMessage(e.target.value)}
                sx={styles.messageInput}
                inputProps={{ maxLength: 1000 }}
              />
              <IconButton component="label" sx={styles.attachButton}>
                <input type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" hidden onChange={handleFileChange} />
                <AttachFileIcon />
              </IconButton>
            </Paper>
            {file && (
              <Typography sx={styles.fileSelectedText}>
                {t('startConversation.selectedFile')}: {file.name}
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {selectedUser ? (
          <>
            <Button onClick={() => setSelectedUser(null)} sx={styles.actionButton}>
              {t('startConversation.back')}
            </Button>
            <Button 
              onClick={handleSend} 
              variant="contained" 
              sx={styles.sendButton} 
              disabled={sending || (!message.trim() && !file)} 
              endIcon={<SendIcon />}
            >
              {t('startConversation.send')}
            </Button>
          </>
        ) : (
          <Button onClick={onClose} sx={styles.actionButton}>
            {t('startConversation.close')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default StartConversationDialog;
