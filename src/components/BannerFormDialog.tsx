import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, MenuItem, InputLabel, Select, FormControl, Fade, SelectChangeEvent } from '@mui/material';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useTranslation } from 'react-i18next';
import DialogCloseIcon from '../icons/DialogCloseIcon2';
import ImageCropDialog from './ImageCropDialog';
import ImageCustom from './ImageCustom';

export interface BannerForm {
  title: string;
  description: string;
  size: string;
  link: string;
  couponCode: string;
  color: string;
  image: string | File | ImageWithSignedUrl | null;
  imageUrl?: string;
  imageId?: string | null;
}

interface ImageWithSignedUrl {
  signedUrl?: string;
}

interface BannerFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: BannerForm, selectedFile: File | null) => void;
  initialValues?: Partial<BannerForm> | null;
}

const defaultBanner: BannerForm = {
  title: '',
  description: '',
  size: 'Great',
  link: '',
  couponCode: '',
  color: '#E6BB4A',
  image: '',
};

const BannerFormDialog = ({ open, onClose, onSubmit, initialValues }: BannerFormDialogProps) => {
  const { t } = useTranslation();
  
  // ===== STYLES SECTION =====
  const styles = {
    dialog: {
      borderRadius: 4,
      boxShadow: 8,
      px: 4,
      py: 2,
      background: '#fff',
      minWidth: 400,
      fontFamily: 'Montserrat, sans-serif',
    },
    backdrop: {
      timeout: 300,
      sx: {
        backgroundColor: 'rgba(33,33,33,0.8)',
        backdropFilter: 'blur(5px)',
      },
    },
    closeButtonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      mt: 1,
      mb: 0,
    },
    closeButton: {
      minWidth: 0,
      p: 0,
      background: 'transparent',
      boxShadow: 'none',
      '&:hover': { background: 'rgba(0,0,0,0.04)' },
      mr: '-8px',
      mt: '-8px',
    },
    dialogTitle: {
      fontSize: 32,
      fontWeight: 400,
      textAlign: 'left',
      pb: 0,
      pt: 0,
      position: 'relative',
      letterSpacing: 0.5,
      fontFamily: 'Montserrat, sans-serif',
      color: '#616160',
    },
    dialogContent: {
      pt: 2,
      pb: 0,
      fontSize: 15,
      '& .MuiTypography-root, & .MuiInputBase-root, & .MuiButton-root': { fontSize: 15 },
      fontFamily: 'Montserrat, sans-serif',
    },
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      mt: 1,
    },
    textField: {
      borderRadius: 2,
    },
    textFieldInput: {
      borderRadius: 2,
      fontSize: 18,
    },
    descriptionLabel: {
      mb: 1,
      fontWeight: 500,
      color: '#616160',
      fontFamily: 'Montserrat, sans-serif',
      fontSize: 15,
    },
    reactQuill: {
      background: '#fff',
      borderRadius: 8,
    },
    formControl: {
      borderRadius: 2,
    },
    select: {
      borderRadius: 2,
    },
    colorContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      mt: 1,
    },
    colorLabel: {
      minWidth: 60,
      color: '#616160',
      fontWeight: 500,
    },
    colorPicker: {
      width: 28,
      height: 28,
      borderRadius: '50%',
      border: '2px solid #eee',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mr: 0.5,
      position: 'relative',
      overflow: 'hidden',
    },
    colorInput: {
      opacity: 0,
      width: '100%',
      height: '100%',
      position: 'absolute' as const,
      left: 0,
      top: 0,
      cursor: 'pointer',
      border: 'none',
      padding: 0,
      margin: 0,
    },
    colorSelect: {
      borderRadius: 2,
      background: '#fff',
    },
    colorSelectItem: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
    },
    colorCircle: {
      width: 18,
      height: 18,
      borderRadius: '50%',
      border: '1.5px solid #eee',
      mr: 1,
    },
    imageButton: {
      borderRadius: 2,
      fontWeight: 500,
      color: '#616160',
      borderColor: '#bdbdbd',
      background: '#fff',
      fontFamily: 'Montserrat, sans-serif',
      '&:hover': { background: '#f5f5f5', borderColor: '#bdbdbd' },
      mt: 1,
    },
    imageInput: {
      opacity: 0,
      position: 'absolute',
      width: '100%',
      height: '100%',
      cursor: 'pointer',
    },
    imagePreviewContainer: {
      display: 'flex',
      justifyContent: 'center',
      mt: 2,
    },
    imageWrapper: {
      position: 'relative',
      display: 'inline-block',
      boxShadow: 3,
      borderRadius: 3,
      background: '#faf9f7',
      p: 1,
    },
    imageStyle: {
      width: '100%',
      objectFit: 'cover' as const,
      borderRadius: 8,
      border: '1px solid #eee',
      background: '#fff',
    },
    deleteImageButton: {
      minWidth: 0,
      position: 'absolute',
      top: 6,
      right: 6,
      background: 'rgba(255,255,255,0.7)',
      borderRadius: '50%',
      padding: 0,
      zIndex: 2,
      fontWeight: 'bold',
      color: '#333',
      width: 28,
      height: 28,
      fontSize: 22,
      boxShadow: 1,
      '&:hover': { background: 'rgba(255,255,255,1)' },
    },
    dialogActions: {
      px: 4,
      pb: 3,
      pt: 2,
      justifyContent: 'center',
      gap: 2,
    },
    cancelButton: {
      minWidth: 140,
      borderRadius: 2,
      fontWeight: 400,
      fontSize: 15,
      color: '#444',
      borderColor: '#bdbdbd',
      background: '#fff',
      fontFamily: 'Montserrat, sans-serif',
      '&:hover': { background: '#f5f5f5', borderColor: '#bdbdbd' },
    },
    submitButton: {
      background: '#E6BB4A',
      color: '#fff',
      borderRadius: 2,
      fontWeight: 500,
      fontSize: 20,
      py: 0,
      minHeight: 40,
      height: 40,
      boxShadow: 1,
      letterSpacing: 1,
      fontFamily: 'Montserrat, sans-serif',
      textTransform: 'none',
      '&:hover': { background: '#E6BB4A' },
    },
  };

  const sizeOptions = [
    { value: 'Great', label: t('banners.sizeGreat') },
    { value: 'Medium', label: t('banners.sizeMedium') },
    { value: 'Small', label: t('banners.sizeSmall') },
  ];
  const colorOptions = [
    { value: '#E6BB4A', label: 'Gold' },
    { value: '#FF0000', label: 'Red' },
    { value: '#00C853', label: 'Green' },
    { value: '#2979FF', label: 'Blue' },
    { value: '#FFD600', label: 'Yellow' },
    { value: '#FF9100', label: 'Orange' },
    { value: '#616160', label: 'Gray' },
  ];
  const isEdit = Boolean(initialValues);
  const [form, setForm] = useState<BannerForm>(() => ({ ...defaultBanner, ...initialValues }));
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [cropAspect, setCropAspect] = useState(1);

  // Reset form when dialog opens/closes or initialValues change
  useEffect(() => {
    if (open) {
      setForm({ ...defaultBanner, ...initialValues });
    }
  }, [open, initialValues]);

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f: BannerForm) => ({ ...f, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setForm((f: BannerForm) => ({ ...f, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = ev => {
        setCropImageSrc(ev.target?.result as string);
        // Set aspect ratio based on size
        const size = form.size || 'Great';
        setCropAspect(size === 'Medium' ? 2 : 1);
        setCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImg: string) => {
    setForm((f: BannerForm) => ({ ...f, image: croppedImg }));
    // Convert base64 to File
    const arr = croppedImg.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const file = new File([u8arr], 'cropped-image.jpg', { type: mime });
    setSelectedFile(file);
    setCropDialogOpen(false);
    setCropImageSrc(null);
  };

  const handleSubmit = () => {
    if (!form.title || !form.link || !form.color) return;
    onSubmit(form, selectedFile);
    setForm(defaultBanner);
    setSelectedFile(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: styles.dialog }}
      slotProps={{ backdrop: styles.backdrop }}
      TransitionComponent={Fade}
    >
      {/* Close icon */}
      <Box sx={styles.closeButtonContainer}>
        <Button onClick={onClose} sx={styles.closeButton}>
          <DialogCloseIcon style={{ fontSize: 32, color: '#888' }} />
        </Button>
      </Box>
      <DialogTitle sx={styles.dialogTitle}>
        {isEdit ? t('banners.editBanner') : t('banners.addBanner')}
      </DialogTitle>
      <DialogContent sx={styles.dialogContent}>
        <Box sx={styles.formContainer}>
          <TextField 
            label={t('banners.title')} 
            name="title" 
            value={form.title} 
            onChange={handleTextFieldChange} 
            required 
            fullWidth 
            sx={styles.textField} 
            InputProps={{ sx: styles.textFieldInput }} 
          />
          <Box>
            <Box sx={styles.descriptionLabel}>{t('banners.description')}</Box>
            <ReactQuill 
              theme="snow" 
              value={form.description} 
              onChange={val => setForm((f: BannerForm) => ({ ...f, description: val }))} 
              style={styles.reactQuill} 
            />
          </Box>
          <FormControl fullWidth sx={styles.formControl}>
            <InputLabel>{t('banners.size')}</InputLabel>
            <Select label={t('banners.size')} name="size" value={form.size} onChange={handleSelectChange} sx={styles.select}>
              {sizeOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField 
            label={t('banners.link')} 
            name="link" 
            value={form.link} 
            onChange={handleTextFieldChange} 
            required 
            fullWidth 
            sx={styles.textField} 
            InputProps={{ sx: { borderRadius: 2 } }} 
          />
          <TextField 
            label={t('banners.couponCode')} 
            name="couponCode" 
            value={form.couponCode} 
            onChange={handleTextFieldChange} 
            fullWidth 
            sx={styles.textField} 
            InputProps={{ sx: { borderRadius: 2 } }} 
          />
          {/* Color dropdown style */}
          <Box sx={styles.colorContainer}>
            <Box sx={styles.colorLabel}>{t('banners.color')}:</Box>
            {/* Custom color picker */}
            <Box sx={{ ...styles.colorPicker, background: form.color }}>
              <input 
                type="color" 
                value={form.color} 
                name="color" 
                onChange={handleTextFieldChange} 
                style={styles.colorInput} 
                tabIndex={-1} 
              />
            </Box>
            {/* Dropdown for predefined colors */}
            <FormControl sx={{ minWidth: 120 }} size="small">
              <Select
                value={form.color}
                name="color"
                onChange={handleSelectChange}
                displayEmpty
                sx={styles.colorSelect}
                renderValue={selected => (
                  <Box sx={styles.colorSelectItem}>
                    <Box sx={{ ...styles.colorCircle, background: selected }} />
                    <span>{colorOptions.find(opt => opt.value === selected)?.label || selected}</span>
                  </Box>
                )}
              >
                {colorOptions.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>
                    <Box sx={styles.colorSelectItem}>
                      <Box sx={{ ...styles.colorCircle, background: opt.value }} />
                      <span>{opt.label}</span>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button variant="outlined" component="label" sx={styles.imageButton}>
            {t('banners.image')}
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
          </Button>
          <ImageCropDialog
            open={cropDialogOpen}
            imageSrc={cropImageSrc || ''}
            aspect={cropAspect}
            onClose={() => setCropDialogOpen(false)}
            onCropComplete={handleCropComplete}
          />
          {(form.image || form.imageUrl) && (
            <Box sx={styles.imagePreviewContainer}>
              <Box sx={styles.imageWrapper}>
                <ImageCustom
                  src={
                    typeof form.image === 'object' && form.image !== null && 'signedUrl' in form.image && form.image.signedUrl
                      ? form.image.signedUrl
                      : form.imageUrl || 
                        (typeof form.image === 'string' && form.image.startsWith('data:') ? form.image : '')
                  }
                  alt="banner"
                  style={styles.imageStyle}
                />
                <Button
                  size="small"
                  onClick={() => {
                    setForm((f: BannerForm) => ({ ...f, image: null, imageUrl: undefined, imageId: null }));
                    setSelectedFile(null);
                  }}
                  sx={styles.deleteImageButton}
                >
                  ×
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={styles.dialogActions}>
        <Button onClick={onClose} variant="outlined" sx={styles.cancelButton}>
          {t('banners.cancel')}
        </Button>
        <Button onClick={handleSubmit} variant="contained" fullWidth sx={styles.submitButton}>
          {isEdit ? t('banners.saveChanges') : t('banners.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BannerFormDialog;
