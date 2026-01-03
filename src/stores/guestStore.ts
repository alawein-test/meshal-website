/**
 * @module GuestStore
 * @description Zustand store for managing guest/demo mode state.
 * Allows users to explore the platform without authentication.
 *
 * @example
 * ```tsx
 * import { useGuestStore } from '@/stores';
 *
 * function AuthPage() {
 *   const { enableGuestMode } = useGuestStore();
 *
 *   return (
 *     <Button onClick={enableGuestMode}>
 *       Continue as Guest
 *     </Button>
 *   );
 * }
 * ```
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Guest mode state interface
 * @interface GuestState
 */
interface GuestState {
  /** Whether guest mode is currently active */
  isGuestMode: boolean;
  /**
   * Enables guest mode, allowing access without authentication
   */
  enableGuestMode: () => void;
  /**
   * Disables guest mode, typically when user signs in
   */
  disableGuestMode: () => void;
}

/**
 * Zustand store for guest mode management
 *
 * @description
 * Manages guest/demo mode with:
 * - Persistent state across sessions via localStorage
 * - Simple enable/disable API
 * - Integration with auth flows
 *
 * @example
 * ```tsx
 * // Check if in guest mode
 * const { isGuestMode } = useGuestStore();
 *
 * if (isGuestMode) {
 *   return <GuestBanner />;
 * }
 *
 * // Enable guest mode
 * const { enableGuestMode } = useGuestStore();
 * enableGuestMode();
 * navigate('/projects');
 *
 * // Disable on sign in
 * const { disableGuestMode } = useGuestStore();
 * await signIn(email, password);
 * disableGuestMode();
 * ```
 */
export const useGuestStore = create<GuestState>()(
  persist(
    (set) => ({
      isGuestMode: false,
      enableGuestMode: () => set({ isGuestMode: true }),
      disableGuestMode: () => set({ isGuestMode: false }),
    }),
    {
      name: 'guest-storage',
    }
  )
);
