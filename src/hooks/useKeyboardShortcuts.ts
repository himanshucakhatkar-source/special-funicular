import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const matchingShortcut = shortcuts.find(shortcut => {
      const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatches = shortcut.ctrl ? event.ctrlKey : !event.ctrlKey;
      const shiftMatches = shortcut.shift ? event.shiftKey : !event.shiftKey;
      const altMatches = shortcut.alt ? event.altKey : !event.altKey;
      const metaMatches = shortcut.meta ? event.metaKey : !event.metaKey;

      return keyMatches && ctrlMatches && shiftMatches && altMatches && metaMatches;
    });

    if (matchingShortcut) {
      event.preventDefault();
      matchingShortcut.action();
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
}

// Global keyboard shortcuts hook
export function useGlobalShortcuts(
  onCommandPalette: () => void,
  onSearch: () => void,
  onSettings: () => void
) {
  useKeyboardShortcuts([
    {
      key: 'k',
      meta: true, // Cmd on Mac, Ctrl on Windows
      description: 'Open command palette',
      action: onCommandPalette,
    },
    {
      key: 'k',
      ctrl: true,
      description: 'Open command palette (Windows)',
      action: onCommandPalette,
    },
    {
      key: '/',
      meta: true,
      description: 'Search',
      action: onSearch,
    },
    {
      key: ',',
      meta: true,
      description: 'Open settings',
      action: onSettings,
    },
  ]);
}
