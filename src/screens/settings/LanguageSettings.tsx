import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface LanguageSettingsProps {
  styles: Record<string, Record<string, unknown>>;
}

const LanguageSettings: React.FC<LanguageSettingsProps> = ({ styles }) => {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || i18n.language;
    setCurrentLanguage(savedLanguage);
  }, [i18n.language]);

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  };

  return (
    <Paper sx={styles.sectionPaper}>
      <Typography sx={styles.sectionTitle}>
        {t('settings.languageRegion')}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Box sx={styles.languageSelector}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>{t('settings.language')}</InputLabel>
          <Select
            value={currentLanguage}
            label={t('settings.language')}
            onChange={(e) => handleLanguageChange(e.target.value)}
            size="small"
          >
            <MenuItem value="en">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: 20, marginRight: 8 }}>🇺🇸</span>
                English
              </Box>
            </MenuItem>
            <MenuItem value="it">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: 20, marginRight: 8 }}>🇮🇹</span>
                Italiano
              </Box>
            </MenuItem>
          </Select>
        </FormControl>
        <Typography variant="body2" sx={{ color: '#666', ml: 2 }}>
          {t('settings.languageChangeEffect')}
        </Typography>
      </Box>
    </Paper>
  );
};

export default LanguageSettings;
