import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '../test/test-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSubscriptions } from '../hooks/useSubscriptions';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useSubscriptions Hook', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('fetches subscriptions successfully', async () => {
    const mockSubscriptions = [
      { id: 1, name: 'Basic Plan', price: 29.99 },
      { id: 2, name: 'Premium Plan', price: 59.99 },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSubscriptions,
    });

    const { result } = renderHook(() => useSubscriptions(), { wrapper });

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockSubscriptions);
    expect(result.current.isError).toBe(false);
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/subscriptions');
  });

  it('handles fetch error correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const { result } = renderHook(() => useSubscriptions(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeTruthy();
  });

  it('handles network error correctly', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useSubscriptions(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('uses correct query key', () => {
    renderHook(() => useSubscriptions(), { wrapper });

    // Check that the query was created with the correct key
    const queryCache = queryClient.getQueryCache();
    const queries = queryCache.getAll();
    
    expect(queries).toHaveLength(1);
    expect(queries[0].queryKey).toEqual(['subscriptions']);
  });

  it('provides correct initial state', () => {
    const { result } = renderHook(() => useSubscriptions(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });
});
