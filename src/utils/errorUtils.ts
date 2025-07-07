import { AxiosError } from 'axios';

export const getServerErrorMessage = (
  errorCode: string | undefined, 
  t: (key: string) => string, 
  customFallback?: string
): string => {
  if (!errorCode) return customFallback || t('serverErrors.defaultError');
  const translationKey = `serverErrors.${errorCode}`;
  const translatedMessage = t(translationKey);
  if (translatedMessage === translationKey) return customFallback || t('serverErrors.defaultError');
  return translatedMessage;
};

/**
 * Handles API errors and displays user-friendly messages via snackbar
 * @param error - The error object from the API call
 * @param showSnackbar - Function to show snackbar notifications
 * @param t - Translation function
 * @param customFallback - Optional custom fallback message
 */
export const handleApiError = (
  error: unknown,
  showSnackbar: (message: string, severity: 'error' | 'warning' | 'info' | 'success') => void,
  t: (key: string) => string,
  customFallback?: string
): void => {
  const axiosError = error as AxiosError<{ errorCode?: string }>;
  const errorCode = axiosError?.response?.data?.errorCode;
  const errorMessage = getServerErrorMessage(errorCode, t, customFallback);
  showSnackbar(errorMessage, 'error');
};
