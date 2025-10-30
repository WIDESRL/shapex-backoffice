import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  IconButton,
  Fade,
  Backdrop,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Product, useProducts } from '../../Context/ProductsContext';
import DialogCloseIcon from '../../icons/DialogCloseIcon2';

// Extended Product interface to include message field
interface ProductWithMessage extends Product {
  message?: string;
}

interface ProductFormDialogProps {
  open: boolean;
  onClose: () => void;
  product?: ProductWithMessage | null;
}

const styles = {
  dialog: {
    borderRadius: 4,
    boxShadow: 8,
    px: 4,
    py: 2,
    background: '#fff',
    minWidth: 400,
    fontSize: 16,
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
    color: '#888',
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
    '& .MuiTypography-root, & .MuiInputBase-root, & .MuiButton-root': {
      fontSize: 15,
    },
    '& .MuiDialogTitle-root': {
      fontSize: 28,
    },
    '&::-webkit-scrollbar': {
      width: '6px',
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#e0e0e0',
      borderRadius: '6px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#bdbdbd',
    },
    scrollbarWidth: 'thin',
    scrollbarColor: '#e0e0e0 transparent',
  },
  textFieldInput: {
    borderRadius: 2,
    fontSize: 18,
  },
  dialogActions: {
    px: 4,
    pb: 3,
    pt: 2,
  },
  submitButton: {
    background: '#E6BB4A',
    color: '#fff',
    borderRadius: 2,
    fontWeight: 500,
    fontSize: 24,
    py: 0,
    minHeight: 40,
    height: 40,
    boxShadow: 1,
    letterSpacing: 1,
    fontFamily: 'Montserrat, sans-serif',
    textTransform: 'none' as const,
    '&:hover': { background: '#E6BB4A' },
  },
  cancelButton: {
    color: '#666',
    fontFamily: 'Montserrat, sans-serif',
    textTransform: 'none' as const,
    fontSize: 16,
    px: 3,
  },
};

