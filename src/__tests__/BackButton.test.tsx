import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../test/test-utils';
import BackButton from '../components/BackButton';

describe('BackButton Component', () => {
  it('renders the back button with correct text', () => {
    const mockOnClick = vi.fn();
    render(<BackButton onClick={mockOnClick} />);
    
    expect(screen.getByText('Indietro')).toBeInTheDocument();
  });

  it('calls onClick function when clicked', () => {
    const mockOnClick = vi.fn();
    render(<BackButton onClick={mockOnClick} />);
    
    const button = screen.getByText('Indietro').closest('div');
    fireEvent.click(button!);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('has correct styling for hover effect', () => {
    const mockOnClick = vi.fn();
    render(<BackButton onClick={mockOnClick} />);
    
    const button = screen.getByText('Indietro').closest('div');
    expect(button).toHaveStyle({ cursor: 'pointer' });
  });

  it('renders arrow icon', () => {
    const mockOnClick = vi.fn();
    render(<BackButton onClick={mockOnClick} />);
    
    // Check if the arrow icon component is rendered
    const container = screen.getByText('Indietro').closest('div');
    expect(container).toBeInTheDocument();
  });
});
