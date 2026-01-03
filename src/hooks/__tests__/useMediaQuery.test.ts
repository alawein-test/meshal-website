/**
 * @file useMediaQuery.test.ts
 * @description Unit tests for the useMediaQuery custom hook
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMediaQuery, useIsMobile, useIsTablet, useIsDesktop } from '../useMediaQuery';

describe('useMediaQuery', () => {
  const createMatchMedia = (matches: boolean) => {
    return (query: string): MediaQueryList => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(() => true),
    });
  };

  beforeEach(() => {
    window.matchMedia = createMatchMedia(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return false when media query does not match', () => {
    window.matchMedia = createMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(false);
  });

  it('should return true when media query matches', () => {
    window.matchMedia = createMatchMedia(true);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(true);
  });

  it('should call matchMedia with the correct query', () => {
    const mockMatchMedia = vi.fn(createMatchMedia(false));
    window.matchMedia = mockMatchMedia;

    renderHook(() => useMediaQuery('(max-width: 1024px)'));

    expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 1024px)');
  });
});

describe('useIsMobile', () => {
  beforeEach(() => {
    window.matchMedia = (query: string): MediaQueryList => ({
      matches: query.includes('767px'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(() => true),
    });
  });

  it('should return boolean indicating mobile viewport', () => {
    const { result } = renderHook(() => useIsMobile());

    expect(typeof result.current).toBe('boolean');
  });
});

describe('useIsTablet', () => {
  beforeEach(() => {
    window.matchMedia = (): MediaQueryList => ({
      matches: false,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(() => true),
    });
  });

  it('should return boolean indicating tablet viewport', () => {
    const { result } = renderHook(() => useIsTablet());

    expect(typeof result.current).toBe('boolean');
  });
});

describe('useIsDesktop', () => {
  beforeEach(() => {
    window.matchMedia = (): MediaQueryList => ({
      matches: true,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(() => true),
    });
  });

  it('should return boolean indicating desktop viewport', () => {
    const { result } = renderHook(() => useIsDesktop());

    expect(typeof result.current).toBe('boolean');
  });
});
