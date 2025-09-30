import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Pagination,
  Divider,
  TextField,
  Stack,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useProducts, Order } from '../../Context/ProductsContext';
import DateRangePicker from '../../components/DateRangePicker';

const OrdersScreen: React.FC = () => {
  const { t } = useTranslation();
  const {
    orders,
    ordersPagination,
    isLoadingOrders,
    fetchOrders,
    ordersFilters,
    setOrdersFilters,
  } = useProducts();

  console.log('OrdersScreen mounted/rendered');
  console.log('Orders from context:', orders);
  console.log('IsLoadingOrders:', isLoadingOrders);

  // Local state for search input
  const [searchQuery, setSearchQuery] = useState(ordersFilters.search || '');

  // Fetch orders when component mounts
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setOrdersFilters({ page: 1, search: searchQuery });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, setOrdersFilters]);

  // Debug logging
  useEffect(() => {
    console.log('Orders screen - orders:', orders);
    console.log('Orders screen - orders.length:', orders.length);
    console.log('Orders screen - isLoadingOrders:', isLoadingOrders);
    console.log('Orders screen - ordersPagination:', ordersPagination);
  }, [orders, isLoadingOrders, ordersPagination]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setOrdersFilters({ page });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'completed':
      case 'paid':
        return 'success';
      case 'cancelled':
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const renderOrderCard = (order: Order) => (
    <Card key={order.id} sx={{ mb: 2, boxShadow: 2 }}>
      <CardContent>
        {/* Order Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h3">
            {t('orders.orderNumber')}: #{order.id}
          </Typography>
          <Chip 
            label={order.status.toUpperCase()} 
            color={getStatusColor(order.status)}
            size="small"
          />
        </Box>

        {/* Order Details */}
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2} mb={2}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {t('orders.totalAmount')}:
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              €{order.totalAmount.toFixed(2)}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">
              {t('orders.createdAt')}:
            </Typography>
            <Typography variant="body1">
              {formatDate(order.createdAt)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              {t('orders.customer')}:
            </Typography>
            <Typography variant="body1">
              {order.user.firstName} {order.user.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.user.email}
            </Typography>
          </Box>

          {order.paidAt && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('orders.paidAt')}:
              </Typography>
              <Typography variant="body1">
                {formatDate(order.paidAt)}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Order Items */}
        <Typography variant="subtitle1" gutterBottom>
          {t('orders.items')}:
        </Typography>
        
        {order.items.map((item) => (
          <Box 
            key={item.id} 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center"
            py={1}
            sx={{ 
              borderBottom: '1px solid #f0f0f0',
              '&:last-child': { borderBottom: 'none' }
            }}
          >
            <Box flex={1}>
              <Typography variant="body1" fontWeight="medium">
                {item.product.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.product.type.name} • {t('orders.quantity')}: {item.quantity}
              </Typography>
            </Box>
            
            <Box textAlign="right">
              <Typography variant="body1" fontWeight="bold">
                €{item.totalPrice.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                €{item.unitPrice.toFixed(2)} {t('orders.each')}
              </Typography>
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <Box p={3}>
      {/* Header */}
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontSize: 38,
          fontWeight: 400,
          color: '#616160',
          fontFamily: 'Montserrat, sans-serif',
        }}
      >
        {t('orders.title')}
      </Typography>

      {/* Filters Section */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h6">{t('orders.filters')}</Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label={t('orders.searchPlaceholder')}
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              sx={{ minWidth: 250 }}
            />
            <DateRangePicker
              value={{
                startDate: ordersFilters.startDate ? new Date(ordersFilters.startDate + 'T00:00:00') : null,
                endDate: ordersFilters.endDate ? new Date(ordersFilters.endDate + 'T00:00:00') : null,
              }}
              onChange={(dateRange) => {
                const formatDateToLocal = (date: Date): string => {
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  return `${year}-${month}-${day}`;
                };

                setOrdersFilters({ 
                  ...ordersFilters, 
                  page: 1, 
                  startDate: dateRange.startDate ? formatDateToLocal(dateRange.startDate) : undefined,
                  endDate: dateRange.endDate ? formatDateToLocal(dateRange.endDate) : undefined,
                });
              }}
              placeholder={t('orders.dateRange')}
            />
          </Stack>
        </Stack>
      </Card>

      {/* Orders List */}
      {isLoadingOrders ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : orders.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          {t('orders.noOrders')}
        </Alert>
      ) : (
        <Box>
          {orders.map(renderOrderCard)}
          
          {/* Pagination */}
          {ordersPagination && ordersPagination.totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={ordersPagination.totalPages}
                page={ordersFilters.page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default OrdersScreen;