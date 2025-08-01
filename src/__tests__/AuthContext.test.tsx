import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../Context/AuthContext';

// Mock the API and socket modules
vi.mock('../utils/axiosInstance', () => ({
  api: {
    post: vi.fn().mockImplementation((url) => {
      if (url === '/auth/login') {
        return Promise.resolve({ 
          data: { 
            token: 'test-token',
            refreshToken: 'test-refresh-token'
          }
        });
      }
      return Promise.resolve({ data: {} });
    }),
    get: vi.fn().mockResolvedValue({ data: {} }),
    put: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

vi.mock('../socket', () => ({
  initSocket: vi.fn().mockResolvedValue({}),
  disconnectSocket: vi.fn(),
}));

vi.mock('../notifications', () => ({
  requestNotificationPermission: vi.fn().mockResolvedValue(undefined),
  stopPushNotifications: vi.fn(),
}));

// Test component to access auth context
const TestComponent = () => {
  const auth = useAuth();
  
  return (
    <div>
      <div data-testid="auth-status">{auth.isAuth ? 'authenticated' : 'not authenticated'}</div>
      <div data-testid="user-data">{auth.userData ? auth.userData.username : 'no user'}</div>
      <button onClick={() => auth.logout()} data-testid="logout-btn">Logout</button>
    </div>
  );
};

// Wrapper component with QueryClient
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('provides initial auth state as not authenticated when no token in localStorage', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('not authenticated');
    expect(screen.getByTestId('user-data')).toHaveTextContent('no user');
  });

  it('provides initial auth state as authenticated when token exists in localStorage', () => {
    localStorage.setItem('token', 'test-token');
    
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
  });

  it('updates auth state on logout', async () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');
    
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    // Initially authenticated
    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');

    // Click logout
    fireEvent.click(screen.getByTestId('logout-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('not authenticated');
    });
  });

  it('generates and stores device ID during login', async () => {
    // Create a test component that triggers login
    const LoginTestComponent = () => {
      const auth = useAuth();
      
      return (
        <div>
          <div data-testid="auth-status">{auth.isAuth ? 'authenticated' : 'not authenticated'}</div>
          <button 
            onClick={() => auth.login({ username: 'test', password: 'test' })} 
            data-testid="login-btn"
          >
            Login
          </button>
        </div>
      );
    };

    render(
      <TestWrapper>
        <LoginTestComponent />
      </TestWrapper>
    );

    // Trigger login
    fireEvent.click(screen.getByTestId('login-btn'));

    // Wait for login to complete
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    });

    // Check that a device ID was generated and stored
    const deviceId = localStorage.getItem('deviceId');
    expect(deviceId).toBeTruthy();
    expect(deviceId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });
});
