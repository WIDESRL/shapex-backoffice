import { createRoot } from 'react-dom/client'
import React from 'react';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './Context/AuthContext';
import { SubscriptionsProvider } from './Context/SubscriptionsContext';
import { BannersProvider } from './Context/BannersContext';
import { MessagesProvider } from './Context/MessagesContext';
import { TrainingProvider } from './Context/TrainingContext';
import { GlobalConfigProvider } from './Context/GlobalConfigContext';
import './i18n/i18n';
import { requestNotificationPermission, listenForMessages } from './notifications';
import './splash.css';
import './global-font.css';
import { ClientProvider } from './Context/ClientContext';
import { StatsProvider } from './Context/StatsContext';
import { SnackbarProvider } from './Context/SnackbarContext';
import { SystemNotificationsProvider } from './Context/SystemNotificationsContext';

const queryClient = new QueryClient();

requestNotificationPermission();
listenForMessages();

const hideSplash = () => {
  const splash = document.getElementById('splash-bg');
  if (splash) splash.style.display = 'none';
};

const renderApp = () => {
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SnackbarProvider>
            <GlobalConfigProvider>
              <SubscriptionsProvider>
                <BannersProvider>
                  <MessagesProvider>
                    <TrainingProvider>
                      <StatsProvider>
                        <ClientProvider>
                          <SystemNotificationsProvider>
                            <App />
                          </SystemNotificationsProvider>
                        </ClientProvider>
                      </StatsProvider>
                    </TrainingProvider>
                  </MessagesProvider>
                </BannersProvider>
              </SubscriptionsProvider>
            </GlobalConfigProvider>
          </SnackbarProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
  setTimeout(hideSplash, 200);
};

window.addEventListener('DOMContentLoaded', () => {
  renderApp();
});
