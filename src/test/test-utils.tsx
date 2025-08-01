import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../Context/AuthContext';
import { SnackbarProvider } from '../Context/SnackbarContext';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Mock data factories
export const createMockUser = (overrides = {}) => ({
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  type: 'client',
  verified: true,
  profilePictureFile: null,
  ...overrides,
});

export const createMockSubscription = (overrides = {}) => ({
  id: 1,
  name: 'Basic Plan',
  price: 29.99,
  duration: 30,
  ...overrides,
});

export const createMockTraining = (overrides = {}) => ({
  id: 1,
  name: 'Test Workout',
  exercises: [],
  date: new Date().toISOString(),
  completed: false,
  ...overrides,
});
