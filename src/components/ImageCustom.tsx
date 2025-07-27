import React, { useState } from 'react';
import { CircularProgress, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ImageCustomProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  style?: React.CSSProperties;
  className?: string;
  spinnerSize?: number;
}

const ImageCustom: React.FC<ImageCustomProps> = ({
  src,
  alt = '',
  style,
  className,
  spinnerSize = 40,
  ...rest
}) => {
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

  const handleRetry = (event: { stopPropagation: () => void; }) => {
    event.stopPropagation();
    setLoading(true);
    setError(false);
    setRetryKey(prev => prev + 1);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', ...style }}>
      {loading && !error && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.7)', zIndex: 1
        }}>
          <CircularProgress size={spinnerSize} />
        </div>
      )}
      {error ? (
        <div style={{
          width: style?.width || 80,
          height: style?.height || 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f5',
          borderRadius: 8,
        }}>
          <IconButton onClick={handleRetry}>
            <RefreshIcon color="primary" />
          </IconButton>
        </div>
      ) : (
        <img
          key={retryKey}
          src={src}
          alt={alt}
          className={className}
          style={{
            ...style,
            display: 'block',
          }}
          onLoad={handleLoad}
          onError={handleError}
          loading='lazy'
          {...rest}
        />
      )}
    </div>
  );
};

export default ImageCustom;