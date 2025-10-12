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
      case 'succeeded':
        return 'success';
      case 'cancelled':
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const renderOrderCard = (order: Order) => (
    <Card 
      key={order.id} 
      sx={{ 
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid #f0f0f0',
        transition: 'all 0.2s ease',
        height: 'fit-content',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          transform: 'translateY(-1px)',
        }
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {/* Order Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: 16 }}>
            {t('orders.orderNumber')}: #{order.id}
          </Typography>
          <Chip 
            label={order.status.toUpperCase()} 
            color={getStatusColor(order.status)}
            size="small"
            sx={{ fontWeight: 600, fontSize: 10, height: 22 }}
          />
        </Box>

        {/* Order Details */}
        <Box display="grid" gridTemplateColumns="1fr" gap={1} mb={1.5}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 11, fontWeight: 500 }}>
              {t('orders.totalAmount')}:
            </Typography>
            <Typography variant="body1" fontWeight="bold" sx={{ fontSize: 14, color: '#2e7d32' }}>
              €{order.totalAmount.toFixed(2)}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 11, fontWeight: 500 }}>
              {t('orders.createdAt')}:
            </Typography>
            <Typography variant="body1" sx={{ fontSize: 12 }}>
              {formatDate(order.createdAt)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 11, fontWeight: 500 }}>
              {t('orders.customer')}:
            </Typography>
            <Typography variant="body1" sx={{ fontSize: 12, fontWeight: 500 }}>
              {order.user.firstName} {order.user.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 10 }}>
              {order.user.email}
            </Typography>
          </Box>

          {order.paidAt && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 11, fontWeight: 500 }}>
                {t('orders.paidAt')}:
              </Typography>
              <Typography variant="body1" sx={{ fontSize: 12 }}>
                {formatDate(order.paidAt)}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Order Items */}
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 1, fontSize: 12 }}>
          {t('orders.items')}:
        </Typography>
        
        <Box sx={{ backgroundColor: '#fafafa', borderRadius: 1.5, p: 1.5, mb: 1.5 }}>
          {order.items.map((item, index) => (
            <Box 
              key={item.id} 
              display="flex" 
              justifyContent="space-between" 
              alignItems="center"
              py={0.5}
              sx={{ 
                borderBottom: index < order.items.length - 1 ? '1px solid #e0e0e0' : 'none',
              }}
            >
              <Box flex={1}>
                <Typography variant="body2" fontWeight="medium" sx={{ fontSize: 12 }}>
                  {item.product.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 10 }}>
                  {item.product.type.name} • {t('orders.quantity')}: {item.quantity}
                </Typography>
              </Box>
              
              <Box textAlign="right">
                <Typography variant="body1" fontWeight="bold" sx={{ fontSize: 12, color: '#2e7d32' }}>
                  €{item.totalPrice.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 10 }}>
                  €{item.unitPrice.toFixed(2)} {t('orders.each')}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Stripe Payment Data */}
        {order.stripePaymentData && (
          <Box sx={{ backgroundColor: '#f8f9fa', borderRadius: 1.5, p: 1.5 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#1976d2', mb: 1, fontSize: 11 }}>
              {t('orders.stripePayment')}:
            </Typography>
            <Box display="grid" gridTemplateColumns="1fr" gap={0.5}>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 10, fontWeight: 500 }}>
                  {t('orders.paymentId')}:
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 9, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {order.stripePaymentData.id}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 10, fontWeight: 500 }}>
                    {t('orders.paymentAmount')}:
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: 11, fontWeight: 600, color: '#2e7d32' }}>
                    {formatCurrency(order.stripePaymentData.amount, order.stripePaymentData.currency)}
                  </Typography>
                </Box>
                <Chip 
                  label={order.stripePaymentData.status.toUpperCase()} 
                  color={getStatusColor(order.stripePaymentData.status)}
                  size="small"
                  sx={{ 
                    fontSize: 10, 
                    height: 26, 
                    fontWeight: 600,
                    px: 1,
                    py: 0.5
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}
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
          {/* Orders Grid */}
          <Box 
            display="grid" 
            gridTemplateColumns={{ 
              xs: '1fr', 
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
              xl: 'repeat(4, 1fr)'
            }} 
            gap={3}
            mb={3}
          >
            {orders.map(renderOrderCard)}
          </Box>
          
          {/* Pagination */}
          {ordersPagination && ordersPagination.totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={ordersPagination.totalPages}
                page={ordersFilters.page}
                onChange={handlePageChange}
                color="primary"
                sx={{
                  '& .Mui-selected': {
                    backgroundColor: '#E6BB4A !important',
                    color: '#fff',
                  },
                }}
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