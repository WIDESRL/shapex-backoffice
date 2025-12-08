import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box } from '@mui/material';
import DiaryIcon from '../icons/DiarioIcon';
import MoreIcon from '../icons/MoreIcon';
import AlimentazioneIcon from '../icons/AlimentazioneIcon2';
import DialogCloseIcon from '../icons/DialogCloseIcon2';
import Chat from '../icons/Chat';
import AnagraficaIcon from '../icons/AnagraficaIcon';
import AllenamentiIcon from '../icons/AllenamentiIcon';
import { Client } from '../Context/ClientContext';

interface ClientSectionsModalProps {
  open: boolean;
  client: Client | null;
  onClose: () => void;
}

const styles = {
  dialogPaper: { 
    borderRadius: 3, 
    p: 2, 
    minWidth: { xs: 320, sm: 600, lg: 800 }, 
    maxWidth: { xs: '90vw', sm: '80vw', lg: '85vw' },
    width: '100%'
  },
  dialogTitle: { 
    fontWeight: 300, 
    fontSize: 28, 
    color: '#616160', 
    pb: 1, 
    pr: 5,
    maxWidth: '90%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  dialogCloseButton: { 
    position: 'absolute', 
    right: 16, 
    top: 16, 
    color: '#aaa' 
  },
  dialogCloseIcon: {
    background: 'transparent',
    boxShadow: 'none',
  },
  dialogContent: {
    pt: 0,
  },
  dialogGrid: {
    display: 'grid',
    gridTemplateColumns: { 
      xs: '1fr', 
      sm: 'repeat(2, 1fr)', 
      lg: 'repeat(3, 1fr)' 
    },
    gap: 3,
  },
  dialogBackdrop: {
    backgroundColor: 'rgba(33,33,33,0.8)',
    backdropFilter: 'blur(5px)',
  },
  modalSectionBox: {
    border: 1,
    borderColor: '#eee',
    borderRadius: 2,
    p: 2,
    minWidth: 200,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: '#ccc',
      backgroundColor: '#fafafa',
    },
  },
  modalSectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    mb: 1,
  },
  modalSectionText: {
    fontWeight: 500,
    fontSize: 18,
  },
  modalSectionDivider: {
    border: 0,
    borderTop: '1.5px solid #e0e0e0',
    margin: '12px 0 10px 0',
  },
  modalSectionList: {
    margin: 0,
    paddingLeft: 18,
    color: '#616160',
    fontSize: 15,
  },
  modalSectionListItem: {
    marginBottom: 14,
  },
};

