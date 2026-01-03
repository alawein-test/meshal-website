# Internationalization (i18n) Guide

> Comprehensive guide for implementing internationalization, localization, and
> RTL language support in the Alawein Platform.

---

## Table of Contents

1. Overview
2. i18n Architecture
3. Translation Setup
4. Translation Workflow
5. RTL Language Support
6. Date, Number & Currency Formatting
7. Pluralization
8. Best Practices
9. Testing
10. Accessibility Considerations

---

## Overview

### Supported Languages

| Language | Code | Direction | Status       |
| -------- | ---- | --------- | ------------ |
| English  | `en` | LTR       | Primary      |
| Arabic   | `ar` | RTL       | Full Support |
| French   | `fr` | LTR       | Planned      |
| Spanish  | `es` | LTR       | Planned      |

### Key Principles

1. **Content Separation**: All user-facing text extracted to translation files
2. **Dynamic Loading**: Load translations on demand for performance
3. **RTL First**: Design components that work in both LTR and RTL
4. **Cultural Adaptation**: Beyond translation—localize dates, numbers, and UX
   patterns

---

## i18n Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    i18n Architecture                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  Locale      │    │  Translation │    │  Formatting  │  │
│  │  Detection   │───▶│  Loading     │───▶│  Provider    │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                   │                    │          │
│         ▼                   ▼                    ▼          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  URL/Cookie  │    │  JSON Files  │    │  Intl APIs   │  │
│  │  /Browser    │    │  /Backend    │    │  /Libraries  │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
src/
├── i18n/
│   ├── index.ts              # i18n configuration
│   ├── locales/
│   │   ├── en/
│   │   │   ├── common.json   # Common translations
│   │   │   ├── auth.json     # Auth-related text
│   │   │   ├── dashboard.json
│   │   │   └── errors.json
│   │   └── ar/
│   │       ├── common.json
│   │       ├── auth.json
│   │       ├── dashboard.json
│   │       └── errors.json
│   ├── hooks/
│   │   ├── useTranslation.ts
│   │   └── useLocale.ts
│   └── utils/
│       ├── formatters.ts
│       └── pluralization.ts
```

---

## Translation Setup

### Configuration

```typescript
// src/i18n/index.ts
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Locale = 'en' | 'ar';
type TranslationNamespace = 'common' | 'auth' | 'dashboard' | 'errors';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextValue | null>(null);

// Translation cache
const translationCache = new Map<string, Record<string, unknown>>();

const loadTranslation = async (
  locale: Locale,
  namespace: TranslationNamespace
): Promise<Record<string, unknown>> => {
  const cacheKey = `${locale}:${namespace}`;

  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  const module = await import(`./locales/${locale}/${namespace}.json`);
  translationCache.set(cacheKey, module.default);
  return module.default;
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    // Priority: URL > localStorage > browser > default
    const urlLocale = new URLSearchParams(window.location.search).get('lang');
    const storedLocale = localStorage.getItem('locale');
    const browserLocale = navigator.language.split('-')[0];

    return (urlLocale || storedLocale || browserLocale || 'en') as Locale;
  });

  const [translations, setTranslations] = useState<Record<string, unknown>>({});

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: unknown = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        console.warn(`Translation missing: ${key}`);
        return key;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Replace parameters {{param}}
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (_, param) =>
        String(params[param] ?? `{{${param}}}`)
      );
    }

    return value;
  }, [translations]);

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t,
        dir: locale === 'ar' ? 'rtl' : 'ltr',
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};
```

### Translation Files

```json
// src/i18n/locales/en/common.json
{
  "navigation": {
    "home": "Home",
    "dashboard": "Dashboard",
    "settings": "Settings",
    "profile": "Profile",
    "logout": "Log Out"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "submit": "Submit",
    "confirm": "Confirm"
  },
  "messages": {
    "loading": "Loading...",
    "saving": "Saving...",
    "success": "Success!",
    "error": "An error occurred"
  },
  "validation": {
    "required": "This field is required",
    "email": "Please enter a valid email",
    "minLength": "Must be at least {{min}} characters",
    "maxLength": "Must be no more than {{max}} characters"
  }
}
```

```json
// src/i18n/locales/ar/common.json
{
  "navigation": {
    "home": "الرئيسية",
    "dashboard": "لوحة التحكم",
    "settings": "الإعدادات",
    "profile": "الملف الشخصي",
    "logout": "تسجيل الخروج"
  },
  "actions": {
    "save": "حفظ",
    "cancel": "إلغاء",
    "delete": "حذف",
    "edit": "تعديل",
    "submit": "إرسال",
    "confirm": "تأكيد"
  },
  "messages": {
    "loading": "جاري التحميل...",
    "saving": "جاري الحفظ...",
    "success": "تم بنجاح!",
    "error": "حدث خطأ"
  },
  "validation": {
    "required": "هذا الحقل مطلوب",
    "email": "يرجى إدخال بريد إلكتروني صحيح",
    "minLength": "يجب أن يكون على الأقل {{min}} أحرف",
    "maxLength": "يجب ألا يتجاوز {{max}} حرف"
  }
}
```

---

## Translation Workflow

### Development Process

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Add     │───▶│  Extract │───▶│ Translate│───▶│  Review  │
│  Keys    │    │  Strings │    │  Text    │    │  & QA    │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

### Key Naming Convention

```typescript
// Structure: namespace.section.element.property
const translationKeys = {
  // Good: Clear hierarchy
  'auth.login.title': 'Sign In',
  'auth.login.emailLabel': 'Email Address',
  'auth.login.submitButton': 'Sign In',
  'auth.login.errors.invalidCredentials': 'Invalid email or password',

  // Avoid: Flat or unclear naming
  loginTitle: 'Sign In', // ❌ No namespace
  auth_login_btn: 'Sign In', // ❌ Inconsistent separator
};
```

### Translation Management

```typescript
// scripts/extract-translations.ts
import * as fs from 'fs';
import * as path from 'path';

