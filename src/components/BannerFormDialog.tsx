import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, MenuItem, InputLabel, Select, FormControl, Fade } from '@mui/material';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useTranslation } from 'react-i18next';
import DialogCloseIcon from '../icons/DialogCloseIcon';
import ImageCropDialog from './ImageCropDialog';
import ImageCustom from './ImageCustom';

const defaultBanner = {
  title: '',
  description: '',
  size: 'Great',
  link: '',
  couponCode: '',
  color: '#E6BB4A',
  image: '',
};

const BannerFormDialog = ({ open, onClose, onSubmit, initialValues }: any) => {
  const { t } = useTranslation();
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
  const [form, setForm] = useState<any>(initialValues || defaultBanner);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [cropAspect, setCropAspect] = useState(1);

  // Reset form when dialog opens/closes or initialValues change
  useEffect(() => {
    if (open) {
      setForm(initialValues || defaultBanner);
    }
  }, [open, initialValues]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((f: any) => ({ ...f, [name]: value }));
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
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
    setForm((f: any) => ({ ...f, image: croppedImg }));
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
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: 8,
          px: 4,
          py: 2,
          background: '#fff',
          minWidth: 400,
          fontFamily: 'Montserrat, sans-serif',
        },
      }}
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
    >
      {/* Close icon */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1, mb: 0 }}>
        <Button onClick={onClose} sx={{ minWidth: 0, p: 0, background: 'transparent', boxShadow: 'none', '&:hover': { background: 'rgba(0,0,0,0.04)' }, mr: '-8px', mt: '-8px' }}>
          <DialogCloseIcon style={{ fontSize: 32, color: '#888' }} />
        </Button>
      </Box>
      <DialogTitle sx={{ fontSize: 32, fontWeight: 400, textAlign: 'left', pb: 0, pt: 0, position: 'relative', letterSpacing: 0.5, fontFamily: 'Montserrat, sans-serif', color: '#616160' }}>
        {isEdit ? t('banners.editBanner') : t('banners.addBanner')}
      </DialogTitle>
      <DialogContent sx={{ pt: 2, pb: 0, fontSize: 15, '& .MuiTypography-root, & .MuiInputBase-root, & .MuiButton-root': { fontSize: 15 }, fontFamily: 'Montserrat, sans-serif' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label={t('banners.title')} name="title" value={form.title} onChange={handleChange} required fullWidth sx={{ borderRadius: 2 }} InputProps={{ sx: { borderRadius: 2, fontSize: 18 } }} />
          <Box>
            <Box sx={{ mb: 1, fontWeight: 500, color: '#616160', fontFamily: 'Montserrat, sans-serif', fontSize: 15 }}>{t('banners.description')}</Box>
            <ReactQuill theme="snow" value={form.description} onChange={val => setForm((f: any) => ({ ...f, description: val }))} style={{ background: '#fff', borderRadius: 8 }} />
          </Box>
          <FormControl fullWidth sx={{ borderRadius: 2 }}>
            <InputLabel>{t('banners.size')}</InputLabel>
            <Select label={t('banners.size')} name="size" value={form.size} onChange={handleChange} sx={{ borderRadius: 2 }}>
              {sizeOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label={t('banners.link')} name="link" value={form.link} onChange={handleChange} required fullWidth sx={{ borderRadius: 2 }} InputProps={{ sx: { borderRadius: 2 } }} />
          <TextField label={t('banners.couponCode')} name="couponCode" value={form.couponCode} onChange={handleChange} fullWidth sx={{ borderRadius: 2 }} InputProps={{ sx: { borderRadius: 2 } }} />
          {/* Color dropdown style */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Box sx={{ minWidth: 60, color: '#616160', fontWeight: 500 }}>{t('banners.color')}:</Box>
            {/* Custom color picker */}
            <Box sx={{ width: 28, height: 28, borderRadius: '50%', background: form.color, border: '2px solid #eee', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 0.5, position: 'relative', overflow: 'hidden' }}>
              <input type="color" value={form.color} name="color" onChange={handleChange} style={{ opacity: 0, width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, cursor: 'pointer', border: 'none', padding: 0, margin: 0 }} tabIndex={-1} />
            </Box>
            {/* Dropdown for predefined colors */}
            <FormControl sx={{ minWidth: 120 }} size="small">
              <Select
                value={form.color}
                name="color"
                onChange={handleChange}
                displayEmpty
                sx={{ borderRadius: 2, background: '#fff' }}
                renderValue={selected => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 18, height: 18, borderRadius: '50%', background: selected, border: '1.5px solid #eee', mr: 1 }} />
                    <span>{colorOptions.find(opt => opt.value === selected)?.label || selected}</span>
                  </Box>
                )}
              >
                {colorOptions.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 18, height: 18, borderRadius: '50%', background: opt.value, border: '1.5px solid #eee', mr: 1 }} />
                      <span>{opt.label}</span>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button variant="outlined" component="label" sx={{ borderRadius: 2, fontWeight: 500, color: '#616160', borderColor: '#bdbdbd', background: '#fff', fontFamily: 'Montserrat, sans-serif', '&:hover': { background: '#f5f5f5', borderColor: '#bdbdbd' }, mt: 1 }}>
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
          {(form.image || (form.imageUrl || (form.image && form.image.signedUrl))) && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Box sx={{ position: 'relative', display: 'inline-block', boxShadow: 3, borderRadius: 3, background: '#faf9f7', p: 1 }}>
                  <ImageCustom
                    src={
                      form.image?.signedUrl
                        ? form.image.signedUrl
                        : form.imageUrl
                        ? form.imageUrl
                        : typeof form.image === 'string' && form.image.startsWith('data:')
                        ? form.image
                        : undefined
                    }
                    alt="banner"
                    style={{ width: '100%', objectFit: 'cover', borderRadius: 8, border: '1px solid #eee', background: '#fff' }}
                  />
                <Button
                  size="small"
                  onClick={() => {
                    setForm((f: any) => ({ ...f, image: null, imageUrl: null, imageId: null }));
                    setSelectedFile(null);
                  }}
                  sx={{
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
                  }}
                >
                  ×
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 4, pb: 3, pt: 2, justifyContent: 'center', gap: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ minWidth: 140, borderRadius: 2, fontWeight: 400, fontSize: 15, color: '#444', borderColor: '#bdbdbd', background: '#fff', fontFamily: 'Montserrat, sans-serif', '&:hover': { background: '#f5f5f5', borderColor: '#bdbdbd' } }}>{t('banners.cancel')}</Button>
        <Button onClick={handleSubmit} variant="contained" fullWidth sx={{ background: '#E6BB4A', color: '#fff', borderRadius: 2, fontWeight: 500, fontSize: 20, py: 0, minHeight: 40, height: 40, boxShadow: 1, letterSpacing: 1, fontFamily: 'Montserrat, sans-serif', textTransform: 'none', '&:hover': { background: '#E6BB4A' } }}>{isEdit ? t('banners.saveChanges') : t('banners.save')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BannerFormDialog;
