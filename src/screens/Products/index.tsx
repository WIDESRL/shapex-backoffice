import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Chip,
  Stack,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useProducts, Product } from '../../Context/ProductsContext';
import ProductCardsGrid from './ProductCardsGrid';
import ProductFormDialog from './ProductFormDialog';
import DeleteConfirmationDialog from '../Subscription/DeleteConfirmationDialog';

const ProductsScreen: React.FC = () => {
  const { t } = useTranslation();
  const {
    products,
    pagination,
    isLoadingProducts,
    fetchProducts,
    productTypes,
    isLoadingProductTypes,
    fetchProductTypes,
    productsFilters,
    setProductsFilters,
    removeProduct,
  } = useProducts();
  
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const hasInitiallyLoaded = useRef(false);

  // Load data when component mounts
  useEffect(() => {
    fetchProducts();
    fetchProductTypes();
    hasInitiallyLoaded.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setProductsFilters({ page: 1, search: searchQuery });
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]); // Only depend on searchQuery, not setProductsFilters

  // React Query automatically refetches when productsFilters change (no manual refetch needed)

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormDialogOpen(true);
  };

  const handleDeleteProduct = (id: number) => {
    setProductToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (productToDelete) {
      try {
        await removeProduct(productToDelete);
        setDeleteConfirmOpen(false);
        setProductToDelete(null);
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const cancelDeleteProduct = () => {
    setDeleteConfirmOpen(false);
    setProductToDelete(null);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setProductsFilters({ page });
  };

  const handleTypeFilterChange = (typeId: number | undefined) => {
    setProductsFilters({ page: 1, typeId });
  };

  const handleLimitChange = (limit: number) => {
    setProductsFilters({ page: 1, limit });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  if (isLoadingProducts && products.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography
          sx={{
            fontSize: 38,
            fontWeight: 400,
            color: '#616160',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          {t('products.title')}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Add sx={{ fontSize: 20 }} />}
          onClick={handleAddProduct}
          sx={{
            borderColor: '#ccc',
            color: '#666',
            borderRadius: 1,
            fontWeight: 400,
            fontSize: 14,
            px: 2,
            py: 1,
            textTransform: 'none',
            fontFamily: 'Montserrat, sans-serif',
            '&:hover': { 
              borderColor: '#999',
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          {t('products.addProduct')}
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
            {/* Search Field */}
            <Box minWidth={300}>
              <TextField
                fullWidth
                size="small"
                label={t('products.searchProducts')}
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={t('products.searchPlaceholder')}
              />
            </Box>
            
            {/* Type Filter */}
            <Box minWidth={200}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('products.filterByType')}</InputLabel>
                <Select
                  value={productsFilters.typeId || ''}
                  onChange={(e) => handleTypeFilterChange(e.target.value ? Number(e.target.value) : undefined)}
                  label={t('products.filterByType')}
                  disabled={isLoadingProductTypes}
                >
                  <MenuItem value="">
                    <em>{t('products.allTypes')}</em>
                  </MenuItem>
                  {isLoadingProductTypes ? (
                    <MenuItem disabled>
                      <em>{t('common.loading')}</em>
                    </MenuItem>
                  ) : (
                    productTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Box>
            
            {/* Items Per Page */}
            <Box minWidth={150}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('common.itemsPerPage')}</InputLabel>
                <Select
                  value={productsFilters.limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  label={t('common.itemsPerPage')}
                >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                  <MenuItem value={500}>500</MenuItem>
                  <MenuItem value={1000}>1000</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            {/* Active Filters */}
            <Box flex={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                {productsFilters.typeId && (
                  <Chip
                    label={`${t('products.filterByType')}: ${productTypes.find(type => type.id === productsFilters.typeId)?.name}`}
                    onDelete={() => handleTypeFilterChange(undefined)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {searchQuery && (
                  <Chip
                    label={`${t('products.search')}: ${searchQuery}`}
                    onDelete={() => setSearchQuery('')}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Stack>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {products.length === 0 && !isLoadingProducts ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          {productsFilters.typeId || searchQuery
            ? t('products.noProductsForType') 
            : t('products.noProducts')
          }
        </Alert>
      ) : (
        <>
          <ProductCardsGrid
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
          
          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}

      {/* Form Dialog */}
      <ProductFormDialog
        open={isFormDialogOpen}
        onClose={() => setIsFormDialogOpen(false)}
        product={editingProduct}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteConfirmOpen}
        onClose={cancelDeleteProduct}
        onConfirm={confirmDeleteProduct}
        title={t('products.confirmDeletion')}
        description={t('products.deletionIrreversible')}
      />
    </Box>
  );
};

export default ProductsScreen;