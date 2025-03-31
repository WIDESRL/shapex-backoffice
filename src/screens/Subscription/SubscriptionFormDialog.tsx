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
  Checkbox,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Subscription } from '../../Context/SubscriptionsContext';

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
  editMode: boolean; // New prop
}

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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {editMode ? t('subscriptions.editSubscription') : t('subscriptions.addSubscription')}
        <IconButton onClick={onClose} color="secondary" size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          label={t('subscriptions.title')}
          name="title"
          value={formData.title}
          onChange={onInputChange}
          fullWidth
          margin="normal"
          error={!!errors.title}
          helperText={errors.title}
        />
        <TextField
          label={t('subscriptions.description')}
          name="description"
          value={formData.description}
          onChange={onInputChange}
          fullWidth
          margin="normal"
          error={!!errors.description}
          helperText={errors.description}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
          <Typography>{t('subscriptions.color')}:</Typography>
          <input
            type="color"
            name="color"
            value={formData.color}
            onChange={onInputChange}
            style={{ border: 'none', background: 'none', cursor: 'pointer' }}
          />
        </Box>
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel htmlFor="duration">{t('subscriptions.duration')}</InputLabel>
          <OutlinedInput
            id="duration"
            name="duration"
            type="number"
            label={t('subscriptions.duration')}
            value={formData.duration}
            onChange={onInputChange}
            endAdornment={<InputAdornment position="end">{t('subscriptions.days')}</InputAdornment>}
          />
        </FormControl>
        <TextField
          label={t('subscriptions.monthlyChecks')}
          name="monthlyChecks"
          type="number"
          value={formData.monthlyChecks}
          onChange={onInputChange}
          fullWidth
          margin="normal"
        />
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
        />
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel htmlFor="price">{t('subscriptions.price')}</InputLabel>
          <OutlinedInput
            id="price"
            name="price"
            type="number"
            label={t('subscriptions.price')}
            value={formData.price}
            onChange={onInputChange}
            startAdornment={<InputAdornment position="start">€</InputAdornment>}
          />
        </FormControl>
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, cursor: 'pointer' }}
            onClick={() =>
              onInputChange({
                target: { name: 'chat', type: 'checkbox', checked: !formData.chat },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          >
            <Checkbox
              checked={formData.chat}
              // Removed onChange and name
            />
            <Typography>{t('subscriptions.chat')}</Typography>
          </Box>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, cursor: 'pointer' }}
            onClick={() =>
              onInputChange({
                target: { name: 'freeIntroductoryCall', type: 'checkbox', checked: !formData.freeIntroductoryCall },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          >
            <Checkbox
              checked={formData.freeIntroductoryCall}
              // Removed onChange and name
            />
            <Typography>{t('subscriptions.freeIntroCall')}</Typography>
          </Box>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, cursor: 'pointer' }}
            onClick={() =>
              onInputChange({
                target: { name: 'mealPlan', type: 'checkbox', checked: !formData.mealPlan },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          >
            <Checkbox checked={formData.mealPlan} />
            <Typography>{t('subscriptions.mealPlan')}</Typography>
          </Box>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, cursor: 'pointer' }}
            onClick={() =>
              onInputChange({
                target: { name: 'integrationPlan', type: 'checkbox', checked: !formData.integrationPlan },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          >
            <Checkbox checked={formData.integrationPlan} />
            <Typography>{t('subscriptions.integrationPlan')}</Typography>
          </Box>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, cursor: 'pointer' }}
            onClick={() =>
              onInputChange({
                target: { name: 'trainingCard', type: 'checkbox', checked: !formData.trainingCard },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          >
            <Checkbox checked={formData.trainingCard} />
            <Typography>{t('subscriptions.trainingCard')}</Typography>
          </Box>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, cursor: 'pointer' }}
            onClick={() =>
              onInputChange({
                target: { name: 'vip', type: 'checkbox', checked: !formData.vip },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          >
            <Checkbox checked={formData.vip} />
            <Typography>{t('subscriptions.vip')}</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {t('subscriptions.cancel')}
        </Button>
        <Button onClick={onSubmit} color="primary">
          {editMode ? t('subscriptions.update') : t('subscriptions.add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubscriptionFormDialog;
