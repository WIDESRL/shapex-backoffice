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
  CircularProgress
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import { useMessages, UserWithoutConversation } from '../Context/MessagesContext';

const StartConversationDialog: React.FC<{ open: boolean; onClose: () => void; onSend: (userId: number, message: string, file?: File) => Promise<void>; }> = ({ open, onClose, onSend }) => {
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
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontFamily: 'Montserrat, sans-serif', fontSize: 22 }}>Start New Conversation</DialogTitle>
      <DialogContent>
        {!selectedUser ? (
          <>
            <Paper sx={{ mb: 2, p: 1, borderRadius: 2, boxShadow: 'none', background: '#f7f6f3' }}>
              <InputBase
                placeholder="Search users..."
                value={searchInput}
                onChange={handleSearchChange}
                fullWidth
                sx={{ fontSize: 16, fontFamily: 'Montserrat, sans-serif', px: 1 }}
              />
            </Paper>
            {loadingUsersWithoutConversation && usersWithoutConversation.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
                <CircularProgress size={40} thickness={4} sx={{ color: '#FFD600' }} />
              </Box>
            ) : (
              <List sx={{ maxHeight: 320, minHeight: 120, overflowY: 'auto', position: 'relative' }}>
                {usersWithoutConversation.map(user => (
                  <ListItem component="button" key={user.id} onClick={() => setSelectedUser(user)} sx={{ borderRadius: 2, mb: 1, '&:hover': { background: '#f7e7b6' } }}>
                    <ListItemAvatar>
                      <Avatar src={user.profilePictureFile?.signedUrl || '/profile.svg'} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: 600, fontSize: 17, color: '#616160', fontFamily: 'Montserrat, sans-serif' }}>{((user.firstName || '') + ' ' + (user.lastName || '')).trim() || 'User'}</Typography>}
                    />
                  </ListItem>
                ))}
                {usersWithoutConversation.length === 0 && !loadingUsersWithoutConversation && (
                  <Typography sx={{ color: '#bdbdbd', textAlign: 'center', mt: 2 }}>No users available</Typography>
                )}
                {loadingUsersWithoutConversation && usersWithoutConversation.length > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
                    <CircularProgress size={28} thickness={4} sx={{ color: '#FFD600' }} />
                  </Box>
                )}
                {/* Load More Button */}
                {usersWithoutConversation.length > 0 && usersWithoutConversationHasMore && !loadingUsersWithoutConversation && (
                  <>
                    <Box sx={{ my: 1 }}>
                      <hr style={{ border: 0, borderTop: '1px solid #eee', margin: 0 }} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 1, mb: 1 }}>
                      <Button onClick={handleLoadMore} variant="outlined" sx={{ borderRadius: 2, fontWeight: 600, color: '#E6BB4A', borderColor: '#FFD600', '&:hover': { borderColor: '#E6BB4A', background: '#fffbe6' } }}>
                        Load more
                      </Button>
                    </Box>
                  </>
                )}
              </List>
            )}
          </>
        ) : (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar src={selectedUser.profilePictureFile?.signedUrl || '/profile.svg'} sx={{ width: 48, height: 48, mr: 2 }} />
              <Typography sx={{ fontWeight: 600, fontSize: 18, color: '#616160', fontFamily: 'Montserrat, sans-serif' }}>{((selectedUser.firstName || '') + ' ' + (selectedUser.lastName || '')).trim() || 'User'}</Typography>
            </Box>
            <Paper sx={{ display: 'flex', alignItems: 'center', borderRadius: 24, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)', p: 1, mb: 2 }}>
              <InputBase
                placeholder="Type a message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                sx={{ flex: 1, fontSize: 16, fontFamily: 'Montserrat, sans-serif', px: 1 }}
                inputProps={{ maxLength: 1000 }}
              />
              <IconButton component="label" sx={{ color: '#E6BB4A', mx: 1 }}>
                <input type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" hidden onChange={handleFileChange} />
                <AttachFileIcon />
              </IconButton>
            </Paper>
            {file && (
              <Typography sx={{ fontSize: 14, color: '#616160', mb: 1 }}>Selected file: {file.name}</Typography>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {selectedUser ? (
          <>
            <Button onClick={() => setSelectedUser(null)} sx={{ color: '#616160', fontWeight: 600 }}>Back</Button>
            <Button onClick={handleSend} variant="contained" sx={{ background: '#FFD600', color: '#222', fontWeight: 700, borderRadius: 2, px: 3 }} disabled={sending || (!message.trim() && !file)} endIcon={<SendIcon />}>
              Send
            </Button>
          </>
        ) : (
          <Button onClick={onClose} sx={{ color: '#616160', fontWeight: 600 }}>Close</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default StartConversationDialog;
