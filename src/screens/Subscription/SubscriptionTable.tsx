import React from 'react';
import { Box, IconButton } from '@mui/material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import { Edit, Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Subscription } from '../../Context/SubscriptionsContext';

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  isLoading: boolean;
  sortModel: GridSortModel;
  onSortModelChange: (newSortModel: GridSortModel) => void;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: number) => void;
}

const SubscriptionTable: React.FC<SubscriptionTableProps> = ({
  subscriptions,
  isLoading,
  sortModel,
  onSortModelChange,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  const columns: GridColDef[] = [
    { field: 'title', headerName: t('subscriptions.title'), width: 200 },
    { field: 'description', headerName: t('subscriptions.description'), width: 200 },
    {
      field: 'color',
      headerName: t('subscriptions.color'),
      width: 70,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <Box
            sx={{
              width: 20,
              height: 20,
              backgroundColor: params.value,
              borderRadius: '50%',
            }}
          />
        </Box>
      ),
    },
    { field: 'duration', headerName: t('subscriptions.duration'), width: 150 },
    { field: 'monthlyChecks', headerName: t('subscriptions.monthlyChecks'), width: 150 },
    {
      field: 'price',
      headerName: t('subscriptions.price'),
      width: 100,
      renderCell: (params) => `€ ${params.value}`,
    },
    {
      field: 'chat',
      headerName: t('subscriptions.chat'),
      width: 120,
      renderCell: (params) => (params.value ? t('subscriptions.yes') : t('subscriptions.no')),
    },
    {
      field: 'freeIntroductoryCall',
      headerName: t('subscriptions.freeIntroCall'),
      width: 180,
      renderCell: (params) => (params.value ? t('subscriptions.yes') : t('subscriptions.no')),
    },
    {
      field: 'mealPlan',
      headerName: t('subscriptions.mealPlan'),
      width: 150,
      renderCell: (params) => (params.value ? t('subscriptions.yes') : t('subscriptions.no')),
    },
    {
      field: 'integrationPlan',
      headerName: t('subscriptions.integrationPlan'),
      width: 180,
      renderCell: (params) => (params.value ? t('subscriptions.yes') : t('subscriptions.no')),
    },
    {
      field: 'trainingCard',
      headerName: t('subscriptions.trainingCard'),
      width: 150,
      renderCell: (params) => (params.value ? t('subscriptions.yes') : t('subscriptions.no')),
    },
    {
      field: 'vip',
      headerName: t('subscriptions.vip'),
      width: 100,
      renderCell: (params) => (params.value ? t('subscriptions.yes') : t('subscriptions.no')),
    },
    {
      field: 'createdAt',
      headerName: t('subscriptions.createdAt'),
      width: 200,
      renderCell: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: 'updatedAt',
      headerName: t('subscriptions.updatedAt'),
      width: 200,
      renderCell: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: 'actions',
      headerName: t('subscriptions.actions'),
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => onEdit(params.row)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => onDelete(params.row.id)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={subscriptions}
        columns={columns}
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        autoHeight={true}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        loading={isLoading}
        onRowDoubleClick={({row}) => onEdit(row)}
      />
      {/* )} */}
    </Box>
  );
};

export default SubscriptionTable;