interface TranslationKey {
  key: string;
  file: string;
  line: number;
}

const extractTranslations = (srcDir: string): TranslationKey[] => {
  const keys: TranslationKey[] = [];
  const regex = /t\('"['"]/g;

  const processFile = (filePath: string) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      let match;
      while ((match = regex.exec(line)) !== null) {
        keys.push({
          key: match[1],
          file: filePath,
          line: index + 1,
        });
      }
    });
  };

  // Recursively process all .tsx and .ts files
  const processDirectory = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        processDirectory(fullPath);
      } else if (entry.name.match(/\.(tsx?|jsx?)$/)) {
        processFile(fullPath);
      }
    }
  };

  processDirectory(srcDir);
  return keys;
};

// Find missing translations
const findMissingTranslations = (
  keys: TranslationKey[],
  translations: Record<string, unknown>,
  locale: string
): string[] => {
  const missing: string[] = [];

  for (const { key } of keys) {
    const keyPath = key.split('.');
    let value: unknown = translations;

    for (const k of keyPath) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        missing.push(key);
        break;
      }
    }
  }

  return missing;
};
```

---

## RTL Language Support

### CSS Logical Properties

```css
/* src/styles/rtl.css */

/* Use logical properties instead of physical */
.container {
  /* ✅ Good: Works in both LTR and RTL */
  margin-inline-start: 1rem;
  margin-inline-end: 2rem;
  padding-inline: 1rem;
  border-inline-start: 2px solid var(--border);
  text-align: start;

  /* ❌ Avoid: Physical properties */
  /* margin-left: 1rem; */
  /* margin-right: 2rem; */
  /* text-align: left; */
}

/* Logical property mapping */
/*
  left -> inline-start
  right -> inline-end
  top -> block-start
  bottom -> block-end
  margin-left -> margin-inline-start
  padding-right -> padding-inline-end
  border-left -> border-inline-start
  text-align: left -> text-align: start
  float: left -> float: inline-start
*/
```

### Tailwind RTL Utilities

```typescript
// tailwind.config.ts
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    // RTL plugin for directional utilities
    function ({ addUtilities }) {
      addUtilities({
        '.start-0': {
          'inset-inline-start': '0',
        },
        '.end-0': {
          'inset-inline-end': '0',
        },
        '.ms-auto': {
          'margin-inline-start': 'auto',
        },
        '.me-auto': {
          'margin-inline-end': 'auto',
        },
        '.ps-4': {
          'padding-inline-start': '1rem',
        },
        '.pe-4': {
          'padding-inline-end': '1rem',
        },
      });
    },
  ],
};
```

### RTL-Aware Components

```tsx
// src/components/shared/DirectionalIcon.tsx
import { useI18n } from '@/i18n';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DirectionalIconProps {
  direction: 'forward' | 'back';
  className?: string;
}

export const DirectionalIcon = ({
  direction,
  className,
}: DirectionalIconProps) => {
  const { dir } = useI18n();

  // In RTL, "forward" arrows point left, "back" arrows point right
  const isForward = direction === 'forward';
  const pointsRight = dir === 'ltr' ? isForward : !isForward;

  return pointsRight ? (
    <ChevronRight className={className} />
  ) : (
    <ChevronLeft className={className} />
  );
};
```

```tsx
// src/components/shared/RTLProvider.tsx
import { ReactNode, useEffect } from 'react';
import { useI18n } from '@/i18n';

export const RTLProvider = ({ children }: { children: ReactNode }) => {
  const { locale, dir } = useI18n();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;

    // Update body class for additional RTL styles
    if (dir === 'rtl') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [locale, dir]);

  return <>{children}</>;
};
```

### Bidirectional Text Handling

```tsx
// src/components/shared/Bidi.tsx
interface BidiProps {
  children: string;
  as?: keyof JSX.IntrinsicElements;
}

