/**
 * @module Hooks
 * @description Custom React hooks for the Alawein Platform
 *
 * This module exports all custom hooks used across the platform,
 * including authentication, data fetching, real-time subscriptions,
 * and utility hooks.
 *
 * @example
 * ```tsx
 * import { useAuth, useSimulations, useToast } from '@/hooks';
 *
 * function Dashboard() {
 *   const { user, isAuthenticated } = useAuth();
 *   const { simulations, createSimulation } = useSimulations();
 *   const { toast } = useToast();
 *
 *   // Use hooks...
 * }
 * ```
 */

// Storage & Preferences
export { useLocalStorage } from './useLocalStorage';

// Responsive Design
export { useMediaQuery, useIsMobile, useIsTablet, useIsDesktop } from './useMediaQuery';
export { useIsMobile as useMobile } from './use-mobile';

// Notifications
export { useToast } from './use-toast';

// Authentication
export { useAuth } from './useAuth';

// Data Hooks - SimCore
export { useSimulations } from './useSimulations';
export type { Simulation } from './useSimulations';

// Data Hooks - QMLab & TalAI
export { useQMExperiments, useTalAIExperiments } from './useExperiments';
export type { QMExperiment, TalAIExperiment } from './useExperiments';

// Data Hooks - MEZAN
export { useWorkflows } from './useWorkflows';
export type { Workflow } from './useWorkflows';

// Data Hooks - OptiLibria
export { useOptimizationRuns } from './useOptimizationRuns';

// Real-time Subscriptions
export {
  useRealtimeSimulations,
  useRealtimeExperiments,
  useRealtimeWorkflows,
  useRealtimeOptimizationRuns,
} from './useRealtimeSimulations';

// Keyboard & Navigation
export { useKeyboardShortcuts, useGlobalShortcuts, shortcutsList } from './useKeyboardShortcuts';
export { useArrowNavigation } from './useArrowNavigation';
export { useFocusTrap } from './useFocusTrap';

// Visitor Tracking
export { useVisitorTracking } from './useVisitorTracking';

// Waitlist
export { useWaitlist } from './useWaitlist';
export type { WaitlistEntry, WaitlistStats } from './useWaitlist';

// Unified Scanner
export { useUnifiedScanner } from './useUnifiedScanner';

// Accessibility
export { useReducedMotion } from './useReducedMotion';

// Subscription & Billing
export { useSubscription, SUBSCRIPTION_PLANS } from './useSubscription';
export type {
  SubscriptionTier,
  SubscriptionStatus,
  SubscriptionPlan,
  UseSubscriptionReturn,
} from './useSubscription';

// Multi-Tenant / Organizations
export { useOrganization } from './useOrganization';
export type {
  Organization,
  OrganizationMember,
  OrgRole,
  CreateOrgParams,
  InviteMemberParams,
} from './useOrganization';

// Analytics
export { useAnalytics } from './useAnalytics';
export type {
  AnalyticsEvent,
  AnalyticsEventCategory,
  AnalyticsConfig,
  UseAnalyticsReturn,
} from './useAnalytics';

// API Key Management
export { useApiKeys } from './useApiKeys';
export type { ApiKey, ApiKeyScope, ApiKeyUsageStats, CreateApiKeyParams } from './useApiKeys';
