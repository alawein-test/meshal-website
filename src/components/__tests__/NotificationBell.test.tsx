/**
 * @file NotificationBell.test.tsx
 * @description Tests for NotificationBell component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NotificationBell } from '../notifications/NotificationBell';

const mockMarkAsRead = vi.fn();
const mockMarkAllAsRead = vi.fn();
const mockRemoveNotification = vi.fn();
const mockFetchNotifications = vi.fn();
const mockSubscribeToRealtime = vi.fn(() => () => {});

// Mock the notification store
vi.mock('@/stores/notificationStore', () => ({
  useNotificationStore: () => ({
    notifications: [
      {
        id: 'notif-1',
        type: 'info',
        title: 'Test Notification',
        message: 'This is a test message',
        read: false,
        timestamp: new Date(),
      },
      {
        id: 'notif-2',
        type: 'success',
        title: 'Success Notification',
        message: 'Operation completed',
        read: true,
        timestamp: new Date(),
      },
    ],
    unreadCount: 1,
    isLoading: false,
    fetchNotifications: mockFetchNotifications,
    markAsRead: mockMarkAsRead,
    markAllAsRead: mockMarkAllAsRead,
    removeNotification: mockRemoveNotification,
    subscribeToRealtime: mockSubscribeToRealtime,
  }),
}));

// Mock authStore
vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    user: { id: 'test-user-id' },
  }),
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('NotificationBell', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render bell icon', () => {
    renderWithProviders(<NotificationBell />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should show unread count badge', () => {
    renderWithProviders(<NotificationBell />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should open popover when clicked', () => {
    renderWithProviders(<NotificationBell />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('should display notifications in popover', () => {
    renderWithProviders(<NotificationBell />);
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Test Notification')).toBeInTheDocument();
    expect(screen.getByText('Success Notification')).toBeInTheDocument();
  });

  it('should display notification messages', () => {
    renderWithProviders(<NotificationBell />);
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('This is a test message')).toBeInTheDocument();
    expect(screen.getByText('Operation completed')).toBeInTheDocument();
  });

  it('should show "Mark all read" button when there are unread notifications', () => {
    renderWithProviders(<NotificationBell />);
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Mark all read')).toBeInTheDocument();
  });

  it('should call markAllAsRead when clicking "Mark all read"', () => {
    renderWithProviders(<NotificationBell />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Mark all read'));

    expect(mockMarkAllAsRead).toHaveBeenCalled();
  });

  it('should fetch notifications on mount', () => {
    renderWithProviders(<NotificationBell />);
    expect(mockFetchNotifications).toHaveBeenCalled();
  });

  it('should subscribe to realtime updates on mount', () => {
    renderWithProviders(<NotificationBell />);
    expect(mockSubscribeToRealtime).toHaveBeenCalledWith('test-user-id');
  });
});
