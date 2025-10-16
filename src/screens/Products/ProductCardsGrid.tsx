import React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Product } from '../../Context/ProductsContext';
import TrashIcon from '../../icons/TrashIcon';
import PencilIcon from '../../icons/PencilIcon';

// Extended Product interface to include message field
interface ProductWithMessage extends Product {
  message?: string;
}

interface ProductCardsGridProps {
  products: ProductWithMessage[];
  onEdit: (product: ProductWithMessage) => void;
  onDelete: (id: number) => void;
}

const ProductCardsGrid: React.FC<ProductCardsGridProps> = ({ products, onEdit, onDelete }) => {
  const { t } = useTranslation();
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
        mt: 1,
      }}
    >
      {products.map((product) => (
        <Box
          key={product.id}
          sx={{
            flex: '1 1 calc(33.333% - 32px)',
            minWidth: 280,
            maxWidth: 400,
            background: '#f6f6f6',
            borderRadius: 3,
            p: 2.5,
            boxShadow: 0,
            minHeight: 210,
            position: 'relative',
            fontFamily: 'Montserrat, sans-serif',
            mb: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: 30,
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
            {product.title}
          </Typography>
          
          <IconButton
            onClick={() => onDelete(product.id)}
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
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.4,
              height: '4.2em',
              minHeight: '2.8em',
            }}
          >
            {product.description}
          </Typography>

          {/* Message field */}
          {product.message && (
            <Typography
              sx={{
                fontSize: 12,
                color: '#666',
                mb: 1.5,
                fontFamily: 'Montserrat, sans-serif',
                fontStyle: 'italic',
                backgroundColor: '#f0f0f0',
                p: 1,
                borderRadius: 1,
                border: '1px solid #e0e0e0',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.3,
              }}
            >
              <strong>{t('products.pushMessage')}:</strong> {product.message}
            </Typography>
          )}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              mb: 1.5,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 15,
                  color: '#616160',
                  fontWeight: 500,
                  mb: 0.5,
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                {t('products.fields.tipo')} <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{product.type?.name || 'N/A'}</span>
              </Typography>

              <Typography
                sx={{
                  fontSize: 15,
                  color: '#616160',
                  fontWeight: 500,
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                {t('products.fields.prezzo')} <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{product.price.toFixed(2)} €</span>
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={() => onEdit(product)}
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
                {t('products.edit')}
              </span>
              <PencilIcon style={{ width: 22, height: 22 }} />
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default ProductCardsGrid;