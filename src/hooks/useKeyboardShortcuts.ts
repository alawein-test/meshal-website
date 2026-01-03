import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : true;
        const metaMatch = shortcut.meta ? event.metaKey : true;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;

        if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch) {
          event.preventDefault();
          shortcut.action();
          return;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export function useGlobalShortcuts() {
  const navigate = useNavigate();

  const shortcuts: ShortcutConfig[] = [
    { key: 'h', action: () => navigate('/'), description: 'Go to Home' },
    { key: 'p', action: () => navigate('/portfolio'), description: 'Go to Portfolio' },
    { key: 'd', action: () => navigate('/projects'), description: 'Go to Projects Hub' },
    { key: '1', action: () => navigate('/projects/simcore'), description: 'Open SimCore' },
    { key: '2', action: () => navigate('/projects/qmlab'), description: 'Open QMLab' },
    { key: '3', action: () => navigate('/projects/talai'), description: 'Open TalAI' },
    { key: '4', action: () => navigate('/projects/mezan'), description: 'Open MEZAN' },
    { key: '5', action: () => navigate('/projects/optilibria'), description: 'Open OptiLibria' },
    {
      key: '?',
      shift: true,
      action: () => {
        // Dispatches custom event for KeyboardShortcutsHelp modal
        window.dispatchEvent(new CustomEvent('toggle-shortcuts-help'));
      },
      description: 'Show keyboard shortcuts',
    },
  ];

  useKeyboardShortcuts(shortcuts);

  return shortcuts;
}

export const shortcutsList = [
  { keys: ['⌘', 'K'], description: 'Open command palette' },
  { keys: ['H'], description: 'Go to Home' },
  { keys: ['P'], description: 'Go to Portfolio' },
  { keys: ['D'], description: 'Go to Projects Hub' },
  { keys: ['1-5'], description: 'Open platform 1-5' },
  { keys: ['?'], description: 'Show shortcuts help' },
];
