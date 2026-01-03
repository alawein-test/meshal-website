import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AIConsentLevel = 'accept_all' | 'accept_anonymized' | 'decline' | null;

interface AIConsentState {
  consentLevel: AIConsentLevel;
  hasSeenPopup: boolean;
  consentDate: string | null;
  setConsentLevel: (level: AIConsentLevel) => void;
  setHasSeenPopup: (seen: boolean) => void;
  reset: () => void;
}

/**
 * Store for AI training consent preferences
 * Persists to localStorage for GDPR compliance
 */
export const useAIConsentStore = create<AIConsentState>()(
  persist(
    (set) => ({
      consentLevel: null,
      hasSeenPopup: false,
      consentDate: null,
      setConsentLevel: (level) =>
        set({
          consentLevel: level,
          consentDate: level ? new Date().toISOString() : null,
        }),
      setHasSeenPopup: (seen) => set({ hasSeenPopup: seen }),
      reset: () =>
        set({
          consentLevel: null,
          hasSeenPopup: false,
          consentDate: null,
        }),
    }),
    {
      name: 'ai-consent-storage',
    }
  )
);
