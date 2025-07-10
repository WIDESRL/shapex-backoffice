import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, CircularProgress, TextField, Button, Collapse } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useClientContext } from '../../../../Context/ClientContext';
import { useParams } from 'react-router-dom';
import FilterIcon from '../../../../icons/FilterIcon';
import InfoIcon from '../../../../icons/InfoIcon';
import CheckImagesDialog from '../../../../components/CheckDetailsDialog';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    height: '100%',
    minHeight: '500px',
  },
  filterHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 2,
  },
  filterButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    padding: '8px 16px',
    backgroundColor: '#f5f5f5',
    borderRadius: 2,
    border: '1px solid #e0e0e0',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#eeeeee',
      borderColor: '#d0d0d0',
    },
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: 500,
    color: '#333',
  },
  filterIcon: {
    color: '#616160',
    fontSize: 20,
  },
  collapseContainer: {
    mb: 1.5,
  },
  filterContent: {
    backgroundColor: '#fafafa',
    border: '1px solid #e0e0e0',
    borderRadius: 2,
    p: 2.5,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  dateInputs: {
    display: 'flex',
    gap: 2,
    alignItems: 'center',
    flexWrap: 'wrap',
    mb: 2,
  },
  dateField: {
    minWidth: 200,
    '& .MuiInputBase-root': {
      borderRadius: 1,
      backgroundColor: '#fff',
    },
    '& .MuiInputLabel-root': {
      fontSize: 14,
      color: '#757575',
    },
  },
  filterButtons: {
    display: 'flex',
    gap: 1,
    justifyContent: 'flex-end',
  },
  applyButton: {
    backgroundColor: '#E6BB4A',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#d4a537',
    },
    textTransform: 'none',
    fontSize: 14,
    px: 3,
  },
  clearButton: {
    backgroundColor: 'transparent',
    color: '#757575',
    border: '1px solid #e0e0e0',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
    textTransform: 'none',
    fontSize: 14,
    px: 3,
  },
  tableContainer: {
    borderRadius: 2,
    boxShadow: 'none',
    flex: 1,
    overflowX: 'auto',
    overflowY: 'auto',
    width: '100%',
    maxWidth: '75vw',
    height: 'fit-content',
    '&::-webkit-scrollbar': {
      height: '8px',
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#c1c1c1',
      borderRadius: '4px',
      '&:hover': {
        background: '#a8a8a8',
      },
    },
  },
  table: {
    minWidth: '800px', // Force minimum width to trigger horizontal scroll
    width: 'auto',
    tableLayout: 'fixed' as const,
  },
  tableCellHeader: {
    background: '#EDEDED',
    fontWeight: 500,
    fontSize: 14,
    color: '#616160',
    padding: '12px 16px',
    width: '120px',
    minWidth: '120px',
    maxWidth: '120px',
    whiteSpace: 'nowrap',
    borderTop: '1px solid #ddd',
    borderBottom: '1px solid #ddd',
    borderLeft: 'none',
    borderRight: 'none',
  },
  tableCellHeaderFixed: {
    background: '#EDEDED',
    fontWeight: 500,
    fontSize: 14,
    color: '#616160',
    padding: '12px 16px',
    width: '180px',
    minWidth: '180px',
    maxWidth: '180px',
    position: 'sticky' as const,
    left: 0,
    top: 0,
    zIndex: 11,
    borderTop: '1px solid #ddd',
    borderBottom: '1px solid #ddd',
    borderLeft: 'none',
    borderRight: 'none',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
  },
  tableCell: {
    py: 1.5,
    px: 2,
    fontSize: 14,
    color: '#333',
    width: '120px',
    minWidth: '120px',
    maxWidth: '120px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    borderTop: '1px solid #eee',
    borderBottom: '1px solid #eee',
    borderLeft: 'none',
    borderRight: 'none',
  },
  metricaCell: {
    py: 1.5,
    px: 2,
    fontSize: 14,
    color: '#333',
    fontWeight: 500,
    width: '180px',
    minWidth: '180px',
    maxWidth: '180px',
    position: 'sticky' as const,
    left: 0,
    zIndex: 10,
    backgroundColor: '#fff',
    borderTop: '1px solid #eee',
    borderBottom: '1px solid #eee',
    borderLeft: 'none',
    borderRight: 'none',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  tableRow: {
    '&:hover': { 
      backgroundColor: '#f5f5f5',
      '& .sticky-cell': {
        backgroundColor: '#f5f5f5',
      },
    },
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    textAlign: 'center',
    px: 4,
    py: 4,
    minHeight: '300px',
  },
  emptyStateCard: {
    p: 4,
    borderRadius: 3,
    border: '2px dashed #e0e0e0',
    backgroundColor: '#fafafa',
    maxWidth: 450,
    width: '100%',
    boxShadow: 'none',
  },
  emptyStateIcon: {
    fontSize: 48,
    color: '#bdbdbd',
    mb: 2,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#424242',
    mb: 1.5,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 1.5,
    mb: 2,
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: '#9e9e9e',
    fontStyle: 'italic',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    gap: 2,
    minHeight: '300px',
  },
  loadingText: {
    color: '#757575',
    fontSize: 16,
    mt: 2,
  },
  dateHeaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 0.5,
  },
  imageIconInHeader: {
    fontSize: 16,
    color: '#1976d2',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      color: '#1565c0',
      transform: 'scale(1.1)',
    },
  },
  dialogTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    py: 2,
    px: 3,
  },
  dialogContent: {
    p: 3,
    minHeight: '200px',
  },
};

