import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, expect, it, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import ImageCustom from '../ImageCustom';

// Mock RefreshIcon
vi.mock('@mui/icons-material/Refresh', () => ({
  default: () => <span data-testid="refresh-icon">↻</span>
}));

describe('ImageCustom', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders image with src and alt', () => {
    render(<ImageCustom src="https://example.com/image.jpg" alt="Test image" />);
    
    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('shows loading spinner initially', () => {
    render(<ImageCustom src="https://example.com/image.jpg" />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('hides loading spinner when image loads', async () => {
    const { container } = render(<ImageCustom src="https://example.com/image.jpg" />);
    
    const image = container.querySelector('img');
    fireEvent.load(image!);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });

  it('shows error state with retry button when image fails to load', async () => {
    const { container } = render(<ImageCustom src="https://example.com/broken-image.jpg" />);
    
    const image = container.querySelector('img');
    fireEvent.error(image!);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(screen.getByTestId('refresh-icon')).toBeInTheDocument();
    });
  });

  it('retries loading when retry button is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<ImageCustom src="https://example.com/broken-image.jpg" />);
    
    const image = container.querySelector('img');
    fireEvent.error(image!);
    
    await waitFor(() => {
      expect(screen.getByTestId('refresh-icon')).toBeInTheDocument();
    });
    
    const retryButton = screen.getByRole('button');
    await user.click(retryButton);
    
    // Should show loading again
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('uses custom spinner size', () => {
    render(<ImageCustom src="https://example.com/image.jpg" spinnerSize={60} />);
    
    const spinner = screen.getByRole('progressbar');
    expect(spinner).toHaveStyle({ width: '60px', height: '60px' });
  });

  it('applies custom styles', () => {
    const customStyle = { width: '200px', height: '150px' };
    const { container } = render(
      <ImageCustom 
        src="https://example.com/image.jpg" 
        style={customStyle}
      />
    );
    
    const image = container.querySelector('img');
    expect(image).toHaveStyle(customStyle);
  });

  it('applies custom className', () => {
    const { container } = render(
      <ImageCustom 
        src="https://example.com/image.jpg" 
        className="custom-class"
      />
    );
    
    const image = container.querySelector('img');
    expect(image).toHaveClass('custom-class');
  });

  it('passes through additional img attributes', () => {
    const { container } = render(
      <ImageCustom 
        src="https://example.com/image.jpg" 
        title="Custom title"
        id="custom-id"
      />
    );
    
    const image = container.querySelector('img');
    expect(image).toHaveAttribute('title', 'Custom title');
    expect(image).toHaveAttribute('id', 'custom-id');
  });

  it('has lazy loading by default', () => {
    const { container } = render(<ImageCustom src="https://example.com/image.jpg" />);
    
    const image = container.querySelector('img');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('uses empty string as default alt text', () => {
    const { container } = render(<ImageCustom src="https://example.com/image.jpg" />);
    
    const image = container.querySelector('img');
    expect(image).toHaveAttribute('alt', '');
  });

  it('shows image with opacity 0 while loading', () => {
    const { container } = render(<ImageCustom src="https://example.com/image.jpg" />);
    
    const image = container.querySelector('img');
    expect(image).toHaveStyle({ opacity: '0' });
  });

  it('shows image with opacity 1 after loading', async () => {
    const { container } = render(<ImageCustom src="https://example.com/image.jpg" />);
    
    const image = container.querySelector('img');
    fireEvent.load(image!);
    
    await waitFor(() => {
      expect(image).toHaveStyle({ opacity: '1' });
    });
  });

  it('stops propagation on retry button click', async () => {
    const user = userEvent.setup();
    const parentClickHandler = vi.fn();
    
    const { container } = render(
      <div onClick={parentClickHandler}>
        <ImageCustom src="https://example.com/broken-image.jpg" />
      </div>
    );
    
    const image = container.querySelector('img');
    fireEvent.error(image!);
    
    await waitFor(() => {
      expect(screen.getByTestId('refresh-icon')).toBeInTheDocument();
    });
    
    const retryButton = screen.getByRole('button');
    await user.click(retryButton);
    
    expect(parentClickHandler).not.toHaveBeenCalled();
  });
});
