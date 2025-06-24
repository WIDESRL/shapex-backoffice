import React, { useState } from 'react';
import { Avatar, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface AvatarCustomProps {
  src: string;
  alt?: string;
  sx?: React.CSSProperties;
  fallback?: React.ReactNode;
}

const DotsLoader = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 1,
    background: 'rgba(255,255,255,0.5)'
  }}>
    <span style={{
      width: 8, height: 8, margin: 2, borderRadius: '50%',
      background: '#EDB528', display: 'inline-block', animation: 'dotFlashing 1s infinite linear alternate'
    }} />
    <span style={{
      width: 8, height: 8, margin: 2, borderRadius: '50%',
      background: '#EDB528', display: 'inline-block', animation: 'dotFlashing 1s 0.3s infinite linear alternate'
    }} />
    <span style={{
      width: 8, height: 8, margin: 2, borderRadius: '50%',
      background: '#EDB528', display: 'inline-block', animation: 'dotFlashing 1s 0.6s infinite linear alternate'
    }} />
    <style>
      {`
        @keyframes dotFlashing {
          0% { opacity: 0.2; }
          100% { opacity: 1; }
        }
      `}
    </style>
  </div>
);

const AvatarCustom: React.FC<AvatarCustomProps> = ({ src, alt = '', sx, fallback }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setRetryKey(prev => prev + 1);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {loading && !error && <DotsLoader />}
      {error ? (
        <IconButton
          onClick={handleRetry}
          sx={{
            width: sx?.width || 40,
            height: sx?.height || 40,
            borderRadius: '50%',
            background: '#f5f5f5',
          }}
        >
          <RefreshIcon color="primary" />
        </IconButton>
      ) : (
        <Avatar
          key={retryKey}
          src={src}
          alt={alt}
          sx={sx}
          imgProps={{
            onLoad: handleLoad,
            onError: handleError,
            style: { display: loading ? 'none' : 'block' },
          }}
        >
          {fallback}
        </Avatar>
      )}
    </div>
  );
};

export default AvatarCustom;