const MisurazioniTab: React.FC = () => {
  const { t } = useTranslation();
  const { clientId } = useParams<{ clientId: string }>();
  const { userChecks, loadingUserChecks, fetchUserChecks } = useClientContext();
  
  // Calculate default date range (1 year ago to today) - memoized to avoid recalculation
  const { defaultStartDate, defaultEndDate } = useMemo(() => {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    return {
      defaultStartDate: oneYearAgo.toISOString().split('T')[0],
      defaultEndDate: today.toISOString().split('T')[0]
    };
  }, []);
  
  const [filterOpen, setFilterOpen] = useState(false);
  const [startDate, setStartDate] = useState<string>(defaultStartDate);
  const [endDate, setEndDate] = useState<string>(defaultEndDate);
  const [hasInitialFetch, setHasInitialFetch] = useState(false);

  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedCheckId, setSelectedCheckId] = useState<number | null>(null);

  const handleImageClick = (checkId: number) => {
    setSelectedCheckId(checkId);
    setImageDialogOpen(true);
  };

  const handleCloseImageDialog = () => {
    setImageDialogOpen(false);
    setSelectedCheckId(null);
  };

  const debouncedFetchUserChecks = useCallback(
    (clientId: string, startDate?: string, endDate?: string) => {
      const timeoutId = setTimeout(() => {
        setHasInitialFetch(true);
        fetchUserChecks(clientId, startDate, endDate);
      }, 200);
      
      return () => clearTimeout(timeoutId);
    },
    [fetchUserChecks]
  );

  useEffect(() => {
    if (clientId) {
      const cleanup = debouncedFetchUserChecks(clientId, defaultStartDate, defaultEndDate);
      return cleanup;
    }
  }, [clientId, defaultStartDate, defaultEndDate, debouncedFetchUserChecks]);

  const handleApplyFilter = () => {
    if (clientId) {
      debouncedFetchUserChecks(clientId, startDate || undefined, endDate || undefined);
    }
  };

  const handleClearFilter = () => {
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    if (clientId) {
      debouncedFetchUserChecks(clientId, defaultStartDate, defaultEndDate);
    }
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const { measurementDates, measurementData, fullDateTimes, sortedChecks } = useMemo(() => {
    if (!userChecks || userChecks.length === 0) {
      return { measurementDates: [], measurementData: [], fullDateTimes: [], sortedChecks: [] };
    }

    const sortedChecks = [...userChecks].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const dates = sortedChecks.map(check => {
      const date = new Date(check.createdAt);
      return date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '-');
    });

    const fullDateTimes = sortedChecks.map(check => {
      const date = new Date(check.createdAt);
      return date.toLocaleString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    });

    const getMeasurementLabel = (field: string) => {
      const labelKey = `checkImages.measurements.${field}`;
      return t(labelKey, field); 
    };

    const measurementFields = [
      'addome', 'altezza', 'avambraccioDx', 'avambraccioSx',
      'braccioDx', 'braccioContrattoDx', 'braccioSx', 'braccioContrattoSx',
      'cavigliaDx', 'cavigliaSx', 'collo', 'gambaDx', 'gambaMedialeDx', 'gambaSx', 'peso'
    ];

    const data = measurementFields.map((apiField) => {
      const displayName = getMeasurementLabel(apiField);
      const values = sortedChecks.map(check => {
        const value = check[apiField];
        if (!value) return '-';
        
        // Add appropriate unit
        if (apiField === 'peso') {
          return `${value} kg`;
        } else if (apiField === 'altezza') {
          return `${value} cm`;
        } else {
          return `${value} cm`;
        }
      });

      return {
        metrica: displayName,
        values
      };
    }).filter(item => 
      item.values.some(value => value !== '-')
    );

    return {
      measurementDates: dates,
      measurementData: data,
      fullDateTimes,
      sortedChecks
    };
  }, [userChecks, t]);

  const tableWidth = 180 + (measurementDates.length * 120);

  const LoadingState = () => (
    <Box sx={styles.loadingContainer}>
      <CircularProgress size={40} sx={{ color: '#E6BB4A' }} />
      <Typography sx={styles.loadingText}>
        {t('client.diario.misurazioni.loading')}
      </Typography>
    </Box>
  );

  const EmptyState = () => (
    <Box sx={styles.emptyState}>
      <Paper sx={styles.emptyStateCard} elevation={0}>
        <Box sx={styles.emptyStateIcon}>
          📏
        </Box>
        <Typography sx={styles.emptyStateTitle}>
          {t('client.diario.misurazioni.emptyState.title')}
        </Typography>
        <Typography sx={styles.emptyStateDescription}>
          {t('client.diario.misurazioni.emptyState.description')}
        </Typography>
        <Typography sx={styles.emptyStateSubtext}>
          {t('client.diario.misurazioni.emptyState.subtitle')}
        </Typography>
      </Paper>
    </Box>
  );

  if (loadingUserChecks || !hasInitialFetch) {
    return (
      <Box sx={styles.container}>
        {/* Filter Header */}
        <Box sx={styles.filterHeader}>
          <Box 
            component="div" 
            sx={styles.filterButton}
            onClick={toggleFilter}
          >
            <FilterIcon style={styles.filterIcon} />
            <Typography sx={styles.filterButtonText}>
              {t('client.diario.misurazioni.filters.title')}
            </Typography>
          </Box>
        </Box>

        {/* Collapsible Filter Section */}
        <Collapse in={filterOpen} sx={styles.collapseContainer}>
          <Box sx={styles.filterContent}>
            <Box sx={styles.dateInputs}>
              <TextField
                label={t('client.diario.misurazioni.filters.startDate')}
                type="date"
                size="small"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={styles.dateField}
              />
              <TextField
                label={t('client.diario.misurazioni.filters.endDate')}
                type="date"
                size="small"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={styles.dateField}
              />
            </Box>
            <Box sx={styles.filterButtons}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleClearFilter}
                sx={styles.clearButton}
              >
                {t('client.diario.misurazioni.filters.clear')}
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleApplyFilter}
                sx={styles.applyButton}
              >
                {t('client.diario.misurazioni.filters.apply')}
              </Button>
            </Box>
          </Box>
        </Collapse>

        <LoadingState />
      </Box>
    );
  }

  if (hasInitialFetch && (!userChecks || userChecks.length === 0 || measurementData.length === 0)) {
    return (
      <Box sx={styles.container}>
        {/* Filter Header */}
        <Box sx={styles.filterHeader}>
          <Box 
            component="div" 
            sx={styles.filterButton}
            onClick={toggleFilter}
          >
            <FilterIcon style={styles.filterIcon} />
            <Typography sx={styles.filterButtonText}>
              {t('client.diario.misurazioni.filters.title')}
            </Typography>
          </Box>
        </Box>

        {/* Collapsible Filter Section */}
        <Collapse in={filterOpen} sx={styles.collapseContainer}>
          <Box sx={styles.filterContent}>
            <Box sx={styles.dateInputs}>
              <TextField
                label={t('client.diario.misurazioni.filters.startDate')}
                type="date"
                size="small"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={styles.dateField}
              />
              <TextField
                label={t('client.diario.misurazioni.filters.endDate')}
                type="date"
                size="small"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={styles.dateField}
              />
            </Box>
            <Box sx={styles.filterButtons}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleClearFilter}
                sx={styles.clearButton}
              >
                {t('client.diario.misurazioni.filters.clear')}
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleApplyFilter}
                sx={styles.applyButton}
              >
                {t('client.diario.misurazioni.filters.apply')}
              </Button>
            </Box>
          </Box>
        </Collapse>

        <EmptyState />
      </Box>
    );
  }

  return (
    <Box sx={styles.container}>
      {/* Filter Header */}
      <Box sx={styles.filterHeader}>
        <Box 
          component="div" 
          sx={styles.filterButton}
          onClick={toggleFilter}
        >
          <FilterIcon style={styles.filterIcon} />
          <Typography sx={styles.filterButtonText}>
            {t('client.diario.misurazioni.filters.title')}
          </Typography>
        </Box>
      </Box>

      {/* Collapsible Filter Section */}
      <Collapse in={filterOpen} sx={styles.collapseContainer}>
        <Box sx={styles.filterContent}>
          <Box sx={styles.dateInputs}>
            <TextField
              label={t('client.diario.misurazioni.filters.startDate')}
              type="date"
              size="small"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={styles.dateField}
            />
            <TextField
              label={t('client.diario.misurazioni.filters.endDate')}
              type="date"
              size="small"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={styles.dateField}
            />
          </Box>
          <Box sx={styles.filterButtons}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleClearFilter}
              sx={styles.clearButton}
            >
              {t('client.diario.misurazioni.filters.clear')}
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleApplyFilter}
              sx={styles.applyButton}
            >
              {t('client.diario.misurazioni.filters.apply')}
            </Button>
          </Box>
        </Box>
      </Collapse>

      {/* Table Section */}
      <TableContainer component={Paper} sx={styles.tableContainer}>
      <Table 
        stickyHeader 
        sx={{ 
          ...styles.table, 
          width: `${tableWidth}px`,
          minWidth: `${tableWidth}px`
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell sx={styles.tableCellHeaderFixed}>{t('checkImages.measurementsTable.metricHeader')}</TableCell>
            {measurementDates.map((date, index) => (
              <TableCell 
                key={index} 
                sx={styles.tableCellHeader}
                title={fullDateTimes[index]}
              >
                <Box sx={styles.dateHeaderContainer}>
                  <Typography variant="body2" sx={{ fontSize: 14 }}>
                    {date}
                  </Typography>
                  <InfoIcon 
                    style={styles.imageIconInHeader}
                    onClick={() => handleImageClick(sortedChecks[index].id)}
                  />
                </Box>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {measurementData.map((row, index) => (
            <TableRow key={index} sx={styles.tableRow}>
              <TableCell sx={styles.metricaCell} className="sticky-cell">{row.metrica}</TableCell>
              {row.values.map((value, valueIndex) => (
                <TableCell key={valueIndex} sx={styles.tableCell}>{value}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    {/* Image Preview Dialog */}
    <CheckImagesDialog
      open={imageDialogOpen}
      onClose={handleCloseImageDialog}
      checkId={selectedCheckId}
    />
    </Box>
  );
};

export default MisurazioniTab;
