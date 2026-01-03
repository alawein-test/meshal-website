import { useCallback, useEffect, useRef } from 'react';

interface UseArrowNavigationOptions {
  /** Selector for navigable items within the container */
  selector?: string;
  /** Whether navigation wraps around at edges */
  wrap?: boolean;
  /** Orientation of the navigation */
  orientation?: 'horizontal' | 'vertical' | 'grid';
  /** Number of columns for grid navigation */
  columns?: number;
}

/**
 * Hook for arrow key navigation within a container.
 * Enables keyboard navigation for lists, grids, and menus.
 */
export function useArrowNavigation<T extends HTMLElement>({
  selector = '[data-navigable]',
  wrap = true,
  orientation = 'vertical',
  columns = 1,
}: UseArrowNavigationOptions = {}) {
  const containerRef = useRef<T>(null);

  const getNavigableElements = useCallback(() => {
    if (!containerRef.current) return [];
    return Array.from(containerRef.current.querySelectorAll<HTMLElement>(selector));
  }, [selector]);

  const focusElement = useCallback((element: HTMLElement | null) => {
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const elements = getNavigableElements();
      if (elements.length === 0) return;

      const currentIndex = elements.findIndex((el) => el === document.activeElement);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

      switch (event.key) {
        case 'ArrowUp':
          if (orientation === 'vertical' || orientation === 'grid') {
            event.preventDefault();
            nextIndex = orientation === 'grid' ? currentIndex - columns : currentIndex - 1;
          }
          break;
        case 'ArrowDown':
          if (orientation === 'vertical' || orientation === 'grid') {
            event.preventDefault();
            nextIndex = orientation === 'grid' ? currentIndex + columns : currentIndex + 1;
          }
          break;
        case 'ArrowLeft':
          if (orientation === 'horizontal' || orientation === 'grid') {
            event.preventDefault();
            nextIndex = currentIndex - 1;
          }
          break;
        case 'ArrowRight':
          if (orientation === 'horizontal' || orientation === 'grid') {
            event.preventDefault();
            nextIndex = currentIndex + 1;
          }
          break;
        case 'Home':
          event.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          nextIndex = elements.length - 1;
          break;
        default:
          return;
      }

      // Handle wrapping
      if (wrap) {
        if (nextIndex < 0) nextIndex = elements.length - 1;
        if (nextIndex >= elements.length) nextIndex = 0;
      } else {
        nextIndex = Math.max(0, Math.min(nextIndex, elements.length - 1));
      }

      focusElement(elements[nextIndex]);
    },
    [getNavigableElements, focusElement, orientation, columns, wrap]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { containerRef, getNavigableElements };
}

export default useArrowNavigation;
