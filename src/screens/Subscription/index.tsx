import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useSubscriptions, Subscription } from '../../Context/SubscriptionsContext';
import SubscriptionTable from './SubscriptionTable';
import SubscriptionFormDialog from './SubscriptionFormDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { useTranslation } from 'react-i18next';
import { GridSortModel } from '@mui/x-data-grid';

const SORT_LOCAL_STORAGE_KEY = 'subscriptionsSortModel';

const SubscriptionsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { subscriptions, isLoading, addSubscription, updateSubscription, removeSubscription } = useSubscriptions();
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
  const [sortModel, setSortModel] = useState(() => {
    const savedSortModel = localStorage.getItem(SORT_LOCAL_STORAGE_KEY);
    return savedSortModel ? JSON.parse(savedSortModel) : [];
  });

  const handleSortModelChange = (newSortModel: GridSortModel) => {
    setSortModel(newSortModel);
    localStorage.setItem(SORT_LOCAL_STORAGE_KEY, JSON.stringify(newSortModel));
  };

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
        width: '80%',
        maxWidth: 'none',
        boxSizing: 'border-box',
      }}
    >
      <Typography variant="h4" gutterBottom>
        {t('subscriptions.manageSubscriptions')}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => handleOpenForm()}
        sx={{ mb: 2 }}
      >
        {t('subscriptions.addSubscription')}
      </Button>
      <SubscriptionTable
        subscriptions={subscriptions}
        isLoading={isLoading}
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
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
