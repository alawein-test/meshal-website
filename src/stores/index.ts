/**
 * @module Stores
 * @description Zustand state management stores for the platform
 *
 * This module exports all Zustand stores used across the application
 * for centralized state management including authentication, notifications,
 * and guest mode.
 *
 * @example
 * ```tsx
 * import { useAuthStore, useNotificationStore, useGuestStore } from '@/stores';
 *
 * function App() {
 *   const { user, isAuthenticated } = useAuthStore();
 *   const { notifications, addNotification } = useNotificationStore();
 *   const { isGuestMode } = useGuestStore();
 *
 *   // Use stores...
 * }
 * ```
 */

export { useAuthStore } from './authStore';
export { useGuestStore } from './guestStore';
export { useNotificationStore } from './notificationStore';
export { useAIConsentStore } from './aiConsentStore';
export type { Notification } from './notificationStore';
export type { AIConsentLevel } from './aiConsentStore';
