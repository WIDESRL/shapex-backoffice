import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Box, Typography, Paper, CircularProgress, TextField, Button, Collapse, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useClientContext } from '../../../../Context/ClientContext';
import VideoPreviewDialog from '../../../training/Exercises/VideoPreviewDialog';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FilterIcon from '../../../../icons/FilterIcon';

// Cache for thumbnails to avoid regenerating
const thumbnailCache = new Map<string, string>();

// VideoThumbnail component for generating and displaying thumbnails
interface VideoThumbnailProps {
  src: string;
  alt?: string;
  onClick?: () => void;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ src, alt = 'Video', onClick }) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy thumbnail generation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Check if thumbnail is already cached
    if (thumbnailCache.has(src)) {
      setThumbnail(thumbnailCache.get(src)!);
      return;
    }

    setLoading(true);

    // Generate thumbnail from video
    const generateThumbnail = () => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.preload = 'metadata';
      video.muted = true;
      video.src = src;

      video.onloadedmetadata = () => {
        // Seek to 200ms or 10% of video duration, whichever is smaller
        video.currentTime = Math.min(0.2, video.duration * 0.1);
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7);
            
            // Cache the thumbnail
            thumbnailCache.set(src, thumbnailUrl);
            setThumbnail(thumbnailUrl);
            setLoading(false);
          }
        } catch (err) {
          console.error('Error generating thumbnail:', err);
          setError(true);
          setLoading(false);
        }
      };

      video.onerror = () => {
        console.error('Error loading video for thumbnail');
        setError(true);
        setLoading(false);
      };
    };

    generateThumbnail();
  }, [src, isVisible]);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      {(!isVisible || loading) && (
        <CircularProgress size={40} sx={{ color: '#fff' }} />
      )}
      {error ? (
        <Typography sx={{ color: '#fff', fontSize: 14 }}>
          Error loading video
        </Typography>
      ) : thumbnail ? (
        <>
          <Box
            component="img"
            src={thumbnail}
            alt={alt}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
            }}
          />
          <IconButton
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: '#fff',
              width: 56,
              height: 56,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              },
            }}
          >
            <PlayArrowIcon sx={{ fontSize: 40 }} />
          </IconButton>
        </>
      ) : null}
    </Box>
  );
};


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
  videoGrid: {
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
  videoCard: {
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
  videoLabel: {
    p: 2,
    backgroundColor: '#fff',
    borderTop: '1px solid #f0f0f0',
  },
  videoLabelText: {
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

const AlbumVideoTab: React.FC = () => {
  const { t } = useTranslation();
  const { clientId } = useParams<{ clientId: string }>();
  const { userVideosAlbum, userVideosAlbumPagination, loadingUserVideosAlbum, fetchUserVideosAlbum } = useClientContext();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
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

  const debouncedFetchUserVideosAlbum = useCallback((clientId: string, page: number = 1, pageLimit: number = 20, startDate?: string, endDate?: string, append: boolean = false) => {
    const timeoutId = setTimeout(() => {
      setHasInitialFetch(true);
      fetchUserVideosAlbum(clientId, page, pageLimit, startDate, endDate, append);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [fetchUserVideosAlbum]);

  useEffect(() => {
    if (clientId) {
      const cleanup = debouncedFetchUserVideosAlbum(clientId, 1, 20, defaultStartDate, defaultEndDate, false);
      return cleanup;
    }
  }, [clientId, defaultStartDate, defaultEndDate, debouncedFetchUserVideosAlbum]);

  const handleApplyFilter = () => {
    if (clientId) {
      debouncedFetchUserVideosAlbum(clientId, 1, 20, startDate || undefined, endDate || undefined, false);
    }
  };

  const handleClearFilter = () => {
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    if (clientId) {
      debouncedFetchUserVideosAlbum(clientId, 1, 20, defaultStartDate, defaultEndDate, false);
    }
  };

  const handleLoadMore = () => {
    if (clientId && userVideosAlbumPagination?.hasNextPage) {
      const nextPage = userVideosAlbumPagination.page + 1;
      debouncedFetchUserVideosAlbum(clientId, nextPage, 20, startDate || undefined, endDate || undefined, true);
    }
  };

  const shouldShowLoadMore = userVideosAlbumPagination?.hasNextPage && 
    userVideosAlbum.length < (userVideosAlbumPagination?.total || 0);

  // Toggle filter section
  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const handleVideoClick = (videoUrl: string | null) => {
    if (videoUrl) {
      setSelectedVideo(videoUrl);
      setIsFullscreenOpen(true);
    }
  };

  const handleCloseFullscreen = () => {
    setIsFullscreenOpen(false);
    setSelectedVideo(null);
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
        {t('client.diario.albumVideo.loading')}
      </Typography>
    </Box>
  );

  // Empty state component
  const EmptyState = () => (
    <Box sx={styles.emptyState}>
      <Paper sx={styles.emptyStateCard} elevation={0}>
        <Box sx={styles.emptyStateIcon}>
          🎥
        </Box>
        <Typography sx={styles.emptyStateTitle}>
          {t('client.diario.albumVideo.emptyState.title')}
        </Typography>
        <Typography sx={styles.emptyStateDescription}>
          {t('client.diario.albumVideo.emptyState.description')}
        </Typography>
        <Typography sx={styles.emptyStateSubtext}>
          {t('client.diario.albumVideo.emptyState.subtitle')}
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
              {t('client.diario.albumVideo.filters.title')}
            </Typography>
          </Box>
        </Box>

        {/* Collapsible Filter Section */}
        <Collapse in={filterOpen} sx={styles.collapseContainer}>
          <Box sx={styles.filterContent}>
            <Box sx={styles.dateInputs}>
              <TextField
                label={t('client.diario.albumVideo.filters.startDate')}
                type="date"
                size="small"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={styles.dateField}
              />
              <TextField
                label={t('client.diario.albumVideo.filters.endDate')}
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
                {t('client.diario.albumVideo.filters.clear')}
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleApplyFilter}
                sx={styles.applyButton}
              >
                {t('client.diario.albumVideo.filters.apply')}
              </Button>
            </Box>
          </Box>
        </Collapse>

        {(loadingUserVideosAlbum && userVideosAlbum.length === 0) || !hasInitialFetch ? (
          <LoadingState />
        ) : userVideosAlbum.length === 0 ? (
          <EmptyState />
        ) : (
          <Box sx={styles.scrollContainer}>
            <Box sx={styles.videoGrid}>
              {userVideosAlbum.map((video) => (
                <Box
                  key={video.id}
                  sx={styles.videoCard}
                >
                  <Box sx={{ 
                    height: '220px', 
                    overflow: 'hidden', 
                    width: '100%', 
                    position: 'relative',
                    backgroundColor: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <VideoThumbnail
                      src={video.signedUrl}
                      alt={`Video ${video.id}`}
                      onClick={() => handleVideoClick(video.signedUrl)}
                    />
                  </Box>
                  <Box sx={styles.videoLabel}>
                    <Typography sx={styles.videoLabelText}>
                      {t('client.diario.albumVideo.uploadDate')}: {formatDate(video.createdAt)}
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
                  disabled={loadingUserVideosAlbum}
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
                  {loadingUserVideosAlbum ? (
                    <>
                      <CircularProgress size={16} sx={{ mr: 1, color: 'inherit' }} />
                      {t('client.diario.albumVideo.loadingMore')}
                    </>
                  ) : (
                    t('client.diario.albumVideo.loadMore')
                  )}
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>

      <VideoPreviewDialog
        open={isFullscreenOpen}
        videoUrl={selectedVideo || ''}
        onClose={handleCloseFullscreen}
      />
    </>
  );
};

export default AlbumVideoTab;
