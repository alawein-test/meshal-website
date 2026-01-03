import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';

/**
 * Authentication result type returned by auth operations
 */
export interface AuthResult {
  /** Whether the operation succeeded */
  success: boolean;
  /** Error message if operation failed */
  error?: string;
  /** Data returned on success (varies by operation) */
  data?: unknown;
}

/**
 * Custom hook for authentication operations.
 *
 * Provides a complete authentication interface including sign in, sign up,
 * sign out, password reset, and password update functionality. Automatically
 * manages session state and handles navigation after auth events.
 *
 * @example
 * ```tsx
 * function LoginPage() {
 *   const { signIn, isLoading, isAuthenticated } = useAuth();
 *
 *   const handleLogin = async (email: string, password: string) => {
 *     const result = await signIn(email, password);
 *     if (!result.success) {
 *       console.error('Login failed:', result.error);
 *     }
 *   };
 *
 *   if (isAuthenticated) {
 *     return <Navigate to="/dashboard" />;
 *   }
 *
 *   return <LoginForm onSubmit={handleLogin} loading={isLoading} />;
 * }
 * ```
 *
 * @returns Authentication state and operations
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const {
    user,
    session,
    isLoading,
    isAuthenticated,
    setSession,
    setLoading,
    logout: clearAuth,
  } = useAuthStore();

  useEffect(() => {
    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setLoading(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setSession, setLoading]);

  /**
   * Sign in with email and password.
   *
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise resolving to auth result
   *
   * @example
   * ```tsx
   * const { signIn } = useAuth();
   * const result = await signIn('user@example.com', 'password123');
   * ```
   */
  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
          toast({
            title: 'Sign in failed',
            description: error.message || 'Invalid email or password',
            variant: 'destructive',
          });
          setLoading(false);
          return { success: false, error: error.message };
        }

        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.',
        });
        const from = (location.state as { from?: Location })?.from?.pathname || '/';
        navigate(from, { replace: true });
        setLoading(false);
        return { success: true, data };
      } catch (error) {
        setLoading(false);
        return { success: false, error: 'An unexpected error occurred' };
      }
    },
    [navigate, location, toast, setLoading]
  );

  /**
   * Create a new user account.
   *
   * @param email - User's email address
   * @param password - User's password (min 6 characters)
   * @param fullName - Optional display name
   * @returns Promise resolving to auth result
   *
   * @example
   * ```tsx
   * const { signUp } = useAuth();
   * const result = await signUp('user@example.com', 'password123', 'John Doe');
   * ```
   */
  const signUp = useCallback(
    async (email: string, password: string, fullName?: string): Promise<AuthResult> => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });

        if (error) {
          toast({
            title: 'Sign up failed',
            description: error.message || 'Could not create account',
            variant: 'destructive',
          });
          setLoading(false);
          return { success: false, error: error.message };
        }

        toast({
          title: 'Account created!',
          description: 'Please check your email to verify your account.',
        });
        setLoading(false);
        return { success: true, data };
      } catch (error) {
        setLoading(false);
        return { success: false, error: 'An unexpected error occurred' };
      }
    },
    [toast, setLoading]
  );

  /**
   * Sign out the current user.
   *
   * Clears the session and navigates to the auth page.
   *
   * @returns Promise resolving to auth result
   *
   * @example
   * ```tsx
   * const { signOut } = useAuth();
   * await signOut();
   * ```
   */
  const signOut = useCallback(async (): Promise<AuthResult> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        toast({
          title: 'Sign out failed',
          description: error.message || 'Could not sign out',
          variant: 'destructive',
        });
        setLoading(false);
        return { success: false, error: error.message };
      }

      clearAuth();
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully.',
      });
      navigate('/auth', { replace: true });
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }, [navigate, toast, clearAuth, setLoading]);

  /**
   * Send a password reset email.
   *
   * @param email - User's email address
   * @returns Promise resolving to auth result
   *
   * @example
   * ```tsx
   * const { resetPassword } = useAuth();
   * await resetPassword('user@example.com');
   * ```
   */
  const resetPassword = useCallback(
    async (email: string): Promise<AuthResult> => {
      setLoading(true);
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email);

        if (error) {
          toast({
            title: 'Reset failed',
            description: error.message || 'Could not send reset link',
            variant: 'destructive',
          });
          setLoading(false);
          return { success: false, error: error.message };
        }

        toast({
          title: 'Reset link sent',
          description: 'Please check your email for the password reset link.',
        });
        setLoading(false);
        return { success: true };
      } catch (error) {
        setLoading(false);
        return { success: false, error: 'An unexpected error occurred' };
      }
    },
    [toast, setLoading]
  );

  /**
   * Update the current user's password.
   *
   * Requires an active session.
   *
   * @param newPassword - The new password (min 6 characters)
   * @returns Promise resolving to auth result
   *
   * @example
   * ```tsx
   * const { updatePassword } = useAuth();
   * await updatePassword('newSecurePassword123');
   * ```
   */
  const updatePassword = useCallback(
    async (newPassword: string): Promise<AuthResult> => {
      setLoading(true);
      try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
          toast({
            title: 'Update failed',
            description: error.message || 'Could not update password',
            variant: 'destructive',
          });
          setLoading(false);
          return { success: false, error: error.message };
        }

        toast({
          title: 'Password updated',
          description: 'Your password has been updated successfully.',
        });
        setLoading(false);
        return { success: true };
      } catch (error) {
        setLoading(false);
        return { success: false, error: 'An unexpected error occurred' };
      }
    },
    [toast, setLoading]
  );

  return {
    /** Current authenticated user object, null if not authenticated */
    user,
    /** Current session with tokens, null if not authenticated */
    session,
    /** Whether an auth operation is in progress */
    isLoading,
    /** Whether the user is currently authenticated */
    isAuthenticated,
    /** Sign in with email/password */
    signIn,
    /** Create a new account */
    signUp,
    /** Sign out the current user */
    signOut,
    /** Send password reset email */
    resetPassword,
    /** Update current user's password */
    updatePassword,
  };
};
