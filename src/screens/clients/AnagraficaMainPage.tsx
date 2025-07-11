import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment, Typography, Box, Chip, CircularProgress } from '@mui/material';
import MagnifierIcon from '../../icons/MagnifierIcon';
import UserIcon from '../../icons/UserIcon';
import { useClientContext } from '../../Context/ClientContext';

// --- Styles ---
const styles = {
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
  tableCellHeader: { background: '#EDEDED', fontWeight: 500 },
  tableCell: { py: 0.5 },
  tableActionCell: { py: 0.5, textAlign: 'center' },
  tableRow: {
    height: 42,
    cursor: 'pointer',
  },
  emptyTableCell: {
    py: 6,
    color: '#888',
    fontSize: 20,
    fontWeight: 400,
  },
  loadingTableCell: {
    py: 2,
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
};

const AnagraficaPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { clients, loading, page, pageSize, total, search, fetchClients, setSearch, setPage } = useClientContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const loadMoreDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const [localSearch, setLocalSearch] = useState(search);
  const [hasInitialFetch, setHasInitialFetch] = useState(false);

  // Debounced fetch on page/search change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setHasInitialFetch(true);
      fetchClients({ page, pageSize, search, append: page > 1 });
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  // Infinite scroll
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

  // Search input handler
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

  // Auto-load more if no scrollbar after data loads
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

  const handleRowClick = (clientId: string | number) => {
    navigate(`/clients/${clientId}/anagrafica`);
  };

  return (
    <Box sx={styles.pageContainer}>
      <Box sx={styles.headerContainer}>
        <Typography sx={styles.pageTitle}>
          {t('client.anagrafica.title')}
        </Typography>
        <Box sx={styles.searchContainer}>
          <TextField
            size="small"
            placeholder={t('client.anagrafica.searchPlaceholder')}
            value={localSearch}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            InputProps={styles.searchInputProps}
            sx={styles.searchInput}
          />
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
              <TableCell sx={styles.tableCellHeader}>{t('client.anagrafica.firstName')}</TableCell>
              <TableCell sx={styles.tableCellHeader}>{t('client.anagrafica.lastName')}</TableCell>
              <TableCell sx={styles.tableCellHeader}>{t('client.anagrafica.subscription')}</TableCell>
              <TableCell sx={styles.tableCellHeader}>{t('client.anagrafica.email')}</TableCell>
              <TableCell sx={styles.tableCellHeader}>{t('client.anagrafica.phone')}</TableCell>
              <TableCell sx={styles.tableCellHeader}>{t('client.anagrafica.dateOfBirth')}</TableCell>
              <TableCell sx={styles.tableCellHeader}>{t('client.anagrafica.placeOfBirth')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients && clients?.map((client) => (
              <TableRow 
                key={client.id} 
                sx={styles.tableRow} 
                onClick={() => handleRowClick(client.id)}
              >
                <TableCell sx={styles.tableCell}>{client.firstName || '--'}</TableCell>
                <TableCell sx={styles.tableCell}>{client.lastName || '--'}</TableCell>
                <TableCell sx={styles.tableCell}>
                  {client.activeSubscription ? (
                    <Chip
                      label={client.activeSubscription.name || '--'}
                      sx={{ ...styles.chip, background: client.activeSubscription.color }}
                    />
                  ) : '--'}
                </TableCell>
                <TableCell sx={styles.tableCell}>{client.email || '--'}</TableCell>
                <TableCell sx={styles.tableCell}>{client.phoneNumber || '--'}</TableCell>
                <TableCell sx={styles.tableCell}>
                  {client.dateOfBirth 
                    ? new Date(client.dateOfBirth).toLocaleDateString() 
                    : '--'}
                </TableCell>
                <TableCell sx={styles.tableCell}>{client.placeOfBirth || '--'}</TableCell>
              </TableRow>
            ))}
            {clients && clients.length === 0 && !loading && hasInitialFetch && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={styles.emptyTableCell}>
                  <Box sx={styles.emptyStateBox}>
                    <UserIcon />
                    <span>{t('client.anagrafica.noClientsTitle')}</span>
                    <span style={styles.emptyStateDesc}>
                      {t('client.anagrafica.noClientsDescription')}
                    </span>
                  </Box>
                </TableCell>
              </TableRow>
            )}
            {(loading || !hasInitialFetch) && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={styles.loadingTableCell}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AnagraficaPage;
