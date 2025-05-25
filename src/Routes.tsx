import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './Context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import SubscriptionScreen from './screens/Subscription';
import DashboardPage from './screens/DashboardPage';
import ClientsPage from './screens/ClientsPage';
import TrainingPage from './screens/TrainingPage';
import ChatPage from './screens/ChatPage';
import BannersPage from './screens/BannersPage';
// Submenu pages
import AnagraficaPage from './screens/clients/AnagraficaPage';
import AllenamentiPage from './screens/clients/AllenamentiPage';
import DiarioPage from './screens/clients/DiarioPage';
import AlimentazionePage from './screens/clients/AlimentazionePage';
import AltroPage from './screens/clients/AltroPage';
import TrainingTest1Page from './screens/training/TrainingTest1Page';
import TrainingTest2Page from './screens/training/TrainingTest2Page';

const AppRoutes: React.FC = () => {
  const { isAuth } = useAuth();

  return (
    <Routes>
      {!isAuth ? (
        <Route path="/login" element={<LoginScreen />} />
      ) : (
        <>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/subscriptions" element={<SubscriptionScreen />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/clients/anagrafica" element={<AnagraficaPage />} />
          <Route path="/clients/allenamenti" element={<AllenamentiPage />} />
          <Route path="/clients/diario" element={<DiarioPage />} />
          <Route path="/clients/alimentazione" element={<AlimentazionePage />} />
          <Route path="/clients/altro" element={<AltroPage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/training/test1" element={<TrainingTest1Page />} />
          <Route path="/training/test2" element={<TrainingTest2Page />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/banners" element={<BannersPage />} />
          <Route path="/" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </>
      )}
      <Route path="*" element={<Navigate to={isAuth ? '/dashboard' : '/login'} />} />
    </Routes>
  );
};

export default AppRoutes;