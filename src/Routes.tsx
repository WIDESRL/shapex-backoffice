import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './Context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import SubscriptionScreen from './screens/Subscription';
import DashboardPage from './screens/DashboardPage';
import ClientsPage from './screens/clients/ClientsPage';
import TrainingPage from './screens/TrainingPage';
import ChatPage from './screens/ChatPage';
import BannersPage from './screens/BannersPage';
// Submenu pages
import AnagraficaPage from './screens/clients/AnagraficaPage';
import AllenamentiPage from './screens/clients/AllenamentiPage';
import DiarioPage from './screens/clients/DarioPage';
import AlimentazionePage from './screens/clients/AlimentazionePage';
import AltroPage from './screens/clients/AltroPage';
import TrainingExercisePage from './screens/training/Exercises/TrainingExercisePage';
import TrainingProgramPage from './screens/training/TrainingProgram/TrainingProgramPage';
import TrainingProgramDetailPage from './screens/training/TrainingProgram/TrainingProgramDetailPage';
import CompletedTrainingPage from './screens/training/CompletedTrainingPage';
import SettingsPage from './screens/SettingsPage';

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
          <Route path="/clients/:clientId/anagrafica" element={<AnagraficaPage />} />
          <Route path="/clients/:clientId/allenamenti" element={<AllenamentiPage />} />
          <Route path="/clients/:clientId/diario" element={<DiarioPage />} />
          <Route path="/clients/:clientId/alimentazione" element={<AlimentazionePage />} />
          <Route path="/clients/:clientId/altro" element={<AltroPage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/training/exercise" element={<TrainingExercisePage />} />
          <Route path="/training/training-program" element={<TrainingProgramPage />} />
          <Route path="/training/training-program/:trainingProgramId" element={<TrainingProgramDetailPage />} />
          <Route path="/training/completed-training" element={<CompletedTrainingPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/banners" element={<BannersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </>
      )}
      <Route path="*" element={<Navigate to={isAuth ? '/dashboard' : '/login'} />} />
    </Routes>
  );
};

export default AppRoutes;