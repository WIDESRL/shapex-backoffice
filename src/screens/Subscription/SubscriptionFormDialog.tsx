import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Switch,
  Fade,
  Backdrop,
} from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Subscription } from '../../Context/SubscriptionsContext';
import DialogCloseIcon from '../../icons/DialogCloseIcon2';

interface SubscriptionFormDialogProps {
  open: boolean;
  formData: Omit<Subscription, 'id'>;
  errors: {
    title: string;
    description: string;
    duration: string;
    order: string;
  };
  onClose: () => void;
  onSubmit: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editMode: boolean;
}

const colorOptions = [
  { value: '#FF0000', label: 'Red' },
  { value: '#00C853', label: 'Green' },
  { value: '#2979FF', label: 'Blue' },
  { value: '#FFD600', label: 'Yellow' },
  { value: '#FF9100', label: 'Orange' },
  // ...add more if needed
];

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
    textFieldInputSmall: {
      borderRadius: 2,
      fontSize: 16,
    },
    textFieldInputNumber: {
      borderRadius: 2,
    },
    colorContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
      mt: 2,
    },
    colorLabel: {
      minWidth: 60,
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
      position: 'relative' as const,
      overflow: 'hidden',
    },
    colorInput: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0,
      cursor: 'pointer',
      border: 'none',
      padding: 0,
      margin: 0,
    },
    colorArrow: {
      cursor: 'pointer',
      color: '#888',
    },
    colorDropdown: {
      position: 'absolute' as const,
      zIndex: 1301,
      mt: 5,
      ml: 2,
      bgcolor: '#fff',
      borderRadius: 2,
      boxShadow: 3,
      p: 1,
      minWidth: 120,
    },
    colorOption: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      px: 2,
      py: 1,
      cursor: 'pointer',
      borderRadius: 1,
      '&:hover': { background: '#f5f5f5' },
    },
    colorCircle: {
      width: 20,
      height: 20,
      borderRadius: '50%',
      border: '1px solid #ccc',
    },
    fieldsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 2,
      mt: 2,
    },
    fieldBox: {
      flex: '1 1 45%',
      minWidth: '0',
    },
    toggleContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 2,
      mt: 2,
    },
    toggleBox: {
      flex: '1 1 45%',
      minWidth: '0',
      mb: 1,
    },
    toggleInner: {
      display: 'flex',
      alignItems: 'center',
    },
    toggleLabel: {
      flex: 1,
    },
    switch: {
      width: 48,
      height: 28,
      p: 0,
      '& .MuiSwitch-switchBase': {
        p: 0.5,
        '&.Mui-checked': {
          transform: 'translateX(20px)',
          color: '#fff',
          '& + .MuiSwitch-track': {
            backgroundColor: '#00C853',
            opacity: 1,
          },
        },
      },
      '& .MuiSwitch-thumb': {
        width: 20,
        height: 20,
        boxShadow: 'none',
      },
      '& .MuiSwitch-track': {
        borderRadius: 14,
        backgroundColor: '#ccc',
        opacity: 1,
      },
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
  };