const ProductFormDialog: React.FC<ProductFormDialogProps> = ({
  open,
  onClose,
  product,
}) => {
  const { t } = useTranslation();
  const { productTypes, addProduct, updateProduct } = useProducts();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    typeId: 0,
    message: '',
    appleProductIdentifier: '',
    androidProductIdentifier: '',
  });
  
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    price: '',
    typeId: '',
    message: '',
    appleProductIdentifier: '',
    androidProductIdentifier: '',
  });
  
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(product);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price,
        typeId: product.typeId,
        message: product.message || '',
        appleProductIdentifier: product.appleProductIdentifier || '',
        androidProductIdentifier: product.androidProductIdentifier || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        price: 0,
        typeId: productTypes.length > 0 ? productTypes[0].id : 0,
        message: '',
        appleProductIdentifier: '',
        androidProductIdentifier: '',
      });
    }
    setErrors({ title: '', description: '', price: '', typeId: '', message: '', appleProductIdentifier: '', androidProductIdentifier: '' });
  }, [product, productTypes, open]); // Added 'open' dependency

  // Update typeId when productTypes are loaded and no product is being edited
  useEffect(() => {
    if (!product && productTypes.length > 0 && formData.typeId === 0) {
      setFormData(prev => ({
        ...prev,
        typeId: productTypes[0].id,
      }));
    }
  }, [productTypes, product, formData.typeId]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      typeId: productTypes.length > 0 ? productTypes[0].id : 0,
      message: '',
      appleProductIdentifier: '',
      androidProductIdentifier: '',
    });
    setErrors({ title: '', description: '', price: '', typeId: '', message: '', appleProductIdentifier: '', androidProductIdentifier: '' });
    setLoading(false);
  };

  const handleClose = () => {
    // Only reset form if not editing (i.e., when adding new product)
    if (!isEdit) {
      resetForm();
    }
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value as number;
    setFormData(prev => ({
      ...prev,
      typeId: value,
    }));
    if (errors.typeId) {
      setErrors(prev => ({ ...prev, typeId: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: formData.title.trim() ? '' : t('products.validation.titleRequired'),
      description: formData.description.trim() ? '' : t('products.validation.descriptionRequired'),
      price: formData.price > 0 ? '' : t('products.validation.pricePositive'),
      typeId: formData.typeId > 0 ? '' : t('products.validation.typeRequired'),
      message: '', // Message field is optional
      appleProductIdentifier: '', // Optional field
      androidProductIdentifier: '', // Optional field
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (isEdit && product) {
        await updateProduct({
          ...product,
          ...formData,
        });
      } else {
        await addProduct(formData);
        // Reset form after successful addition (but not for edit)
        resetForm();
      }
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: styles.dialog }}
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: styles.backdrop }}
      TransitionComponent={Fade}
    >
      {/* Close icon row above the title */}
      <Box sx={styles.closeButtonContainer}>
        <IconButton
          onClick={handleClose}
          sx={styles.closeButton}
          size="large"
        >
          <DialogCloseIcon style={{ fontSize: 32 }} />
        </IconButton>
      </Box>
      <DialogTitle sx={styles.dialogTitle}>
        {isEdit ? t('products.editProduct') : t('products.addProduct')}
      </DialogTitle>

      <DialogContent sx={styles.dialogContent}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Title */}
          <TextField
            label={t('products.productTitle')}
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            margin="normal"
            InputProps={{ sx: styles.textFieldInput }}
          />

          {/* Description */}
          <TextField
            label={t('products.productDescription')}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            error={!!errors.description}
            helperText={errors.description}
            fullWidth
            margin="normal"
            multiline
            minRows={3}
            InputProps={{ sx: styles.textFieldInput }}
          />

          {/* Message */}
          <TextField
            label={t('products.pushNotificationMessage')}
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            error={!!errors.message}
            helperText={errors.message}
            placeholder={t('products.pushNotificationPlaceholder')}
            fullWidth
            margin="normal"
            multiline
            minRows={2}
            InputProps={{ sx: styles.textFieldInput }}
          />

          {/* Price */}
          <TextField
            label={t('products.price')}
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            error={!!errors.price}
            helperText={errors.price}
            fullWidth
            margin="normal"
            InputProps={{
              sx: styles.textFieldInput,
              inputProps: { min: 0, step: 1 },
            }}
          />

          {/* Apple Product Identifier */}
          <TextField
            label={t('products.appleProductIdentifier')}
            name="appleProductIdentifier"
            value={formData.appleProductIdentifier}
            onChange={handleInputChange}
            error={!!errors.appleProductIdentifier}
            helperText={errors.appleProductIdentifier}
            placeholder="com.example.product.item"
            fullWidth
            margin="normal"
            InputProps={{ sx: styles.textFieldInput }}
          />

          {/* Android Product Identifier */}
          <TextField
            label={t('products.androidProductIdentifier')}
            name="androidProductIdentifier"
            value={formData.androidProductIdentifier}
            onChange={handleInputChange}
            error={!!errors.androidProductIdentifier}
            helperText={errors.androidProductIdentifier}
            placeholder="com.example.product.item"
            fullWidth
            margin="normal"
            InputProps={{ sx: styles.textFieldInput }}
          />

          {/* Product Type */}
          <FormControl fullWidth variant="outlined" margin="normal" error={!!errors.typeId}>
            <InputLabel sx={{ fontFamily: 'Montserrat, sans-serif' }}>
              {t('products.type')}
            </InputLabel>
            <Select
              name="typeId"
              value={formData.typeId}
              onChange={handleSelectChange}
              label={t('products.type')}
              sx={{
                ...styles.textFieldInput,
                '& .MuiSelect-select': {
                  fontFamily: 'Montserrat, sans-serif',
                },
              }}
            >
              {productTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
            {errors.typeId && (
              <FormHelperText sx={{ fontFamily: 'Montserrat, sans-serif' }}>
                {errors.typeId}
              </FormHelperText>
            )}
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={styles.dialogActions}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          fullWidth
          sx={styles.submitButton}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            isEdit ? t('products.save') : t('products.add')
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductFormDialog;