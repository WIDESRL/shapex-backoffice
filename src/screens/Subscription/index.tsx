import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useSubscriptions, Subscription } from '../../Context/SubscriptionsContext';
import SubscriptionCardsGrid from './SubscriptionCardsGrid';
import SubscriptionFormDialog from './SubscriptionFormDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { useTranslation } from 'react-i18next';

const SubscriptionsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { subscriptions, addSubscription, updateSubscription, removeSubscription } = useSubscriptions();
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState<Omit<Subscription, 'id'>>({
    title: '',
    description: '',
    color: '#FF0000',
    duration: 1,
    monthlyChecks: 0,
    order: 1,
    chat: false,
    freeIntroductoryCall: false,
    mealPlan: false,
    integrationPlan: false,
    trainingCard: false,
    vip: false,
    price: 0,
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    duration: '',
    order: '',
  });

  const handleOpenForm = (subscription?: Subscription) => {
    if (subscription) {
      setFormData(subscription);
      setEditMode(true);
      setSelectedId(subscription.id);
    } else {
      setFormData({
        title: '',
        description: '',
        color: '#FF0000',
        duration: 1,
        monthlyChecks: 0,
        order: 1,
        chat: false,
        freeIntroductoryCall: false,
        mealPlan: false,
        integrationPlan: false,
        trainingCard: false,
        vip: false,
        price: 0,
      });
      setEditMode(false);
      setSelectedId(null);
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setErrors({ title: '', description: '', duration: '', order: '' });
  };

  const handleFormSubmit = async () => {
    const newErrors = {
      title: formData.title.trim() ? '' : t('subscriptions.validation.titleRequired'),
      description: formData.description.trim() ? '' : t('subscriptions.validation.descriptionRequired'),
      duration: formData.duration > 0 ? '' : t('subscriptions.validation.durationPositive'),
      order: formData.order > 0 ? '' : t('subscriptions.validation.orderPositive'),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    if (editMode && selectedId !== null) {
      await updateSubscription({ ...formData, id: selectedId });
    } else {
      await addSubscription(formData);
    }
    setOpenForm(false);
  };

  const handleOpenDeleteConfirm = (id: number) => {
    setSelectedId(id);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setSelectedId(null);
  };

  const handleDelete = async () => {
    if (selectedId !== null) {
      await removeSubscription(String(selectedId));
    }
    setOpenDeleteConfirm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <Box
      sx={{
        p: 3,
        width: '100%',
        maxWidth: 'none',
        boxSizing: 'border-box',
      }}
    >
      <Typography
        sx={{
          fontSize: 38,
          fontWeight: 400,
          color: '#616160',
          fontFamily: 'Montserrat, sans-serif',
          mb: 2,
        }}
      >
        {t('subscriptions.manageSubscriptions')}
      </Typography>
      <Button
        variant="contained"
        startIcon={<Add sx={{ fontSize: 28 }} />}
        onClick={() => handleOpenForm()}
        sx={{
          background: '#E6BB4A',
          color: '#fff',
          borderRadius: 2,
          fontWeight: 500,
          fontSize: 20,
          px: 3.5,
          py: 1.2,
          minWidth: 180,
          boxShadow: 0,
          textTransform: 'none',
          fontFamily: 'Montserrat, sans-serif',
          mb: 4,
          '&:hover': { background: '#d1a53d' },
        }}
      >
        {t('subscriptions.addSubscription')}
      </Button>
      <SubscriptionCardsGrid
        subscriptions={subscriptions}
        onEdit={handleOpenForm}
        onDelete={handleOpenDeleteConfirm}
      />
      <SubscriptionFormDialog
        open={openForm}
        formData={formData}
        errors={errors}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        onInputChange={handleInputChange}
        editMode={editMode}
      />
      <DeleteConfirmationDialog
        open={openDeleteConfirm}
        onClose={handleCloseDeleteConfirm}
        onConfirm={handleDelete}
      />
    </Box>
  );
};

export default SubscriptionsScreen;