const ClientSectionsModal: React.FC<ClientSectionsModalProps> = ({ open, client, onClose }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSectionClick = (section: string, clientId: number | string) => {
    onClose();
    switch (section) {
      case 'anagrafica':
        navigate(`/clients/${clientId}/anagrafica`);
        break;
      case 'allenamenti':
        navigate(`/clients/${clientId}/allenamenti`);
        break;
      case 'diario':
        navigate(`/clients/${clientId}/diario`);
        break;
      case 'alimentazione':
        navigate(`/clients/${clientId}/alimentazione`);
        break;
      case 'altro':
        navigate(`/clients/${clientId}/altro`);
        break;
      case 'chat':
        navigate(`/chat/${clientId}`);
        break;
      default:
        break;
    }
  };

  // Memoize client display name
  const clientDisplayName = useMemo(() => {
    if (!client) return '';
    const fullName = `${client.firstName || ''} ${client.lastName || ''}`.trim();
    return fullName || client.email || '';
  }, [client]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      PaperProps={{ sx: styles.dialogPaper }}
      slotProps={{
        backdrop: {
          timeout: 300,
          sx: styles.dialogBackdrop,
        },
      }}
    >
      <DialogTitle sx={styles.dialogTitle}>
        {clientDisplayName}
        <IconButton aria-label="close" onClick={onClose} sx={styles.dialogCloseButton}>
          <DialogCloseIcon style={styles.dialogCloseIcon} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={styles.dialogContent}>
        <Box sx={styles.dialogGrid}>
          <Box sx={styles.modalSectionBox} onClick={() => handleSectionClick('anagrafica', client?.id || '')}>
            <Box sx={styles.modalSectionTitle}>
              <AnagraficaIcon style={{ color: 'grey' }} />
              <Typography sx={styles.modalSectionText}>{t('client.main.modalSections.anagrafica.title')}</Typography>
            </Box>
            <hr style={styles.modalSectionDivider} />
            <ul style={styles.modalSectionList}>
              <li style={styles.modalSectionListItem}>{t('client.main.modalSections.anagrafica.items.information')}</li>
              <li style={styles.modalSectionListItem}>{t('client.main.modalSections.anagrafica.items.contacts')}</li>
              <li style={styles.modalSectionListItem}>{t('client.main.modalSections.anagrafica.items.password')}</li>
            </ul>
          </Box>
          <Box sx={styles.modalSectionBox} onClick={() => handleSectionClick('allenamenti', client?.id || '')}>
            <Box sx={styles.modalSectionTitle}>
              <AllenamentiIcon />
              <Typography sx={styles.modalSectionText}>{t('client.main.modalSections.allenamenti.title')}</Typography>
            </Box>
            <hr style={styles.modalSectionDivider} />
            <ul style={styles.modalSectionList}>
              <li style={styles.modalSectionListItem}>{t('client.main.modalSections.allenamenti.items.programs')}</li>
              <li style={styles.modalSectionListItem}>{t('client.main.modalSections.allenamenti.items.completed')}</li>
              <li style={styles.modalSectionListItem}>{t('client.main.modalSections.allenamenti.items.history')}</li>
            </ul>
          </Box>
          <Box sx={styles.modalSectionBox} onClick={() => handleSectionClick('diario', client?.id || '')}>
            <Box sx={styles.modalSectionTitle}>
              <DiaryIcon />
              <Typography sx={styles.modalSectionText}>{t('client.main.modalSections.diario.title')}</Typography>
            </Box>
            <hr style={styles.modalSectionDivider} />
            <ul style={styles.modalSectionList}>
              <li style={styles.modalSectionListItem}>{t('client.main.modalSections.diario.items.anamnesis')}</li>
              <li style={styles.modalSectionListItem}>{t('client.main.modalSections.diario.items.measurements')}</li>
              <li style={styles.modalSectionListItem}>{t('client.main.modalSections.diario.items.photos')}</li>
            </ul>
          </Box>
          <Box sx={styles.modalSectionBox} onClick={() => handleSectionClick('alimentazione', client?.id || '')}>
            <Box sx={styles.modalSectionTitle}>
              <AlimentazioneIcon style={{ color: 'grey' }} />
              <Typography sx={styles.modalSectionText}>{t('client.main.modalSections.alimentazione.title')}</Typography>
            </Box>
            <hr style={styles.modalSectionDivider} />
            <ul style={styles.modalSectionList}>
              <li style={styles.modalSectionListItem}>{t('client.main.modalSections.alimentazione.items.plan')}</li>
              <li style={styles.modalSectionListItem}>{t('client.main.modalSections.alimentazione.items.supplements')}</li>
            </ul>
          </Box>
          <Box sx={styles.modalSectionBox} onClick={() => handleSectionClick('altro', client?.id || '')}>
            <Box sx={styles.modalSectionTitle}>
              <MoreIcon />
              <Typography sx={styles.modalSectionText}>{t('client.main.modalSections.altro.title')}</Typography>
            </Box>
            <hr style={styles.modalSectionDivider} />
            <ul style={styles.modalSectionList}>
              <li style={styles.modalSectionListItem}>{t('client.main.modalSections.altro.items.subscription')}</li>
              <li style={styles.modalSectionListItem}>{t('client.main.modalSections.altro.items.notifications')}</li>
              <li style={styles.modalSectionListItem}>{t('client.main.modalSections.altro.items.calls')}</li>
              <li style={styles.modalSectionListItem}>{t('client.main.modalSections.altro.items.configuration')}</li>
            </ul>
          </Box>
          <Box sx={styles.modalSectionBox} onClick={() => handleSectionClick('chat', client?.id || '')}>
            <Box sx={styles.modalSectionTitle}>
              <Chat style={{ color: 'grey' }} strokeColor="#616160" />
              <Typography sx={styles.modalSectionText}>{t('client.main.modalSections.chat.title')}</Typography>
            </Box>
            <hr style={styles.modalSectionDivider} />
            <ul style={styles.modalSectionList}>
              <li style={styles.modalSectionListItem}>{t('client.main.modalSections.chat.items.messages')}</li>
              <li style={styles.modalSectionListItem}>{t('client.main.modalSections.chat.items.conversation')}</li>
            </ul>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ClientSectionsModal;