export const Bidi = ({ children, as: Tag = 'span' }: BidiProps) => {
  // Detect if text contains RTL characters
  const hasRTL = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(children);
  const hasLTR = /[A-Za-z]/.test(children);

  // Mixed content needs explicit direction
  if (hasRTL && hasLTR) {
    return <Tag dir="auto">{children}</Tag>;
  }

  return <Tag>{children}</Tag>;
};

// Usage for user-generated content
<Bidi>{userMessage}</Bidi>;
```

### Language Switcher Component

```tsx
// src/components/shared/LanguageSwitcher.tsx
import { useI18n } from '@/i18n';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
] as const;

export const LanguageSwitcher = () => {
  const { locale, setLocale, t } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages className="h-5 w-5" />
          <span className="sr-only">{t('common.switchLanguage')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            className={locale === lang.code ? 'bg-accent' : ''}
          >
            <span className="me-2">{lang.nativeName}</span>
            <span className="text-muted-foreground text-sm">{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```

---

## Date, Number & Currency Formatting

### Formatters

```typescript
// src/i18n/utils/formatters.ts

export const createFormatters = (locale: string) => {
  return {
    // Date formatting
    formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => {
      return new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
        ...options,
      }).format(date);
    },

    formatTime: (date: Date, options?: Intl.DateTimeFormatOptions) => {
      return new Intl.DateTimeFormat(locale, {
        timeStyle: 'short',
        ...options,
      }).format(date);
    },

    formatDateTime: (date: Date) => {
      return new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    },

    formatRelativeTime: (date: Date) => {
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      const units: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
        { unit: 'year', seconds: 31536000 },
        { unit: 'month', seconds: 2592000 },
        { unit: 'week', seconds: 604800 },
        { unit: 'day', seconds: 86400 },
        { unit: 'hour', seconds: 3600 },
        { unit: 'minute', seconds: 60 },
        { unit: 'second', seconds: 1 },
      ];

      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

      for (const { unit, seconds } of units) {
        if (Math.abs(diffInSeconds) >= seconds) {
          const value = Math.round(diffInSeconds / seconds);
          return rtf.format(-value, unit);
        }
      }

      return rtf.format(0, 'second');
    },

    // Number formatting
    formatNumber: (num: number, options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat(locale, options).format(num);
    },

    formatPercent: (num: number) => {
      return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      }).format(num);
    },

    formatCompact: (num: number) => {
      return new Intl.NumberFormat(locale, {
        notation: 'compact',
        compactDisplay: 'short',
      }).format(num);
    },

    // Currency formatting
    formatCurrency: (amount: number, currency: string = 'USD') => {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
      }).format(amount);
    },

    // List formatting
    formatList: (
      items: string[],
      type: 'conjunction' | 'disjunction' = 'conjunction'
    ) => {
      return new Intl.ListFormat(locale, {
        style: 'long',
        type,
      }).format(items);
    },
  };
};

// Hook for using formatters
export const useFormatters = () => {
  const { locale } = useI18n();
  return createFormatters(locale);
};
```

### Usage Examples

```tsx
// Component using formatters
import { useFormatters } from '@/i18n/utils/formatters';

const StatsCard = ({ value, date }: { value: number; date: Date }) => {
  const { formatNumber, formatRelativeTime, formatCurrency } = useFormatters();

  return (
    <div className="p-4 rounded-lg bg-card">
      <div className="text-2xl font-bold">{formatNumber(value)}</div>
      <div className="text-muted-foreground">{formatRelativeTime(date)}</div>
      <div className="text-primary">{formatCurrency(value * 10, 'USD')}</div>
    </div>
  );
};
```

---

## Pluralization

### Plural Rules

```typescript
// src/i18n/utils/pluralization.ts

type PluralForm = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

interface PluralTranslation {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}

export const pluralize = (
  count: number,
  translations: PluralTranslation,
  locale: string
): string => {
  const pluralRules = new Intl.PluralRules(locale);
  const form = pluralRules.select(count) as PluralForm;

  // Try specific form, fall back to 'other'
  const template = translations[form] || translations.other;

  // Replace {{count}} placeholder
  return template.replace(/\{\{count\}\}/g, String(count));
};
```

### Translation with Plurals

```json
// src/i18n/locales/en/dashboard.json
{
  "items": {
    "zero": "No items",
    "one": "{{count}} item",
    "other": "{{count}} items"
  },
  "notifications": {
    "zero": "No new notifications",
    "one": "You have {{count}} new notification",
    "other": "You have {{count}} new notifications"
  }
}
```

```json
// src/i18n/locales/ar/dashboard.json
{
  "items": {
    "zero": "لا توجد عناصر",
    "one": "عنصر واحد",
    "two": "عنصران",
    "few": "{{count}} عناصر",
    "many": "{{count}} عنصراً",
    "other": "{{count}} عنصر"
  }
}
```

---

## Best Practices

### Do's and Don'ts

```typescript
// ✅ Good: Use translation keys
<h1>{t('dashboard.title')}</h1>

