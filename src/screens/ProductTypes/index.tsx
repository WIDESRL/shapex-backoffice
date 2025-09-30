import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useProducts } from '../../Context/ProductsContext';
import ProductTypesGrid from './ProductTypesGrid';
import ProductTypeFormDialog from './ProductTypeFormDialog';
import DeleteConfirmationDialog from '../Subscription/DeleteConfirmationDialog';
import { ProductType } from '../../Context/ProductsContext';

const ProductTypesScreen: React.FC = () => {
  const { t } = useTranslation();
  const { 
    productTypes, 
    isLoadingProductTypes,
    fetchProductTypes,
    addProductType, 
    updateProductType, 
    removeProductType 
  } = useProducts();
  
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState<Omit<ProductType, 'id'>>({
    name: '',
    description: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [errors, setErrors] = useState({
    name: '',
    description: '',
  });

  // Load product types when component mounts
  useEffect(() => {
    fetchProductTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  const handleOpenForm = (productType?: ProductType) => {
    if (productType) {
      setFormData(productType);
      setEditMode(true);
      setSelectedId(productType.id);
    } else {
      setFormData({
        name: '',
        description: '',
      });
      setEditMode(false);
      setSelectedId(null);
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setErrors({ name: '', description: '' });
  };

  const handleFormSubmit = async () => {
    const newErrors = {
      name: formData.name.trim() ? '' : t('products.types.validation.nameRequired'),
      description: formData.description.trim() ? '' : t('products.types.validation.descriptionRequired'),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    try {
      if (editMode && selectedId !== null) {
        // Update product type
        await updateProductType({ ...formData, id: selectedId });
      } else {
        // Add new product type
        await addProductType(formData);
      }
      setOpenForm(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
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
      try {
        await removeProductType(String(selectedId));
        setOpenDeleteConfirm(false);
      } catch (error) {
        console.error('Error deleting product type:', error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoadingProductTypes) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <Typography>{t('common.loading')}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        width: '100%',
        maxWidth: 'none',
        boxSizing: 'border-box',
      }}
    >
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
          {t('products.types.title')}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Add sx={{ fontSize: 20 }} />}
          onClick={() => handleOpenForm()}
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
          {t('products.types.addType')}
        </Button>
      </Box>
      
      <ProductTypesGrid
        productTypes={productTypes}
        onEdit={handleOpenForm}
        onDelete={handleOpenDeleteConfirm}
      />
      
      <ProductTypeFormDialog
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
        title={t('products.types.confirmDeletion')}
        description={t('products.types.deletionIrreversible')}
      />
    </Box>
  );
};

export default ProductTypesScreen;