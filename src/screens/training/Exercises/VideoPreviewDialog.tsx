import React from 'react';
import { Dialog, IconButton, Fade, Box } from '@mui/material';
import DialogCloseIcon from '../../../icons/DialogCloseIcon';

interface VideoPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  videoUrl: string;
}

const styles = {
  dialogPaper: {
    background: 'rgba(33,33,33,0.7)',
    boxShadow: 'none',
    width: '100vw',
    height: '100vh',
    m: 0,
    p: 0,
    overflow: 'hidden',
  },
  dialogBackdrop: {
    backgroundColor: 'rgba(33,33,33,0.8)',
    backdropFilter: 'blur(5px)',
  },
  root: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  videoBox: {
    border: '2px solid #4A90E2',
    borderRadius: 2,
    background: '#222',
    p: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '90vw',
    maxHeight: '90vh',
    boxSizing: 'border-box',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: -35,
    right: -35,
    zIndex: 2,
    width: 45,
    height: 45,
    pointerEvents: 'auto',
  },
  closeIcon: {
    fontSize: 22,
    color: '#fff',
  },
  video: {
    maxWidth: '90vw',
    maxHeight: '90vh',
    width: 'auto',
    height: 'auto',
    background: '#000',
    borderRadius: 8,
    display: 'block',
    objectFit: 'contain',
  },
};

const VideoPreviewDialog: React.FC<VideoPreviewDialogProps> = ({ open, onClose, videoUrl }) => {
  return (
      <Dialog
          open={open}
          onClose={onClose}
          maxWidth={false}
          fullScreen
          PaperProps={{ sx: styles.dialogPaper }}
          slotProps={{
              backdrop: {
                  timeout: 300,
                  sx: styles.dialogBackdrop,
              },
          }}
          TransitionComponent={Fade}
      >
      <Box sx={styles.root}>
        <Box sx={styles.videoBox}>
          <IconButton
            onClick={onClose}
            sx={styles.closeButton}
          >
            <DialogCloseIcon style={styles.closeIcon} />
          </IconButton>
          <video
            src={videoUrl}
            controls
            autoPlay
            style={styles.video as React.CSSProperties}
          />
        </Box>
      </Box>
    </Dialog>
  );
};

export default VideoPreviewDialog;
