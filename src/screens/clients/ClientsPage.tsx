import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, InputAdornment, Typography, Box, Chip, CircularProgress, Tooltip } from '@mui/material';
import EditIcon from '../../icons/EditIcon';
import DeleteIcon from '../../icons/DeleteIcon';
import FilterIcon from '../../icons/FilterIcon';
import MagnifierIcon from '../../icons/MagnifierIcon';
import { Client, useClientContext } from '../../Context/ClientContext';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DiaryIcon from '../../icons/DiarioIcon';
import MoreIcon from '../../icons/MoreIcon';
import DialogCloseIcon from '../../icons/DialogCloseIcon2';
import AnagraficaIcon from '../../icons/AnagraficaIcon';
import AllenamentiIcon from '../../icons/AllenamentiIcon';

// --- Styles ---
const styles = {
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
  modalSectionList: {
    margin: 0,
    paddingLeft: 18,
    color: '#616160',
    fontSize: 15,
  },
  modalSectionListItem: {
    marginBottom: 14,
  },
  modalSectionDivider: {
    border: 0,
    borderTop: '1.5px solid #e0e0e0',
    margin: '12px 0 10px 0',
  },
  emptyStateBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  emptyStateDesc: {
    fontSize: 15,
    color: '#aaa',
    fontWeight: 300,
  },
  emptyStateImage: {
    width: 60,
    opacity: 0.4,
  },
  tableCellHeader: { background: '#EDEDED', fontWeight: 500 },
  tableCell: { py: 0.5 },
  tableActionCell: { py: 0.5, textAlign: 'center' },
  tableRow: { 
    height: 42, 
    cursor: 'pointer' 
  },
  emptyTableCell: { 
    py: 6, 
    color: '#888', 
    fontSize: 20, 
    fontWeight: 400 
  },
  loadingTableCell: { 
    py: 2 
  },
  chip: {
    color: '#616160',
    fontWeight: 500,
    borderRadius: 1,
    minWidth: 90,
    height: 28,
    fontSize: 14,
  },
  tableContainer: {
    borderRadius: 3,
    boxShadow: 'none',
    flex: 1,
    minHeight: 0,
    overflow: 'auto',
  },
  searchInput: {
    width: 440,
    mr: 1,
    input: { p: 1.5, fontSize: 15, color: '#616160' },
  },
  searchInputProps: {
    endAdornment: (
      <InputAdornment position="end">
        <MagnifierIcon style={{ color: '#bbb', width: 22, height: 22 }} />
      </InputAdornment>
    ),
    style: { borderRadius: 10, background: '#fafafa', fontSize: 15, padding: '0px 13px' },
  },
  filterButton: {
    background: '#ededed',
    borderRadius: 2,
    width: 36,
    height: 36,
    ml: 0.5,
    p: 0,
    '&:hover': { background: '#e0e0e0' },
  },
  filterIcon: {
    color: '#616160',
    width: 22,
    height: 22,
  },
  editIcon: {
    verticalAlign: 'middle',
  },
  deleteIcon: {
    verticalAlign: 'middle',
  },
  pageContainer: {
    p: 3,
    height: '95vh',
    display: 'flex',
    flexDirection: 'column',
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 3,
  },
  pageTitle: {
    variant: 'h5',
    fontWeight: 300,
    color: '#616160',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
  dialogPaper: { borderRadius: 3, p: 2, minWidth: 480 },
  dialogTitle: { fontWeight: 300, fontSize: 28, color: '#616160', pb: 1, pr: 5 },
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
    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
    gap: 3,
  },
  dialogBackdrop: {
    backgroundColor: 'rgba(33,33,33,0.8)',
    backdropFilter: 'blur(5px)',
  },
  modalSectionText: {
    fontWeight: 500,
    fontSize: 18,
  },
  expiredDate: {
    color: '#d32f2f',
    fontWeight: 600,
  },
  expiringSoon: {
    color: '#ed6c02',
    fontWeight: 500,
  },
};

// Helper function to check if a date is expired
const isDateExpired = (dateString: string): boolean => {
  const expireDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
  return expireDate < today;
};

// Helper function to check if a date is expiring soon (within 7 days)
const isDateExpiringSoon = (dateString: string): boolean => {
  const expireDate = new Date(dateString);
  const today = new Date();
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() + 7);
  
  return expireDate >= today && expireDate <= sevenDaysFromNow;
};

