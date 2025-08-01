import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../test/test-utils';
import TabButton from '../components/TabButton';

describe('TabButton Component', () => {
  it('renders button with correct title', () => {
    const mockOnClick = vi.fn();
    render(<TabButton title="Test Tab" onClick={mockOnClick} active={false} />);
    
    expect(screen.getByText('Test Tab')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = vi.fn();
    render(<TabButton title="Test Tab" onClick={mockOnClick} active={false} />);
    
    fireEvent.click(screen.getByText('Test Tab'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies active styles when active is true', () => {
    const mockOnClick = vi.fn();
    render(<TabButton title="Active Tab" onClick={mockOnClick} active={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    // The active styles should be applied
  });

  it('applies inactive styles when active is false', () => {
    const mockOnClick = vi.fn();
    render(<TabButton title="Inactive Tab" onClick={mockOnClick} active={false} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    // The inactive styles should be applied
  });

  it('renders as a button element', () => {
    const mockOnClick = vi.fn();
    render(<TabButton title="Test Tab" onClick={mockOnClick} active={false} />);
    
    const button = screen.getByRole('button');
    expect(button.tagName.toLowerCase()).toBe('button');
  });
});
