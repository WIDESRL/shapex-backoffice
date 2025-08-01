import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock MainLayout to avoid complex dependencies
vi.mock('../MainLayout', () => ({
  default: () => <div data-testid="main-layout">Main Layout</div>,
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    // The app should render the MainLayout
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
  });

  it('renders with router wrapper', () => {
    render(<App />);
    // The app includes its own Router component
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
  });
});
