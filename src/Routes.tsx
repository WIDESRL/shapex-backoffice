import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './Context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';

const AppRoutes: React.FC = () => {
  const { isAuth } = useAuth();

  return (
    <Routes>
      {!isAuth ? (
        <Route path="/login" element={<LoginScreen />} />
      ) : (
        <>
          <Route path="/subscriptions" element={<SubscriptionScreen />} />
          <Route path="*" element={<Navigate to="/subscriptions" />} />
        </>
      )}
      <Route path="*" element={<Navigate to={isAuth ? '/subscriptions' : '/login'} />} />
    </Routes>
  );
};

export default AppRoutes;