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
