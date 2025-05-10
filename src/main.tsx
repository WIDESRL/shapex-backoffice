import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'


import React from 'react';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './Context/AuthContext';
import { SubscriptionsProvider } from './Context/SubscriptionsContext';
import './i18n/i18n'; // Import the i18n configuration file
import { requestNotificationPermission, listenForMessages } from './notifications';

// import { BrowserRouter } from 'react-router-dom';
const queryClient = new QueryClient();

requestNotificationPermission();
listenForMessages();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  {/* <BrowserRouter> */}
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SubscriptionsProvider>
          <App />
        </SubscriptionsProvider>
      </AuthProvider>
    </QueryClientProvider>
  {/* </BrowserRouter> */}
</React.StrictMode>,
)
