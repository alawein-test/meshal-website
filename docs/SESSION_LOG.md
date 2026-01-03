# Session Log Component

> Last verified: 2025-12-09

## Overview

The Session Log component tracks and displays user prompts/actions within the
application, allowing users to review their session history and export it as a
markdown file.

## Features

- **Real-time tracking**: Automatically logs prompts and actions
- **Categorization**: Entries organized by type (Implementation, Configuration,
  Documentation, Navigation)
- **Filtering**: Filter view by category
- **Markdown export**: Download session history as a formatted `.md` file
- **Persistence**: Session survives page refreshes via localStorage

## Keyboard Shortcuts

| Shortcut     | Action                                             |
| ------------ | -------------------------------------------------- |
| `Ctrl/⌘ + L` | Open Session Log                                   |
| `Ctrl/⌘ + K` | Open Command Palette (includes Session Log option) |

## Usage

### Opening the Session Log

1. Press `Ctrl+L` (Windows/Linux) or `⌘+L` (Mac)
2. Or open Command Palette (`Ctrl+K`) and select "Session Log"

### Adding Log Entries (Programmatic)

```typescript
import { useSessionLogStore } from '@/stores/sessionLogStore';

const { addEntry } = useSessionLogStore();

// Add an entry
addEntry('Create a new service page', 'implementation');
addEntry('Update theme colors', 'configuration');
addEntry('Export session log', 'documentation');
addEntry('Navigate to portfolio', 'navigation');
```

### Exporting to Markdown

Click the "Export Markdown" button in the Session Log dialog. The file will
download with format:

```markdown
# Session Log

**Session Started:** Monday, December 9, 2024, 10:00 AM **Exported:** Monday,
December 9, 2024, 11:30 AM **Total Entries:** 15

---

## Summary

| Category          | Count |
| ----------------- | ----- |
| 🏗️ Implementation | 8     |
| ⚙️ Configuration  | 4     |
| 📝 Documentation  | 3     |

---

## 🏗️ Implementation Commands

| Time     | Prompt                       |
| -------- | ---------------------------- |
| 10:05 AM | Create a new service page... |
| 10:15 AM | Add form validation...       |

...
```

## Store API

### State

| Property           | Type                | Description                    |
| ------------------ | ------------------- | ------------------------------ |
| `entries`          | `SessionLogEntry[]` | Array of log entries           |
| `sessionStartTime` | `Date`              | When the current session began |

### Actions

| Method                 | Parameters                                                           | Description                         |
| ---------------------- | -------------------------------------------------------------------- | ----------------------------------- |
| `addEntry`             | `(content: string, category: SessionLogCategory, metadata?: object)` | Add new log entry                   |
| `clearSession`         | `()`                                                                 | Clear all entries and reset session |
| `getEntriesByCategory` | `(category: SessionLogCategory)`                                     | Get filtered entries                |
| `exportToMarkdown`     | `()`                                                                 | Generate markdown string            |

### Types

```typescript
type SessionLogCategory =
  | 'implementation'
  | 'configuration'
  | 'documentation'
  | 'navigation';

interface SessionLogEntry {
  id: string;
  timestamp: Date;
  category: SessionLogCategory;
  content: string;
  metadata?: Record<string, unknown>;
}
```

## File Locations

- **Store**: `src/stores/sessionLogStore.ts`
- **Component**: `src/components/SessionLog.tsx`
- **Export Utility**: `src/utils/dataExport.ts`

## Integration Points

- Command Palette (`src/components/CommandPalette.tsx`)
- Keyboard shortcuts (`Ctrl/⌘ + L`)
