import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/test-utils';
import NotificationCard from '../components/NotificationCard';

describe('NotificationCard Component', () => {
  const mockNotification = {
    id: 1,
    title: 'Test Notification',
    description: 'This is a test notification description',
    type: 'push' as const,
    metadata: { key: 'value' },
    createdAt: '2024-07-31T10:00:00Z',
  };

  it('renders notification title and description', () => {
    render(<NotificationCard notification={mockNotification} />);
    
    expect(screen.getByText('Test Notification')).toBeInTheDocument();
    expect(screen.getByText('This is a test notification description')).toBeInTheDocument();
  });

  it('displays correct type for push notification', () => {
    render(<NotificationCard notification={mockNotification} />);
    
    expect(screen.getByText('Notifica Push')).toBeInTheDocument();
  });

  it('displays correct type for email notification', () => {
    const emailNotification = {
      ...mockNotification,
      type: 'email' as const,
    };
    
    render(<NotificationCard notification={emailNotification} />);
    
    expect(screen.getByText('Mail')).toBeInTheDocument();
  });

  it('formats and displays creation date correctly', () => {
    render(<NotificationCard notification={mockNotification} />);
    
    // The date should be formatted in Italian format (DD/MM/YYYY)
    expect(screen.getByText('31/07/2024')).toBeInTheDocument();
    expect(screen.getByText('Data invio:')).toBeInTheDocument();
  });

  it('displays type label', () => {
    render(<NotificationCard notification={mockNotification} />);
    
    expect(screen.getByText('Tipologia:')).toBeInTheDocument();
  });

  it('renders icon button for interaction', () => {
    render(<NotificationCard notification={mockNotification} />);
    
    const iconButton = screen.getByRole('button');
    expect(iconButton).toBeInTheDocument();
  });

  it('handles different creation date formats', () => {
    const notificationWithDifferentDate = {
      ...mockNotification,
      createdAt: '2023-12-25T15:30:00Z',
    };
    
    render(<NotificationCard notification={notificationWithDifferentDate} />);
    
    expect(screen.getByText('25/12/2023')).toBeInTheDocument();
  });

  it('renders all detail sections', () => {
    render(<NotificationCard notification={mockNotification} />);
    
    // Check that both detail rows are present
    expect(screen.getByText('Data invio:')).toBeInTheDocument();
    expect(screen.getByText('Tipologia:')).toBeInTheDocument();
  });

  it('applies correct styling structure', () => {
    render(<NotificationCard notification={mockNotification} />);
    
    // Check that the main container is a Paper component
    const paper = screen.getByText('Test Notification').closest('.MuiPaper-root');
    expect(paper).toBeInTheDocument();
  });
});
