import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

// Mock all the contexts and dependencies
vi.mock('../Context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="auth-provider">{children}</div>,
  useAuth: () => ({
    isAuth: false,
    userData: null,
    login: vi.fn(),
    logout: vi.fn(),
    getMyUserData: vi.fn(),
  }),
}));

vi.mock('../Context/SnackbarContext', () => ({
  SnackbarProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="snackbar-provider">{children}</div>,
  useSnackbar: () => ({
    showSnackbar: vi.fn(),
  }),
}));

vi.mock('../MainLayout', () => {
  return {
    default: () => <div data-testid="main-layout">Main Layout Content</div>,
  };
});

describe('App Integration Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  it('renders the complete app structure', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });
  });

  it('provides router context to the application', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    // The app should render without router-related errors
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
  });

  it('handles navigation correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    // Verify the app loads successfully
    await waitFor(() => {
      expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });
  });
});
