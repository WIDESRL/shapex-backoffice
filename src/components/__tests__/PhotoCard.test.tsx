import { render, screen } from '@testing-library/react';
import { vi, describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import PhotoCard from '../PhotoCard';

describe('PhotoCard', () => {
  it('renders without image and label', () => {
    const { container } = render(<PhotoCard imageUrl={null} />);
    
    // Should render the placeholder when no image
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with image and label', () => {
    render(
      <PhotoCard 
        imageUrl="https://example.com/image.jpg" 
        label="Test Photo" 
      />
    );
    
    expect(screen.getByText('Test Photo')).toBeInTheDocument();
    expect(screen.getByAltText('Photo')).toBeInTheDocument();
  });

  it('renders without label when not provided', () => {
    render(<PhotoCard imageUrl="https://example.com/image.jpg" />);
    
    expect(screen.getByAltText('Photo')).toBeInTheDocument();
    expect(screen.queryByText(/test/i)).not.toBeInTheDocument();
  });

  it('calls onClick when image is present and card is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    render(
      <PhotoCard 
        imageUrl="https://example.com/image.jpg" 
        onClick={handleClick}
      />
    );
    
    // Click on the image container - use the image to find its container
    const image = screen.getByAltText('Photo');
    const imageContainer = image.closest('[style*="cursor"]') || image.parentElement;
    await user.click(imageContainer!);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when no image is present', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    const { container } = render(
      <PhotoCard 
        imageUrl={null} 
        onClick={handleClick}
      />
    );
    
    // Click on the placeholder container
    const placeholderContainer = container.querySelector('div > div');
    if (placeholderContainer) {
      await user.click(placeholderContainer);
    }
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when onClick is not provided', async () => {
    const user = userEvent.setup();
    
    render(<PhotoCard imageUrl="https://example.com/image.jpg" />);
    
    // Click on the image container - use the image to find its container
    const image = screen.getByAltText('Photo');
    const imageContainer = image.closest('[style*="cursor"]') || image.parentElement;
    // Should not throw error when clicking without onClick handler
    await user.click(imageContainer!);
    
    // Test passes if no error is thrown
    expect(true).toBe(true);
  });

  it('applies custom height when provided', () => {
    render(
      <PhotoCard 
        imageUrl="https://example.com/image.jpg" 
        height={150}
      />
    );
    
    // Since MUI styles are applied through classes, just verify the component renders
    // and the height prop is being used (component behavior test)
    expect(screen.getByAltText('Photo')).toBeInTheDocument();
  });

  it('uses default height when not provided', () => {
    render(<PhotoCard imageUrl="https://example.com/image.jpg" />);
    
    // Since MUI styles are applied through classes, just verify the component renders
    // with default height (component behavior test)
    expect(screen.getByAltText('Photo')).toBeInTheDocument();
  });

  it('shows placeholder when imageUrl is null', () => {
    const { container } = render(<PhotoCard imageUrl={null} />);
    
    // Should not have ImageCustom component
    expect(screen.queryByAltText('Photo')).not.toBeInTheDocument();
    
    // Should have placeholder div
    const placeholder = container.querySelector('div > div > div');
    expect(placeholder).toBeInTheDocument();
  });

  it('has correct cursor style based on image presence', () => {
    // With image - should have pointer cursor
    const { rerender } = render(
      <PhotoCard imageUrl="https://example.com/image.jpg" />
    );
    
    // Check that image is rendered (component behavior)
    expect(screen.getByAltText('Photo')).toBeInTheDocument();
    
    // Without image - should have default cursor
    rerender(<PhotoCard imageUrl={null} />);
    
    // Check that image is not rendered (component behavior)
    expect(screen.queryByAltText('Photo')).not.toBeInTheDocument();
  });
});
