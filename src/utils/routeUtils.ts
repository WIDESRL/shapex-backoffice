export const extractClientIdFromPath = (pathname: string): string | null => {
  const match = pathname.match(/\/clients\/([^/]+)\//);
  return match ? match[1] : null;
};

export const buildClientPath = (clientId: string | null, section: string): string => {
  // Anagrafica can be accessed without clientId
  if (section === 'anagrafica') {
    return clientId ? `/clients/${clientId}/${section}` : `/clients/${section}`;
  }
  
  // Other sections require clientId
  if (!clientId) {
    return '/clients';
  }
  return `/clients/${clientId}/${section}`;
};

export const isClientRoute = (pathname: string): boolean => {
  return pathname.startsWith('/clients/') && pathname.split('/').length > 2;
};

export const validateClientRoute = (pathname: string, section: string): boolean => {
  const clientId = extractClientIdFromPath(pathname);
  // Anagrafica doesn't require clientId
  if (section === 'anagrafica') {
    return true;
  }
  // Other sections require clientId
  return clientId !== null;
};
