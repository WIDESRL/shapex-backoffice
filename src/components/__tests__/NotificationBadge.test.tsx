import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import NotificationBadge from '../NotificationBadge';

describe('NotificationBadge', () => {
  it('renders badge with count when visible', () => {
    render(<NotificationBadge count={5} visible={true} />);
    
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('does not render when visible is false', () => {
    const { container } = render(<NotificationBadge count={5} visible={false} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('does not render when count is 0', () => {
    const { container } = render(<NotificationBadge count={0} visible={true} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('defaults to visible when visible prop is not provided', () => {
    render(<NotificationBadge count={3} />);
    
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('displays "99+" when count is greater than 99', () => {
    render(<NotificationBadge count={150} />);
    
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('displays exact count when count is 99 or less', () => {
    render(<NotificationBadge count={99} />);
    
    expect(screen.getByText('99')).toBeInTheDocument();
  });

  it('has correct styling', () => {
    render(<NotificationBadge count={1} />);
    
    const badge = screen.getByText('1');
    
    // Check styles directly on the badge element
    expect(badge).toHaveStyle({
      color: 'rgb(128, 128, 128)' // grey gets computed to this value
    });
    
    // The backgroundColor and other styles are applied via MUI sx prop
    // which may not show in computed styles in tests
  });
});
