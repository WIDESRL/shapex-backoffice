import React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ProductType } from '../../Context/ProductsContext';
import TrashIcon from '../../icons/TrashIcon';
import PencilIcon from '../../icons/PencilIcon';

interface ProductTypesGridProps {
  productTypes: ProductType[];
  onEdit: (productType: ProductType) => void;
  onDelete: (id: number) => void;
}

const ProductTypesGrid: React.FC<ProductTypesGridProps> = ({ productTypes, onEdit, onDelete }) => {
  const { t } = useTranslation();

  if (!productTypes || productTypes.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 200,
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: 24,
            fontWeight: 400,
            color: '#888',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          {t('products.types.noTypesTitle')}
        </Typography>
        <Typography
          sx={{
            fontSize: 16,
            color: '#bbb',
            fontFamily: 'Montserrat, sans-serif',
            textAlign: 'center',
          }}
        >
          {t('products.types.noTypesDescription')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
        mt: 1,
      }}
    >
      {productTypes.map((productType) => (
        <Box
          key={productType.id}
          sx={{
            flex: '1 1 calc(33.333% - 32px)',
            minWidth: 280,
            maxWidth: 400,
            background: '#f6f6f6',
            borderRadius: 3,
            p: 2.5,
            boxShadow: 0,
            minHeight: 180,
            position: 'relative',
            fontFamily: 'Montserrat, sans-serif',
            mb: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 400,
              color: '#616160',
              mb: 1,
              width: '90%',
              fontFamily: 'Montserrat, sans-serif',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.2,
              height: '2.4em', 
              minHeight: '2.4em',
            }}
          >
            {productType.name}
          </Typography>
          
          <IconButton
            onClick={() => onDelete(productType.id)}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              color: '#616160',
              background: 'transparent',
              '&:hover': { background: '#ececec' },
            }}
            size="small"
          >
            <TrashIcon style={{ width: 35, height: 35}} />
          </IconButton>
          
          <Typography
            sx={{
              fontSize: 13,
              color: '#888',
              mb: 1.5,
              fontFamily: 'Montserrat, sans-serif',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.4,
              height: '5.6em',
              minHeight: '2.8em',
            }}
          >
            {productType.description}
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              color: '#616160',
              fontWeight: 500,
              mb: 1.5,
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            {t('products.types.usedInProducts')}: <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
              {productType._count?.products || 0} {t('products.products')}
            </span>
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              mt: 1,
            }}
          >
            <Button
              variant="contained"
              onClick={() => onEdit(productType)}
              sx={{
                background: '#E6BB4A',
                color: '#fff',
                borderRadius: 2,
                fontWeight: 400,
                fontSize: 18,
                px: 2.5,
                py: 0.2,
                minWidth: 120,
                minHeight: 40,
                boxShadow: 0,
                textTransform: 'none',
                fontFamily: 'Montserrat, sans-serif',
                '&:hover': { background: '#d1a53d' },
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 400,
                  fontSize: 18,
                  marginRight: 8,
                }}
              >
                {t('products.types.edit')}
              </span>
              <PencilIcon style={{ width: 22, height: 22 }} />
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default ProductTypesGrid;