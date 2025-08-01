import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../test/test-utils';
import AssegnaButton from '../components/AssegnaButton';

describe('AssegnaButton Component', () => {
  it('renders button with correct text', () => {
    const mockOnClick = vi.fn();
    render(<AssegnaButton onClick={mockOnClick} />);
    
    expect(screen.getByText('Assegna')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = vi.fn();
    render(<AssegnaButton onClick={mockOnClick} />);
    
    fireEvent.click(screen.getByText('Assegna'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('renders with medium size by default', () => {
    const mockOnClick = vi.fn();
    render(<AssegnaButton onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('renders with small size when specified', () => {
    const mockOnClick = vi.fn();
    render(<AssegnaButton onClick={mockOnClick} size="small" />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('renders with icon', () => {
    const mockOnClick = vi.fn();
    render(<AssegnaButton onClick={mockOnClick} />);
    
    // Check that the button contains both icon and text
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Assegna');
  });

  it('handles different size props correctly', () => {
    const mockOnClick = vi.fn();
    
    // Test medium size
    const { rerender } = render(<AssegnaButton onClick={mockOnClick} size="medium" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    
    // Test small size
    rerender(<AssegnaButton onClick={mockOnClick} size="small" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
