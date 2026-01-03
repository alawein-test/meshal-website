/**
 * @module NotificationStore
 * @description Zustand store for managing in-app notifications.
 * Provides a centralized notification system with read/unread tracking.
 * Supports both local and Supabase-persisted notifications with real-time sync.
 *
 * @example
 * ```tsx
 * import { useNotificationStore } from '@/stores';
 *
 * function NotificationBell() {
 *   const { unreadCount, notifications, markAllAsRead } = useNotificationStore();
 *
 *   return (
 *     <div>
 *       <Badge count={unreadCount} />
 *       <NotificationList items={notifications} />
 *     </div>
 *   );
 * }
 * ```
 */
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

/** Category of notification for styling and filtering */
export type NotificationCategory = 'info' | 'success' | 'warning' | 'error' | 'system';

/**
 * Notification entity interface
 * @interface Notification
 */
export interface Notification {
  /** Unique identifier for the notification */
  id: string;
  /** User ID (for persisted notifications) */
  user_id?: string;
  /** Notification severity/type */
  type: 'success' | 'error' | 'info' | 'warning';
  /** Category for filtering */
  category?: NotificationCategory;
  /** Short title for the notification */
  title: string;
  /** Optional detailed message */
  message?: string;
  /** When the notification was created */
  timestamp: Date;
  /** Whether the notification has been read */
  read: boolean;
  /** Optional action button configuration */
  action?: {
    /** Button label text */
    label: string;
    /** Navigation URL when clicked */
    href: string;
  };
  /** Optional action URL (from database) */
  action_url?: string;
  /** Optional action label (from database) */
  action_label?: string;
  /** When the notification was read */
  read_at?: string;
  /** When the notification expires */
  expires_at?: string;
  /** Source: 'local' for ephemeral, 'persistent' for database-backed */
  source?: 'local' | 'persistent';
}

/**
 * Notification store state interface
 * @interface NotificationState
 */
interface NotificationState {
  /** Array of all notifications (max 50, newest first) */
  notifications: Notification[];
  /** Count of unread notifications */
  unreadCount: number;
  /** Loading state for async operations */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /**
   * Adds a new notification to the store (local only, ephemeral)
   * @param notification - Notification data without id, timestamp, and read status
   */
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  /**
   * Marks a specific notification as read
   * @param id - Notification ID to mark as read
   */
  markAsRead: (id: string) => void;
  /**
   * Marks all notifications as read and resets unread count
   */
  markAllAsRead: () => void;
  /**
   * Removes a notification from the store
   * @param id - Notification ID to remove
   */
  removeNotification: (id: string) => void;
  /**
   * Clears all notifications and resets unread count
   */
  clearAll: () => void;
  /**
   * Fetches persisted notifications from Supabase
   */
  fetchNotifications: () => Promise<void>;
  /**
   * Subscribes to real-time notification updates
   * @param userId - User ID to subscribe for
   * @returns Unsubscribe function
   */
  subscribeToRealtime: (userId: string) => () => void;
}

/**
 * Zustand store for notification management
 *
 * @description
 * Manages application notifications with:
 * - Automatic ID and timestamp generation
 * - Read/unread status tracking
 * - Maximum 50 notifications (FIFO)
 * - Bulk operations (mark all read, clear all)
 *
 * @example
 * ```tsx
 * // Add a notification
 * const { addNotification } = useNotificationStore();
 * addNotification({
 *   type: 'success',
 *   title: 'Simulation Complete',
 *   message: 'Your simulation has finished running.',
 *   action: { label: 'View Results', href: '/results' }
 * });
 *
 * // Mark as read
 * const { markAsRead } = useNotificationStore();
 * markAsRead(notificationId);
 *
 * // Clear all
 * const { clearAll } = useNotificationStore();
 * clearAll();
 * ```
 */
export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false,
      source: 'local',
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications].slice(0, 50),
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: async (id) => {
    const notification = get().notifications.find((n) => n.id === id);

    // Update Supabase if persisted notification
    if (notification?.source === 'persistent') {
      try {
        await supabase
          .from('notifications')
          .update({ is_read: true, read_at: new Date().toISOString() })
          .eq('id', id);
      } catch (error) {
        console.error('Failed to mark notification as read in DB:', error);
      }
    }

    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllAsRead: async () => {
    // Update all persistent notifications in Supabase
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('is_read', false);
    } catch (error) {
      console.error('Failed to mark all notifications as read in DB:', error);
    }

    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  removeNotification: async (id) => {
    const notification = get().notifications.find((n) => n.id === id);

    // Delete from Supabase if persisted notification
    if (notification?.source === 'persistent') {
      try {
        await supabase.from('notifications').delete().eq('id', id);
      } catch (error) {
        console.error('Failed to delete notification from DB:', error);
      }
    }

    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      unreadCount:
        notification && !notification.read ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
    }));
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  },

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      interface DbNotificationRecord {
        id: string;
        user_id: string;
        category: NotificationCategory;
        title: string;
        message?: string;
        created_at: string;
        is_read: boolean;
        action_url?: string;
        action_label?: string;
        read_at?: string;
        expires_at?: string;
      }
      const dbNotifications: Notification[] = ((data as DbNotificationRecord[]) || []).map((n) => ({
        id: n.id,
        user_id: n.user_id,
        type: n.category === 'system' ? 'info' : n.category,
        category: n.category,
        title: n.title,
        message: n.message,
        timestamp: new Date(n.created_at),
        read: n.is_read,
        action: n.action_url ? { label: n.action_label || 'View', href: n.action_url } : undefined,
        action_url: n.action_url,
        action_label: n.action_label,
        read_at: n.read_at,
        expires_at: n.expires_at,
        source: 'persistent' as const,
      }));

      // Merge with existing local notifications
      const localNotifications = get().notifications.filter((n) => n.source === 'local');
      const allNotifications = [...localNotifications, ...dbNotifications]
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 50);

      const unreadCount = allNotifications.filter((n) => !n.read).length;

      set({ notifications: allNotifications, unreadCount, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      set({ error: 'Failed to load notifications', isLoading: false });
    }
  },

  subscribeToRealtime: (userId: string) => {
    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          interface RealtimeNotification {
            id: string;
            user_id: string;
            category: NotificationCategory;
            title: string;
            message?: string;
            created_at: string;
            action_url?: string;
            action_label?: string;
          }
          const n = payload.new as RealtimeNotification;
          const newNotification: Notification = {
            id: n.id,
            user_id: n.user_id,
            type: n.category === 'system' ? 'info' : n.category,
            category: n.category,
            title: n.title,
            message: n.message,
            timestamp: new Date(n.created_at),
            read: false,
            action: n.action_url
              ? { label: n.action_label || 'View', href: n.action_url }
              : undefined,
            source: 'persistent',
          };

          set((state) => ({
            notifications: [newNotification, ...state.notifications].slice(0, 50),
            unreadCount: state.unreadCount + 1,
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
}));
