# Test Suite Documentation

This document describes the comprehensive test suite for the React application.

## Test Structure

### Test Categories

1. **Unit Tests** - Test individual components and utilities in isolation
2. **Integration Tests** - Test component interactions and application flow
3. **Hook Tests** - Test custom React hooks
4. **Utility Tests** - Test utility functions and helpers
5. **Context Tests** - Test React context providers and consumers

### Test Files

#### Components
- `App.test.tsx` - Main application component tests
- `BackButton.test.tsx` - Back button component functionality
- `AvatarCustom.test.tsx` - Avatar component with loading states
- `NotificationCard.test.tsx` - Notification display component

#### Contexts
- `AuthContext.test.tsx` - Authentication context provider tests

#### Hooks
- `useSubscriptions.test.tsx` - Subscription data fetching hook

#### Utilities
- `colorUtils.test.ts` - Color manipulation utility functions
- `errorUtils.test.ts` - Error handling utility functions

#### Integration
- `App.integration.test.tsx` - Full application integration tests

#### Health Checks
- `health.test.ts` - Environment and dependency verification

## Test Configuration

### Setup Files
- `src/test/setup.ts` - Global test setup and mocks
- `src/test/test-utils.tsx` - Custom render function with providers
- `vitest.config.ts` - Vitest configuration

### Key Features
- **Mocking**: Firebase, notifications, socket connections, and React Router
- **Providers**: Custom render function includes all necessary context providers
- **TypeScript**: Full TypeScript support for tests
- **Coverage**: Code coverage reporting available

## Running Tests

### Available Scripts
```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Environment
- **Test Runner**: Vitest
- **Testing Library**: React Testing Library
- **DOM Environment**: jsdom
- **Mocking**: Vitest built-in mocking

## Test Patterns

### Component Testing
```typescript
// Basic component test structure
describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interactions', () => {
    const mockFn = vi.fn();
    render(<ComponentName onClick={mockFn} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockFn).toHaveBeenCalled();
  });
});
```

### Hook Testing
```typescript
// Hook test structure
describe('useCustomHook', () => {
  it('returns expected data', async () => {
    const { result } = renderHook(() => useCustomHook());
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });
});
```

### Context Testing
```typescript
// Context test structure
describe('CustomContext', () => {
  it('provides expected values', () => {
    render(
      <CustomProvider>
        <TestComponent />
      </CustomProvider>
    );
    expect(screen.getByTestId('context-value')).toHaveTextContent('expected');
  });
});
```

## Mocking Strategy

### External Dependencies
- **Firebase**: Mocked to prevent actual Firebase calls
- **Socket.io**: Mocked socket connections
- **React Router**: Mocked navigation functions
- **API Calls**: Mocked HTTP requests

### Browser APIs
- **IntersectionObserver**: Mocked for scroll-based components
- **ResizeObserver**: Mocked for responsive components
- **matchMedia**: Mocked for media query handling

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the user sees and does
2. **Use Meaningful Test Names**: Describe what is being tested
3. **Arrange-Act-Assert**: Structure tests clearly
4. **Mock External Dependencies**: Keep tests isolated and fast
5. **Test Error Cases**: Include negative test cases
6. **Keep Tests Simple**: One assertion per test when possible

## Continuous Integration

The test suite is designed to run in CI environments with:
- Fast execution times
- Reliable mocking
- Clear error reporting
- Coverage reporting

## Adding New Tests

When adding new components or features:

1. Create a corresponding test file
2. Follow existing naming conventions
3. Include both positive and negative test cases
4. Mock external dependencies appropriately
5. Update this documentation if needed

## Troubleshooting

### Common Issues
- **Module not found**: Check import paths and mocks
- **Test timeouts**: Increase timeout for async operations
- **Mock issues**: Verify mock setup in setup.ts
- **Type errors**: Ensure proper TypeScript configuration

### Debug Commands
```bash
# Run specific test file
npm run test -- BackButton.test.tsx

# Run tests with verbose output
npm run test -- --reporter=verbose

# Run tests in debug mode
npm run test -- --no-coverage
```
