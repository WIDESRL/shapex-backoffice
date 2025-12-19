import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton, CircularProgress } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface VideoPlayerProps {
  src: string;
  alt?: string;
  style?: React.CSSProperties;
  maxWidth?: number;
  maxHeight?: number;
}

// Cache for thumbnails to avoid regenerating
const thumbnailCache = new Map<string, string>();

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  src, 
  alt = 'Video', 
  style,
  maxWidth = 400,
  maxHeight = 300
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
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
      { rootMargin: '100px' } // Start loading 100px before visible
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
      video.muted = true; // Ensure muted for autoplay policies
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

  const handlePlay = () => {
    setIsPlaying(true);
  };

  // If video is playing, render actual video player
  if (isPlaying) {
    return (
      <Box
        component="video"
        ref={videoRef}
        src={src}
        controls
        autoPlay
        controlsList="nodownload"
        preload="auto"
        style={{
          maxWidth,
          maxHeight,
          width: '100%',
          borderRadius: 8,
          ...style,
        }}
      >
        {alt}
      </Box>
    );
  }

  // Show thumbnail with play button
  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        display: 'inline-block',
        ...style,
      }}
      onClick={!loading && !error ? handlePlay : undefined}
    >
      {(!isVisible || loading) && (
        <Box
          sx={{
            width: 150,
            height: maxHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'grey',
            borderRadius: 2,
          }}
        >
          <CircularProgress size={40} sx={{ color: '#fff' }} />
        </Box>
      )}
      {error ? (
        // Fallback to video element if thumbnail generation fails
        <Box
          component="video"
          src={src}
          controls
          controlsList="nodownload"
          preload="metadata"
          style={{
            maxWidth,
            maxHeight,
            width: '100%',
          }}
        >
          {alt}
        </Box>
      ) : thumbnail ? (
        <>
          <Box
            component="img"
            src={thumbnail}
            alt={alt}
            sx={{
              maxWidth,
              maxHeight,
              width: 'auto',
              height: 'auto',
              display: 'block',
              borderRadius: 2,
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

export default VideoPlayer;
