import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, Paper, CircularProgress, TextField, Button, Collapse } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useClientContext } from '../../../../Context/ClientContext';
import FullscreenImageDialog from '../../../../components/FullscreenImageDialog';
import ImageCustom from '../../../../components/ImageCustom';
import FilterIcon from '../../../../icons/FilterIcon';

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
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 3,
    overflowY: 'auto',
    overflowX: 'hidden',
    pb: 2,
    flex: 1,
    '&::-webkit-scrollbar': {
      width: 4,
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#f1f1f1',
      borderRadius: 4,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#c1c1c1',
      borderRadius: 4,
      '&:hover': {
        backgroundColor: '#a8a8a8',
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
  photoCard: {
    position: 'relative',
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    minHeight: '280px',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
  },
  photoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain' as const,
    display: 'block',
  },
  photoLabel: {
    p: 2,
    backgroundColor: '#fff',
    borderTop: '1px solid #f0f0f0',
  },
  photoLabelText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 500,
  },
  loadMoreContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    p: 3,
  },
  scrollContainer: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    pr: 1,
    '&::-webkit-scrollbar': {
      width: 4,
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#f1f1f1',
      borderRadius: 4,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#c1c1c1',
      borderRadius: 4,
      '&:hover': {
        backgroundColor: '#a8a8a8',
      },
    },
  },
};

const AlbumFotograficoTab: React.FC = () => {
  const { t } = useTranslation();
  const { clientId } = useParams<{ clientId: string }>();
  const { userImagesAlbum, userImagesAlbumPagination, loadingUserImagesAlbum, fetchUserImagesAlbum } = useClientContext();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

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

  const debouncedFetchUserImagesAlbum = useCallback((clientId: string, page: number = 1, pageLimit: number = 20, startDate?: string, endDate?: string, append: boolean = false) => {
    const timeoutId = setTimeout(() => {
      setHasInitialFetch(true);
      fetchUserImagesAlbum(clientId, page, pageLimit, startDate, endDate, append);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [fetchUserImagesAlbum]);

  useEffect(() => {
    if (clientId) {
      const cleanup = debouncedFetchUserImagesAlbum(clientId, 1, 20, defaultStartDate, defaultEndDate, false);
      return cleanup;
    }
  }, [clientId, defaultStartDate, defaultEndDate, debouncedFetchUserImagesAlbum]);

  const handleApplyFilter = () => {
    if (clientId) {
      debouncedFetchUserImagesAlbum(clientId, 1, 20, startDate || undefined, endDate || undefined, false);
    }
  };

  const handleClearFilter = () => {
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    if (clientId) {
      debouncedFetchUserImagesAlbum(clientId, 1, 20, defaultStartDate, defaultEndDate, false);
    }
  };

  const handleLoadMore = () => {
    if (clientId && userImagesAlbumPagination?.hasNextPage) {
      const nextPage = userImagesAlbumPagination.page + 1;
      debouncedFetchUserImagesAlbum(clientId, nextPage, 20, startDate || undefined, endDate || undefined, true);
    }
  };

  const shouldShowLoadMore = userImagesAlbumPagination?.hasNextPage && 
    userImagesAlbum.length < (userImagesAlbumPagination?.total || 0);

  // Toggle filter section
  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const handleImageClick = (imageUrl: string | null) => {
    if (imageUrl) {
      setSelectedImage(imageUrl);
      setIsFullscreenOpen(true);
    }
  };

  const handleCloseFullscreen = () => {
    setIsFullscreenOpen(false);
    setSelectedImage(null);
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Loading component
  const LoadingState = () => (
    <Box sx={styles.loadingContainer}>
      <CircularProgress size={40} sx={{ color: '#E6BB4A' }} />
      <Typography sx={styles.loadingText}>
        {t('client.diario.albumFotografico.loading')}
      </Typography>
    </Box>
  );

  // Empty state component
  const EmptyState = () => (
    <Box sx={styles.emptyState}>
      <Paper sx={styles.emptyStateCard} elevation={0}>
        <Box sx={styles.emptyStateIcon}>
          📸
        </Box>
        <Typography sx={styles.emptyStateTitle}>
          {t('client.diario.albumFotografico.emptyState.title')}
        </Typography>
        <Typography sx={styles.emptyStateDescription}>
          {t('client.diario.albumFotografico.emptyState.description')}
        </Typography>
        <Typography sx={styles.emptyStateSubtext}>
          {t('client.diario.albumFotografico.emptyState.subtitle')}
        </Typography>
      </Paper>
    </Box>
  );

  return (
    <>
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
              {t('client.diario.albumFotografico.filters.title')}
            </Typography>
          </Box>
        </Box>

        {/* Collapsible Filter Section */}
        <Collapse in={filterOpen} sx={styles.collapseContainer}>
          <Box sx={styles.filterContent}>
            <Box sx={styles.dateInputs}>
              <TextField
                label={t('client.diario.albumFotografico.filters.startDate')}
                type="date"
                size="small"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={styles.dateField}
              />
              <TextField
                label={t('client.diario.albumFotografico.filters.endDate')}
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
                {t('client.diario.albumFotografico.filters.clear')}
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleApplyFilter}
                sx={styles.applyButton}
              >
                {t('client.diario.albumFotografico.filters.apply')}
              </Button>
            </Box>
          </Box>
        </Collapse>

        {(loadingUserImagesAlbum && userImagesAlbum.length === 0) || !hasInitialFetch ? (
          <LoadingState />
        ) : userImagesAlbum.length === 0 ? (
          <EmptyState />
        ) : (
          <Box sx={styles.scrollContainer}>
            <Box sx={styles.imageGrid}>
              {userImagesAlbum.map((image) => (
                <Box
                  key={image.id}
                  sx={styles.photoCard}
                  onClick={() => handleImageClick(image.signedUrl)}
                >
                  <Box sx={{ 
                    height: '220px', 
                    overflow: 'hidden', 
                    width: '100%', 
                    position: 'relative',
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ImageCustom
                      src={image.signedUrl}
                      alt={`Photo ${image.id}`}
                      style={styles.photoImage}
                    />
                  </Box>
                  <Box sx={styles.photoLabel}>
                    <Typography sx={styles.photoLabelText}>
                      {t('client.diario.albumFotografico.uploadDate')}: {formatDate(image.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            
            {/* Load More Section */}
            {shouldShowLoadMore && (
              <Box sx={styles.loadMoreContainer}>
                <Button
                  variant="outlined"
                  onClick={handleLoadMore}
                  disabled={loadingUserImagesAlbum}
                  sx={{
                    textTransform: 'none',
                    fontSize: 14,
                    px: 4,
                    py: 1,
                    borderColor: '#E6BB4A',
                    color: '#E6BB4A',
                    '&:hover': {
                      backgroundColor: '#E6BB4A',
                      color: '#fff',
                    },
                  }}
                >
                  {loadingUserImagesAlbum ? (
                    <>
                      <CircularProgress size={16} sx={{ mr: 1, color: 'inherit' }} />
                      {t('client.diario.albumFotografico.loadingMore')}
                    </>
                  ) : (
                    t('client.diario.albumFotografico.loadMore')
                  )}
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>

      <FullscreenImageDialog
        open={isFullscreenOpen}
        imageUrl={selectedImage}
        onClose={handleCloseFullscreen}
      />
    </>
  );
};

export default AlbumFotograficoTab;