// Helper function to get tooltip text for expiration date
const getExpirationTooltip = (dateString: string, t: (key: string) => string): string => {
  if (isDateExpired(dateString)) {
    return t('client.main.expirationTooltips.expired');
  } else if (isDateExpiringSoon(dateString)) {
    return t('client.main.expirationTooltips.expiringSoon');
  }
  return '';
};

const ClientsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { clients, loading, page, pageSize, total, search, fetchClients, setSearch, setPage } = useClientContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const loadMoreDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const [localSearch, setLocalSearch] = useState(search);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Debounced fetch on page/search change (debounce only the fetch, not the state update)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchClients({ page, pageSize, search, append: page > 1 });
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  // Infinite scroll (debounced load more)
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el || loading) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10 && clients.length < total) {
      if (loadMoreDebounceRef.current) clearTimeout(loadMoreDebounceRef.current);
      loadMoreDebounceRef.current = setTimeout(() => {
        setPage(page + 1);
      }, 300);
    }
  }, [clients?.length, total, setPage, loading, page]);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.addEventListener('scroll', handleScroll);
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Search input handler (update local state only)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    if (value === '') {
      setPage(1);
      setSearch('');
    }
  };

  // On Enter, update context search and reset page
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setPage(1);
      setSearch(localSearch);
    }
  };

  // Auto-load more if no scrollbar after data loads (debounced)
  useEffect(() => {
    const el = containerRef.current;
    if (!loading && el && clients?.length < total) {
      if (el.scrollHeight <= el.clientHeight) {
        if (loadMoreDebounceRef.current) clearTimeout(loadMoreDebounceRef.current);
        loadMoreDebounceRef.current = setTimeout(() => {
          setPage(page + 1);
        }, 300);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clients, loading, total]);

  const handleRowClick = (client: Client) => {
    setSelectedClient(client);
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedClient(null);
  };

  const handleSectionClick = (section: string, clientId: number | string) => {
    setModalOpen(false);
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
      case 'altro':
        navigate(`/clients/${clientId}/altro`);
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={styles.pageContainer}>
      <Box sx={styles.headerContainer}>
        <Typography sx={styles.pageTitle}>
          {t('client.main.title')}
        </Typography>
        <Box sx={styles.searchContainer}>
          <TextField
            size="small"
            placeholder={t('client.main.searchPlaceholder')}
            value={localSearch}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            InputProps={styles.searchInputProps}
            sx={styles.searchInput}
          />
          <IconButton sx={styles.filterButton}>
            <FilterIcon style={styles.filterIcon} />
          </IconButton>
        </Box>
      </Box>
      <TableContainer
        component={Paper}
        ref={containerRef}
        sx={styles.tableContainer}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={styles.tableCellHeader}>{t('client.main.clientName')}</TableCell>
              <TableCell sx={styles.tableCellHeader}>{t('client.main.subscription')}</TableCell>
              <TableCell sx={styles.tableCellHeader}>{t('client.main.expiration')}</TableCell>
              <TableCell sx={styles.tableCellHeader}>{t('client.main.messages')}</TableCell>
              <TableCell align="center" sx={styles.tableCellHeader}>{t('client.main.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients && clients?.map((client) => {
              const hasName = client.firstName || client.lastName;
              const fullName = [client.firstName, client.lastName].filter(Boolean).join(' ');
              return (
                <TableRow key={client.id} sx={styles.tableRow} onClick={() => handleRowClick(client)}>
                  <TableCell sx={styles.tableCell}>{hasName ? fullName : client.email}</TableCell>
                  <TableCell sx={styles.tableCell}>
                    {client.activeSubscription ? (
                      <Chip
                        label={client.activeSubscription.name || '--'}
                        sx={{ ...styles.chip, background: client.activeSubscription.color }}
                      />
                    ) : '--'}
                  </TableCell>
                  <TableCell sx={styles.tableCell}>
                    {client.activeSubscription && client.activeSubscription.expireDate ? (
                      <Tooltip 
                        title={getExpirationTooltip(client.activeSubscription.expireDate, t)} 
                        arrow
                        placement="top"
                        disableHoverListener={!isDateExpired(client.activeSubscription.expireDate) && !isDateExpiringSoon(client.activeSubscription.expireDate)}
                      >
                        <Typography
                          sx={{
                            ...styles.tableCell,
                            ...(isDateExpired(client.activeSubscription.expireDate) && styles.expiredDate),
                            ...(isDateExpiringSoon(client.activeSubscription.expireDate) && !isDateExpired(client.activeSubscription.expireDate) && styles.expiringSoon),
                            cursor: (isDateExpired(client.activeSubscription.expireDate) || isDateExpiringSoon(client.activeSubscription.expireDate)) ? 'help' : 'default'
                          }}
                        >
                          {new Date(client.activeSubscription.expireDate).toLocaleDateString()}
                        </Typography>
                      </Tooltip>
                    ) : (
                      '--'
                    )}
                  </TableCell>
                  <TableCell sx={styles.tableCell}>{client.totalMessages}</TableCell>
                  <TableCell sx={styles.tableActionCell}>
                    <IconButton size="small">
                      <EditIcon style={styles.editIcon} />
                    </IconButton>
                    <IconButton size="small">
                      <DeleteIcon style={styles.deleteIcon} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            {clients && clients.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={styles.emptyTableCell}>
                  <Box sx={styles.emptyStateBox}>
                    <img src="/public/icons/user.svg" alt={t('client.main.noClientsTitle')} style={styles.emptyStateImage} />
                    <span>{t('client.main.noClientsTitle')}</span>
                    <span style={styles.emptyStateDesc}>
                      {t('client.main.noClientsDescription')}
                    </span>
                  </Box>
                </TableCell>
              </TableRow>
            )}
            {loading && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={styles.loadingTableCell}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Client Modal */}
      <Dialog open={modalOpen} onClose={handleModalClose} maxWidth="sm" PaperProps={{ sx: styles.dialogPaper }}
       slotProps={{
              backdrop: {
                  timeout: 300,
                  sx: styles.dialogBackdrop,
              },
          }}
          >
        <DialogTitle sx={styles.dialogTitle}>
          {selectedClient ? `${selectedClient.firstName || ''} ${selectedClient.lastName || ''}`.trim() : ''}
          <IconButton aria-label="close" onClick={handleModalClose} sx={styles.dialogCloseButton}>
            <DialogCloseIcon style={styles.dialogCloseIcon} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={styles.dialogContent}>
          <Box sx={styles.dialogGrid}>
            <Box sx={styles.modalSectionBox} onClick={() => handleSectionClick('anagrafica', selectedClient?.id || '')}>
              <Box sx={styles.modalSectionTitle}>
                <AnagraficaIcon style={{ color: 'grey' }} />
                <Typography sx={styles.modalSectionText}>{t('client.main.modalSections.anagrafica.title')}</Typography>
              </Box>
              <hr style={styles.modalSectionDivider} />
              <ul style={styles.modalSectionList}>
                <li style={styles.modalSectionListItem}>{t('client.main.modalSections.anagrafica.items.information')}</li>
                <li style={styles.modalSectionListItem}>{t('client.main.modalSections.anagrafica.items.contacts')}</li>
              </ul>
            </Box>
            <Box sx={styles.modalSectionBox} onClick={() => handleSectionClick('allenamenti', selectedClient?.id || '')}>
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
            <Box sx={styles.modalSectionBox} onClick={() => handleSectionClick('diario', selectedClient?.id || '')}>
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
            <Box sx={styles.modalSectionBox} onClick={() => handleSectionClick('altro', selectedClient?.id || '')}>
              <Box sx={styles.modalSectionTitle}>
                <MoreIcon />
                <Typography sx={styles.modalSectionText}>{t('client.main.modalSections.altro.title')}</Typography>
              </Box>
              <hr style={styles.modalSectionDivider} />
              <ul style={styles.modalSectionList}>
                <li style={styles.modalSectionListItem}>{t('client.main.modalSections.altro.items.nutrition')}</li>
                <li style={styles.modalSectionListItem}>{t('client.main.modalSections.altro.items.subscription')}</li>
                <li style={styles.modalSectionListItem}>{t('client.main.modalSections.altro.items.notifications')}</li>
              </ul>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ClientsPage;
