/**
 * @file FeatureErrorBoundary.test.tsx
 * @description Tests for FeatureErrorBoundary component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FeatureErrorBoundary } from '../shared/FeatureErrorBoundary';

// Component that throws an error
const ThrowingComponent = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>Content rendered successfully</div>;
};

// Suppress console.error for cleaner test output
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('FeatureErrorBoundary', () => {
  it('should render children when no error occurs', () => {
    render(
      <FeatureErrorBoundary featureName="Test Feature">
        <div>Child content</div>
      </FeatureErrorBoundary>
    );

    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('should catch errors and display error UI', () => {
    render(
      <FeatureErrorBoundary featureName="Test Feature">
        <ThrowingComponent />
      </FeatureErrorBoundary>
    );

    expect(screen.getByText('Test Feature Error')).toBeInTheDocument();
    expect(screen.getByText(/This component encountered an error/)).toBeInTheDocument();
  });

  it('should display the feature name in error message', () => {
    render(
      <FeatureErrorBoundary featureName="Dashboard Widget">
        <ThrowingComponent />
      </FeatureErrorBoundary>
    );

    expect(screen.getByText('Dashboard Widget Error')).toBeInTheDocument();
  });

  it('should show retry button', () => {
    render(
      <FeatureErrorBoundary featureName="Test Feature">
        <ThrowingComponent />
      </FeatureErrorBoundary>
    );

    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('should call onRetry callback when retry button is clicked', () => {
    const onRetry = vi.fn();

    render(
      <FeatureErrorBoundary featureName="Test Feature" onRetry={onRetry}>
        <ThrowingComponent />
      </FeatureErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /try again/i }));

    expect(onRetry).toHaveBeenCalled();
  });

  it('should render compact mode when compact prop is true', () => {
    render(
      <FeatureErrorBoundary featureName="Test Feature" compact>
        <ThrowingComponent />
      </FeatureErrorBoundary>
    );

    expect(screen.getByText('Test Feature failed to load')).toBeInTheDocument();
    // Compact mode should not show the full error card title
    expect(screen.queryByText('Test Feature Error')).not.toBeInTheDocument();
  });

  it('should show technical details when showDetails is true', () => {
    render(
      <FeatureErrorBoundary featureName="Test Feature" showDetails>
        <ThrowingComponent />
      </FeatureErrorBoundary>
    );

    expect(screen.getByText('Technical Details')).toBeInTheDocument();
  });

  it('should hide technical details when showDetails is false', () => {
    render(
      <FeatureErrorBoundary featureName="Test Feature" showDetails={false}>
        <ThrowingComponent />
      </FeatureErrorBoundary>
    );

    expect(screen.queryByText('Technical Details')).not.toBeInTheDocument();
  });

  it('should log error to console', () => {
    render(
      <FeatureErrorBoundary featureName="Test Feature">
        <ThrowingComponent />
      </FeatureErrorBoundary>
    );

    expect(console.error).toHaveBeenCalled();
  });
});
