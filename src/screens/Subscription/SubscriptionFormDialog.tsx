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
    titleApp: string;
    description: string;
    duration: string;
    order: string;
    price: string;
    discountPrice: string;
  };
  onClose: () => void;
  onSubmit: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editMode: boolean;
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

  // Color options with translations
  const colorOptions = [
    { value: '#FF0000', label: t('subscriptions.colors.red') },
    { value: '#00C853', label: t('subscriptions.colors.green') },
    { value: '#2979FF', label: t('subscriptions.colors.blue') },
    { value: '#FFD600', label: t('subscriptions.colors.yellow') },
    { value: '#FF9100', label: t('subscriptions.colors.orange') },
  ];

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

  // Handle price change with validation
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (parseFloat(value) > 0)) {
      onInputChange(e);
    }
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
        {/* Title App */}
        <TextField
          label={t('subscriptions.titleApp')}
          name="titleApp"
          select
          value={['Silver', 'Bronze', 'Gold'].includes(formData.titleApp || '') ? formData.titleApp : 'Other'}
          onChange={(e) => {
            if (e.target.value === 'Other') {
              onInputChange({
                target: { name: 'titleApp', value: '', type: 'text' }
              } as React.ChangeEvent<HTMLInputElement>);
            } else {
              onInputChange({
                target: { name: 'titleApp', value: e.target.value, type: 'text' }
              } as React.ChangeEvent<HTMLInputElement>);
            }
          }}
          fullWidth
          margin="normal"
          error={!!errors.titleApp}
          helperText={errors.titleApp}
          SelectProps={{
            native: true,
          }}
          InputProps={{ sx: styles.textFieldInput }}
        >
          <option value="Silver">Silver</option>
          <option value="Bronze">Bronze</option>
          <option value="Gold">Gold</option>
          <option value="Other">{t('common.other') || 'Other'}</option>
        </TextField>
        
        {/* Custom Title App input - shown when "Other" is selected */}
        {!['Silver', 'Bronze', 'Gold'].includes(formData.titleApp || '') && (
          <TextField
            label={t('subscriptions.customTitleApp') || 'Custom Title App'}
            name="titleApp"
            value={formData.titleApp || ''}
            onChange={onInputChange}
            fullWidth
            margin="normal"
            error={!!errors.titleApp}
            helperText={errors.titleApp}
            placeholder={t('subscriptions.enterCustomTitle') || 'Enter custom title...'}
            InputProps={{ sx: styles.textFieldInput }}
          />
        )}
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
        
        {/* Row with Order and Color */}
        <Box sx={styles.fieldsContainer}>
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
            {/* Color */}
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ mb: 1, fontSize: 16, color: '#666' }}>
                {t('subscriptions.color')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
            </Box>
          </Box>
        </Box>
        
        {/* Duration and Monthly Checks row */}
        <Box sx={styles.fieldsContainer}>
          <Box sx={styles.fieldBox}>
            <TextField
              label={t('subscriptions.duration')}
              name="duration"
              select
              value={formData.duration}
              onChange={onInputChange}
              fullWidth
              margin="normal"
              SelectProps={{
                native: true,
              }}
              InputProps={{
                sx: styles.textFieldInputNumber,
              }}
            >
              <option value={30}>30 {t('subscriptions.days')}</option>
              <option value={60}>60 {t('subscriptions.days')}</option>
              <option value={90}>90 {t('subscriptions.days')}</option>
              <option value={180}>180 {t('subscriptions.days')}</option>
              <option value={365}>365 {t('subscriptions.days')}</option>
            </TextField>
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
        </Box>
        
        {/* Price and Discount Price row */}
        <Box sx={styles.fieldsContainer}>
          <Box sx={styles.fieldBox}>
            <TextField
              label={t('subscriptions.price')}
              name="price"
              type="number"
              value={formData.price}
              onChange={handlePriceChange}
              fullWidth
              margin="normal"
              error={!!errors.price}
              helperText={errors.price}
              InputProps={{
                sx: styles.textFieldInputNumber,
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
                inputProps: { min: 1, step: 1, style: { textAlign: 'left' } },
              }}
            />
          </Box>
          <Box sx={styles.fieldBox}>
            <TextField
              label={t('subscriptions.discountPrice')}
              name="discountPrice"
              type="number"
              value={formData.discountPrice || ''}
              onChange={onInputChange}
              fullWidth
              margin="normal"
              error={!!errors.discountPrice}
              helperText={errors.discountPrice}
              InputProps={{
                sx: styles.textFieldInputNumber,
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
                inputProps: { min: 0, step: 1, style: { textAlign: 'left' } },
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
            { label: t('subscriptions.freeIntroCall'), name: 'freeIntroductoryCall', checked: formData.freeIntroductoryCall, title: t('subscriptions.freeIntroCallTooltip') },
          ].map((toggle) => (
            <Box key={toggle.name} sx={styles.toggleBox} title={toggle.title}>
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

        {/* Row 1: Visible in Frontend + Monthly Recurring */}
        <Box sx={{ display: 'flex', gap: 4, mt: 3 }}>
          <Box sx={{ ...styles.toggleBox, flex: 1 }}>
            <Box sx={styles.toggleInner}>
              <Typography sx={styles.toggleLabel}>
                {t('subscriptions.visibleInFrontend')}
              </Typography>
              <Switch
                checked={formData.visibleInFrontend}
                onChange={onInputChange}
                name="visibleInFrontend"
                color="primary"
                sx={styles.switch}
              />
            </Box>
          </Box>
          <Box sx={{ ...styles.toggleBox, flex: 1 }}>
            <Box sx={styles.toggleInner}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={styles.toggleLabel}>
                  {t('subscriptions.monthlyRecurring')}
                </Typography>
              </Box>
              <Switch
                checked={formData.recurringMonthlyPayment}
                onChange={onInputChange}
                name="recurringMonthlyPayment"
                color="primary"
                sx={styles.switch}
              />
            </Box>
          </Box>
        </Box>

        {/* Row 2: Supplementary Calls + Number of Supplementary Calls */}
        <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
          <Box sx={{ ...styles.toggleBox, flex: 1 }}>
            <Box sx={styles.toggleInner}>
              <Typography sx={styles.toggleLabel}>
                {t('subscriptions.supplementaryCalls')}
              </Typography>
              <Switch
                checked={formData.supplementaryCalls}
                onChange={onInputChange}
                name="supplementaryCalls"
                color="primary"
                sx={styles.switch}
              />
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <TextField
              label={t('subscriptions.numberOfSupplementaryCalls')}
              name="numberOfSupplementaryCalls"
              type="number"
              value={formData.numberOfSupplementaryCalls || 0}
              onChange={onInputChange}
              fullWidth
              margin="normal"
              disabled={!formData.supplementaryCalls}
              InputProps={{
                sx: styles.textFieldInputNumber,
                inputProps: { min: 0, style: { textAlign: 'left' } },
              }}
            />
          </Box>
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
