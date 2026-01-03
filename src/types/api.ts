/**
 * @module API Types
 * @description Shared type definitions for API responses and errors
 */

/**
 * Standard API error structure
 */
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  status: number;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  error: ApiError | null;
}

/**
 * Database record base fields
 */
export interface DatabaseRecord {
  id: string;
  created_at: string;
  updated_at?: string;
}

/**
 * User-owned database record
 */
export interface UserOwnedRecord extends DatabaseRecord {
  user_id: string;
}

/**
 * Supabase database response type
 */
export interface SupabaseResponse<T> {
  data: T | null;
  error: {
    message: string;
    details?: string;
    hint?: string;
    code?: string;
  } | null;
}

/**
 * Analytics event types
 */
export type AnalyticsEventType =
  | 'page_view'
  | 'click'
  | 'scroll'
  | 'form_submit'
  | 'error'
  | 'custom';

/**
 * Analytics event data structure
 */
export interface AnalyticsEventData {
  type: AnalyticsEventType;
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  metadata?: Record<string, string | number | boolean>;
  timestamp: string;
  sessionId?: string;
  userId?: string;
  path?: string;
  referrer?: string;
}

/**
 * Visitor tracking event
 */
export interface VisitorTrackingEvent {
  type: 'pageview' | 'click' | 'scroll' | 'engagement';
  path: string;
  timestamp: string;
  data?: {
    scrollDepth?: number;
    clickTarget?: string;
    duration?: number;
    [key: string]: string | number | boolean | undefined;
  };
}

/**
 * Scanner result types
 */
export type ScannerResultType = 'qr' | 'barcode' | 'text' | 'unknown';

export interface ScannerResult {
  type: ScannerResultType;
  value: string;
  format?: string;
  confidence?: number;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

/**
 * Waitlist entry from database
 */
export interface WaitlistEntryRecord extends UserOwnedRecord {
  email: string;
  project_id: string;
  product_id: string | null;
  position: number;
  status: 'waiting' | 'invited' | 'converted' | 'declined';
  metadata: Record<string, string | number | boolean>;
  invited_at: string | null;
  converted_at: string | null;
}

/**
 * Notification from database
 */
export interface NotificationRecord extends UserOwnedRecord {
  title: string;
  message?: string;
  category: 'info' | 'success' | 'warning' | 'error' | 'system';
  is_read: boolean;
  read_at?: string;
  expires_at?: string;
  action_url?: string;
  action_label?: string;
}

/**
 * Email notification preferences
 */
export interface EmailNotificationPreferences {
  marketing: boolean;
  product_updates: boolean;
  security_alerts: boolean;
  weekly_digest: boolean;
}

/**
 * Subscription data from database
 */
export interface SubscriptionRecord extends UserOwnedRecord {
  tier: 'free' | 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  current_period_start?: string;
  current_period_end?: string;
}

/**
 * Type guard for API errors
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ApiError).message === 'string'
  );
}

/**
 * Extract error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}
