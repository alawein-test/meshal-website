/**
 * @module AuthStore
 * @description Zustand store for authentication state management.
 * Provides centralized auth state with persistence to localStorage.
 *
 * @example
 * ```tsx
 * import { useAuthStore } from '@/stores';
 *
 * function UserProfile() {
 *   const { user, isAuthenticated, logout } = useAuthStore();
 *
 *   if (!isAuthenticated) {
 *     return <LoginPrompt />;
 *   }
 *
 *   return <div>Welcome, {user?.email}</div>;
 * }
 * ```
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Session } from '@supabase/supabase-js';

/**
 * Authentication state interface
 * @interface AuthState
 */
interface AuthState {
  /** Current authenticated user object from Supabase */
  user: User | null;
  /** Current session containing tokens and metadata */
  session: Session | null;
  /** Loading state during auth operations */
  isLoading: boolean;
  /** Computed authentication status */
  isAuthenticated: boolean;
  /**
   * Updates the current user
   * @param user - User object or null
   */
  setUser: (user: User | null) => void;
  /**
   * Updates the current session and derives user from it
   * @param session - Session object or null
   */
  setSession: (session: Session | null) => void;
  /**
   * Updates the loading state
   * @param loading - Loading status
   */
  setLoading: (loading: boolean) => void;
  /**
   * Clears all auth state (user, session, isAuthenticated)
   */
  logout: () => void;
}

/**
 * Zustand store for authentication state
 *
 * @description
 * Manages authentication state across the application with:
 * - Automatic persistence of user data to localStorage
 * - Session management with automatic user derivation
 * - Loading states for async auth operations
 *
 * @example
 * ```tsx
 * // Access auth state
 * const { user, isAuthenticated } = useAuthStore();
 *
 * // Perform logout
 * const { logout } = useAuthStore();
 * logout();
 *
 * // Check loading state
 * const { isLoading } = useAuthStore();
 * if (isLoading) return <Spinner />;
 * ```
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isLoading: true,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setSession: (session) =>
        set({ session, user: session?.user ?? null, isAuthenticated: !!session }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, session: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
