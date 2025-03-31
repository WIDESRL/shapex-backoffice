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
}

const SubscriptionFormDialog: React.FC<SubscriptionFormDialogProps> = ({
  open,
  formData,
  errors,
  onClose,
  onSubmit,
  onInputChange,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {t('subscriptions.addSubscription')}
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
        <TextField
          label={t('subscriptions.duration')}
          name="duration"
          type="number"
          value={formData.duration}
          onChange={onInputChange}
          fullWidth
          margin="normal"
          error={!!errors.duration}
          helperText={errors.duration}
        />
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
                target: { name: 'supplementPlan', type: 'checkbox', checked: !formData.supplementPlan },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          >
            <Checkbox checked={formData.supplementPlan} />
            <Typography>{t('subscriptions.supplementPlan')}</Typography>
          </Box>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, cursor: 'pointer' }}
            onClick={() =>
              onInputChange({
                target: { name: 'workoutPlan', type: 'checkbox', checked: !formData.workoutPlan },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          >
            <Checkbox checked={formData.workoutPlan} />
            <Typography>{t('subscriptions.workoutPlan')}</Typography>
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
          {t('subscriptions.add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubscriptionFormDialog;
