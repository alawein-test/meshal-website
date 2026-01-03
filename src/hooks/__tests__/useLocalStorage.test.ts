/**
 * @file useLocalStorage.test.ts
 * @description Unit tests for the useLocalStorage custom hook
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  const TEST_KEY = 'test-key';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial value when no stored value exists', () => {
    // Mock getItem to return null (no stored value)
    vi.mocked(window.localStorage.getItem).mockReturnValue(null);

    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));

    expect(result.current[0]).toBe('initial');
  });

  it('should return stored value when it exists', () => {
    // Mock getItem to return a stored value
    vi.mocked(window.localStorage.getItem).mockReturnValue(JSON.stringify('stored-value'));

    const { result } = renderHook(() => useLocalStorage('stored-key', 'initial'));

    expect(result.current[0]).toBe('stored-value');
  });

  it('should update localStorage when value changes', () => {
    vi.mocked(window.localStorage.getItem).mockReturnValue(null);
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(window.localStorage.setItem).toHaveBeenCalledWith(TEST_KEY, JSON.stringify('new-value'));
  });

  it('should handle object values', () => {
    vi.mocked(window.localStorage.getItem).mockReturnValue(null);
    const initialObject = { name: 'test', count: 0 };
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, initialObject));

    expect(result.current[0]).toEqual(initialObject);

    act(() => {
      result.current[1]({ name: 'updated', count: 1 });
    });

    expect(result.current[0]).toEqual({ name: 'updated', count: 1 });
  });

  it('should handle array values', () => {
    vi.mocked(window.localStorage.getItem).mockReturnValue(null);
    const initialArray = [1, 2, 3];
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, initialArray));

    expect(result.current[0]).toEqual(initialArray);

    act(() => {
      result.current[1]([...result.current[0], 4]);
    });

    expect(result.current[0]).toEqual([1, 2, 3, 4]);
  });

  it('should handle boolean values', () => {
    vi.mocked(window.localStorage.getItem).mockReturnValue(null);
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, false));

    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1](true);
    });

    expect(result.current[0]).toBe(true);
  });

  it('should update value correctly', () => {
    vi.mocked(window.localStorage.getItem).mockReturnValue(null);
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 0));

    act(() => {
      result.current[1](1);
    });

    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1](6);
    });

    expect(result.current[0]).toBe(6);
  });
});
