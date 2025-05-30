import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Dialog, DialogActions, DialogContent, Button, Box, Slider } from '@mui/material';

function getCroppedImg(imageSrc: string, crop: any, zoom: number, aspect: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const cropWidth = crop.width * scaleX;
      const cropHeight = crop.height * scaleY;
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject();
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        cropWidth,
        cropHeight
      );
      canvas.toBlob(blob => {
        if (!blob) return reject();
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      }, 'image/jpeg');
    };
    image.onerror = reject;
  });
}

interface ImageCropDialogProps {
  open: boolean;
  imageSrc: string;
  aspect: number;
  onClose: () => void;
  onCropComplete: (croppedImage: string) => void;
}

const ImageCropDialog: React.FC<ImageCropDialogProps> = ({ open, imageSrc, aspect, onClose, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropCompleteCb = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    if (!croppedAreaPixels) return;
    const croppedImg = await getCroppedImg(imageSrc, croppedAreaPixels, zoom, aspect);
    onCropComplete(croppedImg);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ position: 'relative', height: 400, background: '#222' }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropCompleteCb}
        />
        <Box sx={{ position: 'absolute', bottom: 16, left: 0, width: '100%', px: 3 }}>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.01}
            onChange={(_, value) => setZoom(value as number)}
            aria-labelledby="Zoom"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleCrop} variant="contained" color="primary">Crop</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageCropDialog;
