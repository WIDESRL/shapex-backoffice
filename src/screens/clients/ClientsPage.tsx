import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, InputAdornment, Typography, Box, Chip, CircularProgress, Tooltip, Autocomplete } from '@mui/material';
import MagnifierIcon from '../../icons/MagnifierIcon';
import UserIcon from '../../icons/UserIcon';
import { Client, useClientContext } from '../../Context/ClientContext';
import { useSubscriptions, Subscription } from '../../Context/SubscriptionsContext';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DiaryIcon from '../../icons/DiarioIcon';
import MoreIcon from '../../icons/MoreIcon';
import AlimentazioneIcon from '../../icons/AlimentazioneIcon';
import DialogCloseIcon from '../../icons/DialogCloseIcon2';
import AnagraficaIcon from '../../icons/AnagraficaIcon';
import AllenamentiIcon from '../../icons/AllenamentiIcon';
import { getContrastColor } from '../../utils/colorUtils';

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
  tableCellHeader: { 
    background: '#EDEDED', 
    fontWeight: 500,
    minWidth: 120,
    whiteSpace: 'nowrap',
  },
  tableCell: { 
    py: 0.5,
    minWidth: 120,
    whiteSpace: 'nowrap',
  },
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
    maxWidth: '78vw',
    margin: '0 auto',
    overflow: 'auto',
    overflowX: 'auto',
    scrollbarWidth: 'none', 
    msOverflowStyle: 'none',
  },
  searchInput: {
    width: { xs: 200, sm: 300, md: 440 },
    mr: 1,
    ml: 5,
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
    fontWeight: 300,
    color: '#616160',
    fontSize: '40px'
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
  subscriptionFilter: {
    width: { xs: 150, sm: 200, md: 250 },
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      backgroundColor: '#fff',
    },
    '& .MuiInputBase-input': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },
  subscriptionMenuItem: {
    maxWidth: 250,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
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

const ClientsPage: React.FC<{ dashboard?: boolean }> = ({ dashboard = false }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { clients, loading, page, pageSize, total, search, fetchClients, setSearch, setPage } = useClientContext();
  const { subscriptions, fetchSubscriptions } = useSubscriptions();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const loadMoreDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const subscriptionsDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const [localSearch, setLocalSearch] = useState(search);
  const [subscriptionFilter, setSubscriptionFilter] = useState<Subscription | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [hasInitialFetch, setHasInitialFetch] = useState(false);

  // Debounced fetch on page/search change (debounce only the fetch, not the state update)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setHasInitialFetch(true);
      const subscriptionId = subscriptionFilter?.id?.toString() || undefined;
      fetchClients({ page, pageSize, search, subscriptionId, append: page > 1 });
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, subscriptionFilter]);

  // Fetch subscriptions on mount with debounce
  useEffect(() => {
    if (subscriptionsDebounceRef.current) clearTimeout(subscriptionsDebounceRef.current);
    subscriptionsDebounceRef.current = setTimeout(() => {
      fetchSubscriptions();
    }, 300);
    
    return () => {
      if (subscriptionsDebounceRef.current) clearTimeout(subscriptionsDebounceRef.current);
    };
  }, [fetchSubscriptions]);

  // Infinite scroll (debounced load more)
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el || loading) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10 && clients.length < total) {
      if (loadMoreDebounceRef.current) clearTimeout(loadMoreDebounceRef.current);
      loadMoreDebounceRef.current = setTimeout(() => {
        setPage(page + 1);
      }, 500);
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
    setPage(1);
    setSearch(value);
  };

  // Subscription filter handler
  const handleSubscriptionFilterChange = (_event: React.SyntheticEvent, value: Subscription | null) => {
    setSubscriptionFilter(value);
    setPage(1);
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
      case 'alimentazione':
        navigate(`/clients/${clientId}/alimentazione`);
        break;
      case 'altro':
        navigate(`/clients/${clientId}/altro`);
        break;
      default:
        break;
    }
  };

  // Calculate number of columns for colspan
  const totalColumns = useMemo(() => dashboard ? 4 : 8, [dashboard]);

  // Memoize client display name
  const clientDisplayName = useMemo(() => {
    if (!selectedClient) return '';
    const fullName = `${selectedClient.firstName || ''} ${selectedClient.lastName || ''}`.trim();
    return fullName || selectedClient.email || '';
  }, [selectedClient]);

  return (
    <Box sx={styles.pageContainer}>
      <Box sx={styles.headerContainer}>
        <Typography sx={styles.pageTitle}>
          {t('client.main.title')}
        </Typography>
        {!dashboard && (
          <Box sx={styles.searchContainer}>
            <TextField
              size="small"
              placeholder={t('client.main.searchPlaceholder')}
              value={localSearch}
              onChange={handleSearchChange}
              InputProps={styles.searchInputProps}
              sx={styles.searchInput}
            />
            <Autocomplete
              size="small"
              options={subscriptions}
              getOptionLabel={(option) => option.title}
              value={subscriptionFilter}
              onChange={handleSubscriptionFilterChange}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('client.main.subscription')}
                  placeholder={t('client.main.allSubscriptions')}
                  sx={styles.subscriptionFilter}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: subscriptionFilter ? (
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: subscriptionFilter.color || '#ccc',
                          marginLeft: 1,
                          marginRight: 0.5,
                          flexShrink: 0,
                        }}
                      />
                    ) : null,
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box 
                  component="li" 
                  {...props} 
                  sx={{
                    ...styles.subscriptionMenuItem,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                  title={option.title.length > 20 ? option.title : ''}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: option.color || '#ccc',
                      flexShrink: 0,
                    }}
                  />
                  {option.title}
                </Box>
              )}
              ListboxProps={{
                style: {
                  maxHeight: 300,
                },
              }}
              clearOnBlur={false}
              clearOnEscape
              openOnFocus
            />
          </Box>
        )}
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
              {!dashboard && <TableCell sx={styles.tableCellHeader}>{t('client.anagrafica.email')}</TableCell>}
              {!dashboard && <TableCell sx={styles.tableCellHeader}>{t('client.anagrafica.phone')}</TableCell>}
              {!dashboard && <TableCell sx={styles.tableCellHeader}>{t('client.anagrafica.dateOfBirth')}</TableCell>}
              {!dashboard && <TableCell sx={styles.tableCellHeader}>{t('client.anagrafica.placeOfBirth')}</TableCell>}
              <TableCell sx={styles.tableCellHeader}>{t('client.main.messages')}</TableCell>
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
                        sx={{ 
                          ...styles.chip, 
                          background: client.activeSubscription.color,
                          color: getContrastColor(client.activeSubscription.color || '#ffffff'),
                          maxWidth: 300,
                          '& .MuiChip-label': {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                          },
                        }}
                        title={client.activeSubscription.name || '--'}
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
                  {!dashboard && <TableCell sx={styles.tableCell}>{client.email || '--'}</TableCell>}
                  {!dashboard && <TableCell sx={styles.tableCell}>{client.phoneNumber || '--'}</TableCell>}
                  {!dashboard && (
                    <TableCell sx={styles.tableCell}>
                      {client.dateOfBirth ? new Date(client.dateOfBirth).toLocaleDateString() : '--'}
                    </TableCell>
                  )}
                  {!dashboard && <TableCell sx={styles.tableCell}>{client.placeOfBirth || '--'}</TableCell>}
                  <TableCell sx={styles.tableCell}>{client.totalMessages}</TableCell>
                </TableRow>
              );
            })}
            {clients && clients.length === 0 && !loading && hasInitialFetch && (
              <TableRow>
                <TableCell colSpan={totalColumns} align="center" sx={styles.emptyTableCell}>
                  <Box sx={styles.emptyStateBox}>
                    <UserIcon  />
                    <span>{t('client.main.noClientsTitle')}</span>
                    <span style={styles.emptyStateDesc}>
                      {subscriptionFilter ? t('client.main.noClientsForSubscription') : t('client.main.noClientsDescription')}
                    </span>
                  </Box>
                </TableCell>
              </TableRow>
            )}
            {(loading || !hasInitialFetch) && (
              <TableRow>
                <TableCell colSpan={totalColumns} align="center" sx={styles.loadingTableCell}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Client Modal */}
      <Dialog open={modalOpen} onClose={handleModalClose} maxWidth="md" PaperProps={{ sx: styles.dialogPaper }}
       slotProps={{
              backdrop: {
                  timeout: 300,
                  sx: styles.dialogBackdrop,
              },
          }}
          >
        <DialogTitle sx={styles.dialogTitle}>
          {clientDisplayName}
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
            <Box sx={styles.modalSectionBox} onClick={() => handleSectionClick('alimentazione', selectedClient?.id || '')}>
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
            <Box sx={styles.modalSectionBox} onClick={() => handleSectionClick('altro', selectedClient?.id || '')}>
              <Box sx={styles.modalSectionTitle}>
                <MoreIcon />
                <Typography sx={styles.modalSectionText}>{t('client.main.modalSections.altro.title')}</Typography>
              </Box>
              <hr style={styles.modalSectionDivider} />
              <ul style={styles.modalSectionList}>
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
