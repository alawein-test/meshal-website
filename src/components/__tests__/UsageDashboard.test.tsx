/**
 * @file UsageDashboard.test.tsx
 * @description Tests for UsageDashboard component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { UsageDashboard } from '../dashboard/UsageDashboard';

// Mock useSubscription hook
vi.mock('@/hooks/useSubscription', () => ({
  useSubscription: () => ({
    currentPlan: {
      id: 'free',
      name: 'Free',
      priceMonthly: 0,
      limits: {
        simulations: 5,
        storage: 100,
        apiCalls: 100,
      },
    },
    status: 'inactive',
    openCustomerPortal: vi.fn(),
    isLoading: false,
  }),
  SUBSCRIPTION_PLANS: [
    {
      id: 'free',
      name: 'Free',
      priceMonthly: 0,
      limits: { simulations: 5, storage: 100, apiCalls: 100 },
    },
  ],
}));

// Mock authStore
vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    user: { id: 'test-user-id' },
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('UsageDashboard', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it('should render subscription card', () => {
    renderWithProviders(<UsageDashboard />);
    expect(screen.getByText('Subscription')).toBeInTheDocument();
  });

  it('should display current plan name', () => {
    renderWithProviders(<UsageDashboard />);
    expect(screen.getByText('Free Plan')).toBeInTheDocument();
  });

  it('should render usage metrics grid', () => {
    renderWithProviders(<UsageDashboard />);
    expect(screen.getByText('Simulations')).toBeInTheDocument();
    expect(screen.getByText('Storage')).toBeInTheDocument();
    expect(screen.getByText('API Calls')).toBeInTheDocument();
  });

  it('should show manage billing button', () => {
    renderWithProviders(<UsageDashboard />);
    expect(screen.getByRole('button', { name: /manage billing/i })).toBeInTheDocument();
  });

  it('should disable manage billing for free plan', () => {
    renderWithProviders(<UsageDashboard />);
    const button = screen.getByRole('button', { name: /manage billing/i });
    expect(button).toBeDisabled();
  });

  it('should show upgrade CTA for free users', () => {
    renderWithProviders(<UsageDashboard />);
    expect(screen.getByText('Upgrade to Pro')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upgrade now/i })).toBeInTheDocument();
  });

  it('should display usage values', () => {
    renderWithProviders(<UsageDashboard />);
    // Check that usage values are displayed (these are mock values from component)
    expect(screen.getByText('3')).toBeInTheDocument(); // Simulations used
    expect(screen.getByText('45')).toBeInTheDocument(); // Storage used
    expect(screen.getByText('234')).toBeInTheDocument(); // API calls used
  });
});
