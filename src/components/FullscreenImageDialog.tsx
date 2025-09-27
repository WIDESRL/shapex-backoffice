import React from 'react';
import { Dialog, Fade, Box, Button } from '@mui/material';
import ImageCustom from './ImageCustom';

interface FullscreenImageDialogProps {
    open: boolean;
    imageUrl?: string | null;
    onClose: () => void;
}

const FullscreenImageDialog: React.FC<FullscreenImageDialogProps> = ({ open, imageUrl, onClose }) => (
    <Dialog
        open={open}
        onClose={onClose}
        fullScreen
        sx={{ zIndex: 1400, background: 'transparent' }}
        PaperProps={{ sx: { background: 'transparent', boxShadow: 'none' } }}
        slotProps={{
            backdrop: {
                timeout: 300,
                sx: {
                    backgroundColor: 'rgba(33,33,33,0.8)',
                    backdropFilter: 'blur(5px)',
                },
            },
        }}
        TransitionComponent={Fade}
        onClick={onClose}
    >
        <Box sx={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', position: 'relative' }}
            >
            <ImageCustom
                src={imageUrl || ''}
                alt="banner-fullscreen"
                style={{
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    borderRadius: 12,
                    boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)',
                }}
                onClick={(e) => e.stopPropagation()}
            />
             <Button onClick={onClose} sx={{ position: 'absolute', top: 32, right: 32, background: 'rgba(255,255,255,0.85)', borderRadius: '50%', minWidth: 0, width: 48, height: 48, p: 0, fontSize: 32, color: '#333', fontWeight: 700, zIndex: 2, boxShadow: 2, '&:hover': { background: '#fff' } }}>×</Button>
        </Box>
    </Dialog>
);

export default FullscreenImageDialog;