// ❌ Bad: Hardcoded text
<h1>Dashboard</h1>

// ✅ Good: Keep sentences together
t('welcome.greeting', { name: user.name })
// "Hello, {{name}}!" -> "مرحباً، {{name}}!"

// ❌ Bad: Concatenating translated parts
t('hello') + ', ' + user.name + '!'

// ✅ Good: Use Intl APIs for formatting
formatDate(new Date())

// ❌ Bad: Manual date formatting
`${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`

// ✅ Good: Design for text expansion (German/Arabic can be 30%+ longer)
<Button className="min-w-[120px]">{t('actions.submit')}</Button>

// ❌ Bad: Fixed width that may truncate
<Button className="w-20">{t('actions.submit')}</Button>
```

### Translation Key Guidelines

```typescript
// 1. Use namespaces to organize
'common.actions.save'
'auth.login.submitButton'
'dashboard.stats.totalUsers'

// 2. Be descriptive but concise
'errors.network.timeout' ✅
'error1' ❌

// 3. Use consistent naming patterns
'page.section.element'
'component.variant.state'

// 4. Document context for translators
{
  "greeting": {
    "_comment": "Shown on homepage, formal context",
    "value": "Welcome to our platform"
  }
}
```

---

## Testing

### i18n Test Utilities

```typescript
// tests/utils/i18n-test-utils.tsx
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { I18nProvider } from '@/i18n';

interface I18nRenderOptions extends RenderOptions {
  locale?: 'en' | 'ar';
}

export const renderWithI18n = (
  ui: React.ReactElement,
  { locale = 'en', ...options }: I18nRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <I18nProvider initialLocale={locale}>
      {children}
    </I18nProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...options });
};
```

### RTL Testing

```typescript
// tests/rtl/button.test.tsx
import { renderWithI18n } from '../utils/i18n-test-utils';
import { Button } from '@/components/ui/button';

describe('Button RTL Support', () => {
  it('renders correctly in LTR', () => {
    const { container } = renderWithI18n(
      <Button>Submit</Button>,
      { locale: 'en' }
    );
    expect(container.firstChild).toHaveAttribute('dir', 'ltr');
  });

  it('renders correctly in RTL', () => {
    const { container } = renderWithI18n(
      <Button>إرسال</Button>,
      { locale: 'ar' }
    );
    expect(document.documentElement).toHaveAttribute('dir', 'rtl');
  });

  it('icon alignment respects direction', () => {
    const { getByRole } = renderWithI18n(
      <Button>
        <span>Next</span>
        <ChevronRight />
      </Button>,
      { locale: 'ar' }
    );
    // Verify icon is on the correct side
  });
});
```

### Visual Regression for RTL

```typescript
// tests/e2e/rtl-visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('RTL Visual Regression', () => {
  test('dashboard renders correctly in Arabic', async ({ page }) => {
    await page.goto('/?lang=ar');
    await expect(page).toHaveScreenshot('dashboard-ar.png');
  });

  test('navigation renders correctly in Arabic', async ({ page }) => {
    await page.goto('/?lang=ar');
    await expect(page.locator('nav')).toHaveScreenshot('nav-ar.png');
  });
});
```

---

## Accessibility Considerations

### Language Attributes

```tsx
// Always set lang attribute
<html lang={locale} dir={dir}>

// For inline language changes
<span lang="ar">مرحبا</span>

// For quotations in different languages
<blockquote lang="fr" cite="...">
  Bonjour le monde
</blockquote>
```

### Screen Reader Announcements

```tsx
// Announce language changes
const LanguageSwitcher = () => {
  const { setLocale, t } = useI18n();
  const announceRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);

    // Announce to screen readers
    if (announceRef.current) {
      announceRef.current.textContent = t('accessibility.languageChanged', {
        language: newLocale === 'ar' ? 'Arabic' : 'English',
      });
    }
  };

  return (
    <>
      <div
        ref={announceRef}
        role="status"
        aria-live="polite"
        className="sr-only"
      />
      {/* Switcher UI */}
    </>
  );
};
```

---

## Related Documentation

- [ACCESSIBILITY.md](./ACCESSIBILITY.md) - Accessibility guidelines
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Design system tokens
- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) - Testing patterns
- [BilingualToggle Component](../src/projects/pages/mezan/components/BilingualToggle.tsx) -
  Example implementation

---

_Last updated: December 2024_
