/**
 * @file NewUserOnboarding.test.tsx
 * @description Tests for NewUserOnboarding component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NewUserOnboarding } from '../onboarding/NewUserOnboarding';

// Mock framer-motion to disable animations in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

const mockNavigate = vi.fn();

// Mock localStorage
let mockOnboardingComplete = false;
vi.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: () => [
    mockOnboardingComplete,
    vi.fn((val) => {
      mockOnboardingComplete = val;
    }),
  ],
}));

// Mock authStore
vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    user: { id: 'test-user-id' },
    isAuthenticated: true,
  }),
}));

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    }),
  },
}));

// Mock sonner
vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('NewUserOnboarding', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOnboardingComplete = false;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not render when onboarding is complete', () => {
    mockOnboardingComplete = true;
    renderWithProviders(<NewUserOnboarding />);
    expect(screen.queryByText('Welcome to Alawein Platform')).not.toBeInTheDocument();
  });

  it('should render after delay for new authenticated users', async () => {
    mockOnboardingComplete = false;
    renderWithProviders(<NewUserOnboarding />);

    // Should not be visible immediately
    expect(screen.queryByText('Welcome to Alawein Platform')).not.toBeInTheDocument();

    // Advance timer
    await act(async () => {
      vi.advanceTimersByTime(1100);
    });

    expect(screen.getByText('Welcome to Alawein Platform')).toBeInTheDocument();
  });

  it('should show welcome step initially', async () => {
    mockOnboardingComplete = false;
    renderWithProviders(<NewUserOnboarding />);

    await act(async () => {
      vi.advanceTimersByTime(1100);
    });

    expect(screen.getByText('Welcome to Alawein Platform')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
  });

  it('should navigate to profile step when clicking Get Started', async () => {
    mockOnboardingComplete = false;
    renderWithProviders(<NewUserOnboarding />);

    await act(async () => {
      vi.advanceTimersByTime(1100);
    });

    fireEvent.click(screen.getByRole('button', { name: /get started/i }));

    expect(screen.getByText('Tell us about yourself')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
  });

  it('should allow input in profile fields', async () => {
    mockOnboardingComplete = false;
    renderWithProviders(<NewUserOnboarding />);

    await act(async () => {
      vi.advanceTimersByTime(1100);
    });

    fireEvent.click(screen.getByRole('button', { name: /get started/i }));

    const nameInput = screen.getByLabelText('Full Name');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });

    expect(nameInput).toHaveValue('John Doe');
  });

  it('should navigate to platforms step', async () => {
    mockOnboardingComplete = false;
    renderWithProviders(<NewUserOnboarding />);

    await act(async () => {
      vi.advanceTimersByTime(1100);
    });

    // Go to profile
    fireEvent.click(screen.getByRole('button', { name: /get started/i }));

    // Go to platforms
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    expect(screen.getByText('Choose your platforms')).toBeInTheDocument();
    expect(screen.getByText('SimCore')).toBeInTheDocument();
    expect(screen.getByText('MEZAN')).toBeInTheDocument();
    expect(screen.getByText('TalAI')).toBeInTheDocument();
  });

  it('should show close button for skipping', async () => {
    mockOnboardingComplete = false;
    renderWithProviders(<NewUserOnboarding />);

    await act(async () => {
      vi.advanceTimersByTime(1100);
    });

    expect(screen.getByRole('button', { name: /skip onboarding/i })).toBeInTheDocument();
  });
});
