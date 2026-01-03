import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Kbd } from '@/components/ui/kbd';

const shortcuts = [
  {
    category: 'Navigation',
    items: [
      { keys: ['⌘/Ctrl', 'K'], description: 'Open command palette' },
      { keys: ['H'], description: 'Go to Home' },
      { keys: ['P'], description: 'Go to Portfolio' },
      { keys: ['D'], description: 'Go to Projects Hub' },
    ],
  },
  {
    category: 'Platforms',
    items: [
      { keys: ['1'], description: 'Open SimCore' },
      { keys: ['2'], description: 'Open QMLab' },
      { keys: ['3'], description: 'Open TalAI' },
      { keys: ['4'], description: 'Open MEZAN' },
      { keys: ['5'], description: 'Open OptiLibria' },
    ],
  },
  {
    category: 'General',
    items: [
      { keys: ['Shift', '?'], description: 'Show this help' },
      { keys: ['Esc'], description: 'Close dialogs' },
    ],
  },
];

export function KeyboardShortcutsHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {shortcuts.map((section) => (
            <div key={section.category}>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">{section.category}</h4>
              <div className="space-y-2">
                {section.items.map((shortcut, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1">
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIdx) => (
                        <Kbd key={keyIdx}>{key}</Kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default KeyboardShortcutsHelp;
