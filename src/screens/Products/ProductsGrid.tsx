import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Product } from '../../Context/ProductsContext';
import DeleteConfirmationDialog from '../Subscription/DeleteConfirmationDialog';
import { useProducts } from '../../Context/ProductsContext';
import { useState } from 'react';

interface ProductsGridProps {
  products: Product[];
  onEdit: (product: Product) => void;
  loading?: boolean;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({ products, onEdit, loading = false }) => {
  const { t } = useTranslation();
  const { removeProduct } = useProducts();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      await removeProduct(productToDelete.id);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  if (loading && products.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
        gap={3}
      >
        {products.map((product) => (
          <Card
            key={product.id}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              '&:hover': {
                boxShadow: (theme) => theme.shadows[8],
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                <Typography variant="h6" component="h3" noWrap sx={{ maxWidth: '70%' }}>
                  {product.title}
                </Typography>
                {product.type && (
                  <Chip 
                    label={product.type.name} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                )}
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  mb: 2,
                  minHeight: '3em',
                }}
              >
                {product.description}
              </Typography>
              <Typography variant="h6" color="primary" fontWeight="bold">
                €{product.price.toFixed(2)}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
              <Button
                size="small"
                startIcon={<EditIcon />}
                onClick={() => onEdit(product)}
                sx={{ textTransform: 'none' }}
              >
                {t('common.edit')}
              </Button>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeleteClick(product)}
                sx={{ ml: 1 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={t('products.confirmDeletion')}
        description={t('products.deletionIrreversible')}
      />
    </>
  );
};

export default ProductsGrid;