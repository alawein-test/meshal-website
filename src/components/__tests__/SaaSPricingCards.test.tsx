/**
 * @file SaaSPricingCards.test.tsx
 * @description Tests for SaaSPricingCards component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { SaaSPricingCards } from '../pricing/SaaSPricingCards';

const mockCreateCheckout = vi.fn();
const mockNavigate = vi.fn();

// Mock useSubscription hook
vi.mock('@/hooks/useSubscription', () => ({
  useSubscription: () => ({
    currentPlan: { id: 'free', name: 'Free' },
    createCheckout: mockCreateCheckout,
    isLoading: false,
  }),
  SUBSCRIPTION_PLANS: [
    {
      id: 'free',
      name: 'Free',
      description: 'For individuals getting started',
      priceMonthly: 0,
      priceAnnual: 0,
      features: ['5 simulations/month', '100MB storage'],
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For professionals',
      priceMonthly: 49,
      priceAnnual: 470,
      features: ['Unlimited simulations', '10GB storage'],
    },
    {
      id: 'team',
      name: 'Team',
      description: 'For teams',
      priceMonthly: 199,
      priceAnnual: 1910,
      features: ['Everything in Pro', 'Team features'],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations',
      priceMonthly: -1,
      priceAnnual: -1,
      features: ['Custom solutions', 'Dedicated support'],
    },
  ],
}));

// Mock authStore
vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    isAuthenticated: true,
  }),
}));

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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

describe('SaaSPricingCards', () => {
  beforeEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
  });

  it('should render all pricing plans', () => {
    renderWithProviders(<SaaSPricingCards />);
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
  });

  it('should render billing toggle by default', () => {
    renderWithProviders(<SaaSPricingCards />);
    expect(screen.getByText('Monthly')).toBeInTheDocument();
    expect(screen.getByText('Annual')).toBeInTheDocument();
  });

  it('should hide billing toggle when showToggle is false', () => {
    renderWithProviders(<SaaSPricingCards showToggle={false} />);
    expect(screen.queryByText('Monthly')).not.toBeInTheDocument();
  });

  it('should show "Most Popular" badge on highlighted plan', () => {
    renderWithProviders(<SaaSPricingCards highlightPlan="pro" />);
    expect(screen.getByText('Most Popular')).toBeInTheDocument();
  });

  it('should display plan features', () => {
    renderWithProviders(<SaaSPricingCards />);
    expect(screen.getByText('5 simulations/month')).toBeInTheDocument();
    expect(screen.getByText('Unlimited simulations')).toBeInTheDocument();
  });

  it('should show "Current Plan" for current plan', () => {
    renderWithProviders(<SaaSPricingCards />);
    expect(screen.getByText('Current Plan')).toBeInTheDocument();
  });

  it('should show "Contact Sales" for enterprise plan', () => {
    renderWithProviders(<SaaSPricingCards />);
    expect(screen.getByText('Contact Sales')).toBeInTheDocument();
  });

  it('should toggle between monthly and annual pricing', () => {
    renderWithProviders(<SaaSPricingCards />);
    const toggle = screen.getByRole('switch');

    // Default is annual (checked)
    expect(toggle).toBeChecked();

    // Toggle to monthly
    fireEvent.click(toggle);
    expect(toggle).not.toBeChecked();
  });

  it('should call createCheckout when selecting a plan', async () => {
    renderWithProviders(<SaaSPricingCards />);
    const proButton = screen.getAllByText('Get Started')[0];
    fireEvent.click(proButton);

    expect(mockCreateCheckout).toHaveBeenCalledWith('pro', 'annual');
  });
});
