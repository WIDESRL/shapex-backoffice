import { createRoot } from 'react-dom/client'
import React from 'react';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './Context/AuthContext';
import { SubscriptionsProvider } from './Context/SubscriptionsContext';
import { BannersProvider } from './Context/BannersContext';
import { MessagesProvider } from './Context/MessagesContext';
import { TrainingProvider } from './Context/TrainingContext';
import './i18n/i18n';
import { requestNotificationPermission, listenForMessages } from './notifications';
import './splash.css';
import './global-font.css';
import { ClientProvider } from './Context/ClientContext';

const queryClient = new QueryClient();

requestNotificationPermission();
listenForMessages();

const hideSplash = () => {
  const splash = document.getElementById('splash-bg');
  if (splash) splash.style.display = 'none';
};

const renderApp = () => {
  createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SubscriptionsProvider>
          <BannersProvider>
            <MessagesProvider>
              <TrainingProvider>
                <ClientProvider>
                  <App />
                </ClientProvider>
              </TrainingProvider>
            </MessagesProvider>
          </BannersProvider>
        </SubscriptionsProvider>
      </AuthProvider>
    </QueryClientProvider>
</React.StrictMode>
  );
  setTimeout(hideSplash, 200);
};

window.addEventListener('DOMContentLoaded', () => {
  renderApp();
});
