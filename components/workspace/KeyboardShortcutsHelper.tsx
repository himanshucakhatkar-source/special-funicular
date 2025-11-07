import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Keyboard } from 'lucide-react';

interface KeyboardShortcutsHelperProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsHelper({ isOpen, onClose }: KeyboardShortcutsHelperProps) {
  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { keys: ['Ctrl', '1'], description: 'Go to Dashboard' },
        { keys: ['Ctrl', '2'], description: 'Go to Tasks' },
        { keys: ['Ctrl', '3'], description: 'Go to Teams' },
        { keys: ['Ctrl', '4'], description: 'Go to Analytics' },
        { keys: ['Ctrl', '5'], description: 'Go to Recognition' },
        { keys: ['Ctrl', '6'], description: 'Go to Credits' },
      ],
    },
    {
      category: 'Actions',
      items: [
        { keys: ['Ctrl', 'K'], description: 'Open Command Palette' },
        { keys: ['Ctrl', '/'], description: 'Search' },
        { keys: ['Ctrl', ','], description: 'Settings' },
        { keys: ['Ctrl', 'B'], description: 'Toggle Sidebar' },
        { keys: ['?'], description: 'Show Keyboard Shortcuts' },
      ],
    },
    {
      category: 'Quick Actions',
      items: [
        { keys: ['Ctrl', 'N'], description: 'Create New Task' },
        { keys: ['Ctrl', 'R'], description: 'Give Recognition' },
      ],
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Speed up your workflow with these keyboard shortcuts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {shortcuts.map((section) => (
            <div key={section.category}>
              <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.items.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <React.Fragment key={keyIndex}>
                          <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-xs font-medium text-muted-foreground">
                            {key}
                          </kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="text-muted-foreground">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Pro tip:</strong> Press <kbd className="px-1.5 py-0.5 text-xs border rounded bg-background">Ctrl+K</kbd> or{' '}
            <kbd className="px-1.5 py-0.5 text-xs border rounded bg-background">⌘K</kbd> to open the command palette and access everything quickly.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
