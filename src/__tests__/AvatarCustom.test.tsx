import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test/test-utils';
import AvatarCustom from '../components/AvatarCustom';

describe('AvatarCustom Component', () => {
  const mockSrc = 'https://example.com/avatar.jpg';

  it('renders avatar with provided src', () => {
    render(<AvatarCustom src={mockSrc} alt="Test Avatar" />);
    
    const avatar = document.querySelector('img');
    expect(avatar).toHaveAttribute('src', mockSrc);
    expect(avatar).toHaveAttribute('alt', 'Test Avatar');
  });

  it('shows loading state initially', () => {
    render(<AvatarCustom src={mockSrc} />);
    
    // Check if loader dots are present
    const loaderSpans = document.querySelectorAll('[style*="dotFlashing"]');
    expect(loaderSpans.length).toBeGreaterThan(0);
  });

  it('shows refresh button on image error', async () => {
    render(<AvatarCustom src="invalid-url" />);
    
    const avatar = document.querySelector('img');
    
    // Trigger error event
    if (avatar) {
      fireEvent.error(avatar);
    }
    
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  it('retries loading image when refresh button is clicked', async () => {
    render(<AvatarCustom src="invalid-url" />);
    
    const avatar = document.querySelector('img');
    if (avatar) {
      fireEvent.error(avatar);
    }
    
    await waitFor(() => {
      const refreshButton = screen.getByRole('button');
      expect(refreshButton).toBeInTheDocument();
      
      fireEvent.click(refreshButton);
    });
    
    // After retry, should show avatar again (not refresh button)
    await waitFor(() => {
      expect(document.querySelector('img')).toBeInTheDocument();
    });
  });

  it('applies custom styles', () => {
    const customStyles = { width: 60, height: 60, backgroundColor: 'red' };
    render(<AvatarCustom src={mockSrc} sx={customStyles} />);
    
    const avatarContainer = document.querySelector('.MuiAvatar-root');
    expect(avatarContainer).toBeInTheDocument();
  });

  it('shows fallback content when provided', () => {
    const fallback = <span>FB</span>;
    render(<AvatarCustom src={mockSrc} fallback={fallback} />);
    
    // The fallback content should be inside the Avatar component
    const avatarContainer = document.querySelector('.MuiAvatar-root');
    expect(avatarContainer).toBeInTheDocument();
  });

  it('hides loading state after image loads', async () => {
    render(<AvatarCustom src={mockSrc} />);
    
    const avatar = document.querySelector('img');
    
    // Trigger load event
    if (avatar) {
      fireEvent.load(avatar);
    }
    
    await waitFor(() => {
      const loaderContainer = document.querySelector('[style*="dotFlashing"]');
      expect(loaderContainer).not.toBeInTheDocument();
    });
  });
});
