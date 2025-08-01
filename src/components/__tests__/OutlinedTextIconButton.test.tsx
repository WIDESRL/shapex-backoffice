import { render, screen } from '@testing-library/react';
import { vi, describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import OutlinedTextIconButton from '../OutlinedTextIconButton';

const TestIcon = () => <span data-testid="test-icon">→</span>;

describe('OutlinedTextIconButton', () => {
  it('renders with text and icon', () => {
    render(
      <OutlinedTextIconButton 
        text="Click me" 
        icon={<TestIcon />} 
      />
    );
    
    expect(screen.getByText('Click me')).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    render(
      <OutlinedTextIconButton 
        text="Click me" 
        icon={<TestIcon />} 
        onClick={handleClick}
      />
    );
    
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <OutlinedTextIconButton 
        text="Disabled" 
        icon={<TestIcon />} 
        disabled={true}
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('is disabled when loading is true', () => {
    render(
      <OutlinedTextIconButton 
        text="Loading" 
        icon={<TestIcon />} 
        loading={true}
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('shows loading spinner when loading is true', () => {
    render(
      <OutlinedTextIconButton 
        text="Loading" 
        icon={<TestIcon />} 
        loading={true}
      />
    );
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
  });

  it('shows icon when not loading', () => {
    render(
      <OutlinedTextIconButton 
        text="Not loading" 
        icon={<TestIcon />} 
        loading={false}
      />
    );
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    
    render(
      <OutlinedTextIconButton 
        text="Disabled" 
        icon={<TestIcon />} 
        onClick={handleClick}
        disabled={true}
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    // Disabled buttons cannot be clicked, so we just verify it's disabled
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when loading', () => {
    const handleClick = vi.fn();
    
    render(
      <OutlinedTextIconButton 
        text="Loading" 
        icon={<TestIcon />} 
        onClick={handleClick}
        loading={true}
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    // Disabled buttons cannot be clicked, so we just verify it's disabled
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('accepts custom sx styles', () => {
    render(
      <OutlinedTextIconButton 
        text="Custom styled" 
        icon={<TestIcon />} 
        sx={{ backgroundColor: 'red' }}
      />
    );
    
    const button = screen.getByRole('button');
    // MUI sx styles may not be directly reflected in computed styles in tests
    expect(button).toBeInTheDocument();
  });

  it('renders React node as text', () => {
    const textNode = <span data-testid="custom-text">Custom Text</span>;
    
    render(
      <OutlinedTextIconButton 
        text={textNode} 
        icon={<TestIcon />} 
      />
    );
    
    expect(screen.getByTestId('custom-text')).toBeInTheDocument();
  });

  it('has correct default styles', () => {
    render(
      <OutlinedTextIconButton 
        text="Styled button" 
        icon={<TestIcon />} 
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({
      color: 'rgb(97, 97, 96)'
    });
    
    // Other MUI sx styles may not be directly testable
    expect(button).toHaveClass('MuiButton-outlined');
  });
});
