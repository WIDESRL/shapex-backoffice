import React from 'react';
import { Box, Typography } from '@mui/material';

interface WarningBannerProps {
  message?: string;
}

const WarningDummyDataBanner: React.FC<WarningBannerProps> = ({ message }) => (
  <Box
    sx={{
      background: '#FFF3CD',
      color: '#856404',
      border: '1px solid #FFEEBA',
      borderRadius: 2,
      p: 2,
      mb: 4,
      display: 'flex',
      alignItems: 'center',
      fontFamily: 'Montserrat, sans-serif',
    }}
  >
    <Typography sx={{ fontSize: 18, fontWeight: 500 }}>
      {message || "Attenzione: questa pagina non è ancora completa e sta utilizzando dati di esempio (dummy data)."}
    </Typography>
  </Box>
);

export default WarningDummyDataBanner;