const SubscriptionFormDialog: React.FC<SubscriptionFormDialogProps> = ({
  open,
  formData,
  errors,
  onClose,
  onSubmit,
  onInputChange,
  editMode,
}) => {
  const { t } = useTranslation();
  
  const [colorMenuAnchor, setColorMenuAnchor] = React.useState<null | HTMLElement>(null);

  // Add a ref for the color dropdown
  const colorDropdownRef = React.useRef<HTMLDivElement>(null);

  // Close color dropdown when clicking outside
  React.useEffect(() => {
    if (!colorMenuAnchor) return;
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        colorDropdownRef.current &&
        !colorDropdownRef.current.contains(target) &&
        colorMenuAnchor &&
        !colorMenuAnchor.contains(target)
      ) {
        setColorMenuAnchor(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [colorMenuAnchor]);

  const handleArrowClick = (event: React.MouseEvent) => {
    // Find the nearest positioned ancestor element to use as anchor
    const target = event.currentTarget as Element;
    const parentElement = target.closest('div') || target.parentElement;
    setColorMenuAnchor(parentElement as HTMLElement);
  };
  const handleColorSelect = (color: string) => {
    onInputChange({
      target: { name: 'color', value: color, type: 'text' },
    } as React.ChangeEvent<HTMLInputElement>);
    setColorMenuAnchor(null);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          onClick={onClose}
          sx={styles.closeButton}
          size="large"
        >
          <DialogCloseIcon style={{ fontSize: 32 }} />
        </IconButton>
      </Box>
      <DialogTitle sx={styles.dialogTitle}>
        {editMode ? t('subscriptions.editSubscription') : t('subscriptions.addSubscription')}
      </DialogTitle>
      <DialogContent sx={styles.dialogContent}>
        {/* Title */}
        <TextField
          label={t('subscriptions.title')}
          name="title"
          value={formData.title}
          onChange={onInputChange}
          fullWidth
          margin="normal"
          error={!!errors.title}
          helperText={errors.title}
          InputProps={{ sx: styles.textFieldInput }}
        />
        {/* Description */}
        <TextField
          label={t('subscriptions.description')}
          name="description"
          value={formData.description}
          onChange={onInputChange}
          fullWidth
          margin="normal"
          multiline
          minRows={3}
          error={!!errors.description}
          helperText={errors.description}
          InputProps={{ sx: styles.textFieldInputSmall }}
        />
        {/* Color */}
        <Box sx={styles.colorContainer}>
          <Typography sx={styles.colorLabel}>{t('subscriptions.color')}:</Typography>
          <Box sx={{ ...styles.colorPicker, background: formData.color }}>
            <input
              type="color"
              value={formData.color}
              onChange={e => handleColorSelect(e.target.value)}
              style={styles.colorInput}
              tabIndex={-1}
            />
          </Box>
          <ArrowDropDown
            sx={styles.colorArrow}
            onClick={handleArrowClick}
          />
          {/* Color dropdown */}
          {Boolean(colorMenuAnchor) && (
            <Box ref={colorDropdownRef} sx={styles.colorDropdown}>
              {colorOptions.map((opt) => (
                <Box
                  key={opt.value}
                  sx={styles.colorOption}
                  onClick={() => handleColorSelect(opt.value)}
                >
                  <Box sx={{ ...styles.colorCircle, background: opt.value }} />
                  <Typography variant="body2">{opt.label}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
        <Box sx={styles.fieldsContainer}>
          <Box sx={styles.fieldBox}>
            <TextField
              label={t('subscriptions.duration')}
              name="duration"
              type="number"
              value={formData.duration}
              onChange={onInputChange}
              fullWidth
              margin="normal"
              InputProps={{
                sx: styles.textFieldInputNumber,
                endAdornment: <InputAdornment position="end">{t('subscriptions.days')}</InputAdornment>,
                inputProps: { min: 0, style: { textAlign: 'left' } },
              }}
            />
          </Box>
          <Box sx={styles.fieldBox}>
            <TextField
              label={t('subscriptions.monthlyChecks')}
              name="monthlyChecks"
              type="number"
              value={formData.monthlyChecks}
              onChange={onInputChange}
              fullWidth
              margin="normal"
              InputProps={{
                sx: styles.textFieldInputNumber,
                inputProps: { min: 0, style: { textAlign: 'left' } },
              }}
            />
          </Box>
          <Box sx={styles.fieldBox}>
            <TextField
              label={t('subscriptions.order')}
              name="order"
              type="number"
              value={formData.order}
              onChange={onInputChange}
              fullWidth
              margin="normal"
              error={!!errors.order}
              helperText={errors.order}
              InputProps={{
                sx: styles.textFieldInputNumber,
                inputProps: { min: 0, style: { textAlign: 'left' } },
              }}
            />
          </Box>
          <Box sx={styles.fieldBox}>
            <TextField
              label={t('subscriptions.price')}
              name="price"
              type="number"
              value={formData.price}
              onChange={onInputChange}
              fullWidth
              margin="normal"
              InputProps={{
                sx: styles.textFieldInputNumber,
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
                inputProps: { min: 0, style: { textAlign: 'left' } },
              }}
            />
          </Box>
        </Box>
        {/* Toggle fields: 2 per row, custom style */}
        <Box sx={styles.toggleContainer}>
          {[
            { label: t('subscriptions.vip'), name: 'vip', checked: formData.vip },
            { label: t('subscriptions.chat'), name: 'chat', checked: formData.chat },
            { label: t('subscriptions.trainingCard'), name: 'trainingCard', checked: formData.trainingCard },
            { label: t('subscriptions.integrationPlan'), name: 'integrationPlan', checked: formData.integrationPlan },
            { label: t('subscriptions.mealPlan'), name: 'mealPlan', checked: formData.mealPlan },
            { label: t('subscriptions.freeIntroCall'), name: 'freeIntroductoryCall', checked: formData.freeIntroductoryCall },
          ].map((toggle) => (
            <Box key={toggle.name} sx={styles.toggleBox}>
              <Box sx={styles.toggleInner}>
                <Typography sx={styles.toggleLabel}>{toggle.label}</Typography>
                <Switch
                  checked={toggle.checked}
                  onChange={onInputChange}
                  name={toggle.name}
                  color="primary"
                  sx={styles.switch}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={styles.dialogActions}>
        <Button
          onClick={onSubmit}
          variant="contained"
          fullWidth
          sx={styles.submitButton}
        >
          {t('subscriptions.save') || 'Salva'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubscriptionFormDialog;
