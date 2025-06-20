import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, IconButton, TextField, InputAdornment } from '@mui/material';
import DialogCloseIcon from '../../../../../icons/DialogCloseIcon2';
import MagnifierIcon from '../../../../../icons/MagnifierIcon';

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
};

const mockUsers = [
  'Sara Rossi', 'Marco Guerini', 'Stefania Bianchi', 'Elena Brignano', 'Samuele Di Vincenzo', 'Mario Verani', 'Sara Rossi'
];

interface AssignUsersModalProps {
  open: boolean;
  onClose: () => void;
  programName: string;
}

const AssignUsersModal: React.FC<AssignUsersModalProps> = ({ open, onClose }) => {
  const [available, setAvailable] = useState<string[]>(mockUsers);
  const [assigned, setAssigned] = useState<string[]>([]);
  const [searchAvailable, setSearchAvailable] = useState('');
  const [searchAssigned, setSearchAssigned] = useState('');

  const handleAssign = (user: string) => {
    setAvailable(available.filter(u => u !== user));
    setAssigned([...assigned, user]);
  };
  const handleRemove = (user: string) => {
    setAssigned(assigned.filter(u => u !== user));
    setAvailable([...available, user]);
  };

  const filteredAvailable = available.filter(u => u.toLowerCase().includes(searchAvailable.toLowerCase()));
  const filteredAssigned = assigned.filter(u => u.toLowerCase().includes(searchAssigned.toLowerCase()));

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false} fullWidth PaperProps={{ sx: styles.dialogPaper }}>
      <DialogTitle sx={styles.dialogTitle}>
        Assegna programma
        <IconButton onClick={onClose} sx={styles.closeButton}>
          <DialogCloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={styles.dialogContent}>
        <Typography sx={styles.programName}>Programma: <span style={{ fontWeight: 700 }}>Nome programma</span></Typography>
        <Box sx={styles.row}>
          <Box sx={styles.col}>
            <Typography sx={styles.label}>Assegna a:</Typography>
            <TextField
              placeholder="Cerca qui ..."
              value={searchAvailable}
              onChange={e => setSearchAvailable(e.target.value)}
              sx={styles.searchBox}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <MagnifierIcon style={{ width: 22, height: 22 }} />
                  </InputAdornment>
                ),
              }}
            />
            <Typography sx={styles.label}>Elenco clienti</Typography>
            <Box sx={styles.userList}>
              {filteredAvailable.map((user, idx) => (
                <Box key={user + idx} sx={styles.userRow}>
                  {user}
                  <Button sx={styles.assignBtn} onClick={() => handleAssign(user)}>Assegna</Button>
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={styles.col}>
            <Typography sx={styles.label}>Assegnato a:</Typography>
            <TextField
              placeholder="Cerca qui ..."
              value={searchAssigned}
              onChange={e => setSearchAssigned(e.target.value)}
              sx={styles.searchBox}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <MagnifierIcon style={{ width: 22, height: 22 }} />
                  </InputAdornment>
                ),
              }}
            />
            <Typography sx={styles.label}>Elenco clienti</Typography>
            <Box sx={styles.userList}>
              {filteredAssigned.map((user, idx) => (
                <Box key={user + idx} sx={styles.userRow}>
                  {user}
                  <Button sx={styles.removeBtn} onClick={() => handleRemove(user)}>Rimuovi</Button>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={styles.dialogActions}>
        <Button variant="contained" sx={styles.saveButton} onClick={onClose}>Salva</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignUsersModal;
