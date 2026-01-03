# Accessibility Guide

> Last verified: 2025-12-09

---

## Overview

This guide covers WCAG 2.1 AA compliance, testing tools, and accessibility
patterns for the Alawein Platform.

---

## WCAG 2.1 Compliance

### Level A Requirements

#### Perceivable

| Criterion                     | Description               | Implementation           |
| ----------------------------- | ------------------------- | ------------------------ |
| 1.1.1 Non-text Content        | Provide text alternatives | Alt text on all images   |
| 1.2.1 Audio-only/Video-only   | Provide alternatives      | Transcripts, captions    |
| 1.3.1 Info and Relationships  | Semantic structure        | Use semantic HTML        |
| 1.3.2 Meaningful Sequence     | Logical order             | DOM order matches visual |
| 1.3.3 Sensory Characteristics | Don't rely on shape/color | Multiple cues            |
| 1.4.1 Use of Color            | Color not sole indicator  | Icons, text labels       |
| 1.4.2 Audio Control           | User can pause/stop       | Pause controls           |

#### Operable

| Criterion                     | Description                    | Implementation         |
| ----------------------------- | ------------------------------ | ---------------------- |
| 2.1.1 Keyboard                | All functionality via keyboard | Tab navigation         |
| 2.1.2 No Keyboard Trap        | Can navigate away              | Focus management       |
| 2.1.4 Character Key Shortcuts | Can disable shortcuts          | Modifier keys          |
| 2.2.1 Timing Adjustable       | Extend time limits             | Warning before timeout |
| 2.2.2 Pause, Stop, Hide       | Control moving content         | Animation controls     |
| 2.3.1 Three Flashes           | No flashing content            | Reduced motion         |
| 2.4.1 Bypass Blocks           | Skip navigation                | Skip links             |
| 2.4.2 Page Titled             | Descriptive titles             | Dynamic titles         |
| 2.4.3 Focus Order             | Logical focus sequence         | Proper tabindex        |
| 2.4.4 Link Purpose            | Clear link text                | Descriptive labels     |

#### Understandable

| Criterion                    | Description           | Implementation         |
| ---------------------------- | --------------------- | ---------------------- |
| 3.1.1 Language of Page       | Declare language      | `lang` attribute       |
| 3.2.1 On Focus               | No unexpected changes | Predictable behavior   |
| 3.2.2 On Input               | No unexpected changes | User-initiated actions |
| 3.3.1 Error Identification   | Identify errors       | Error messages         |
| 3.3.2 Labels or Instructions | Provide labels        | Form labels            |

#### Robust

| Criterion               | Description     | Implementation    |
| ----------------------- | --------------- | ----------------- |
| 4.1.1 Parsing           | Valid HTML      | Linter validation |
| 4.1.2 Name, Role, Value | ARIA attributes | Proper roles      |

### Level AA Requirements

| Criterion                       | Description               | Implementation       |
| ------------------------------- | ------------------------- | -------------------- |
| 1.4.3 Contrast (Minimum)        | 4.5:1 text ratio          | Color system         |
| 1.4.4 Resize Text               | 200% zoom support         | Responsive design    |
| 1.4.5 Images of Text            | Avoid text in images      | CSS styling          |
| 1.4.10 Reflow                   | No horizontal scroll      | Responsive layout    |
| 1.4.11 Non-text Contrast        | 3:1 for UI                | Border/icon colors   |
| 1.4.12 Text Spacing             | Adjustable spacing        | CSS variables        |
| 1.4.13 Content on Hover         | Persistent, dismissible   | Tooltip behavior     |
| 2.4.5 Multiple Ways             | Multiple navigation paths | Search, nav, sitemap |
| 2.4.6 Headings and Labels       | Descriptive headings      | Semantic structure   |
| 2.4.7 Focus Visible             | Clear focus indicator     | Focus styles         |
| 3.1.2 Language of Parts         | Identify language changes | `lang` on elements   |
| 3.2.3 Consistent Navigation     | Consistent nav position   | Layout patterns      |
| 3.2.4 Consistent Identification | Consistent naming         | Component library    |
| 3.3.3 Error Suggestion          | Suggest corrections       | Form validation      |
| 3.3.4 Error Prevention          | Confirm, check, reverse   | Confirmation dialogs |

---

## Implementation Patterns

### Semantic HTML

```tsx
// ✅ Good - Semantic structure
<main>
  <header>
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="/">Home</a></li>
      </ul>
    </nav>
  </header>

  <article>
    <h1>Page Title</h1>
    <section aria-labelledby="section-heading">
      <h2 id="section-heading">Section</h2>
      <p>Content...</p>
    </section>
  </article>

  <aside aria-label="Related content">
    <h2>Related</h2>
  </aside>

  <footer>
    <p>Copyright info</p>
  </footer>
</main>

// ❌ Bad - Div soup
<div className="main">
  <div className="header">
    <div className="nav">...</div>
  </div>
  <div className="content">...</div>
</div>
```

### Focus Management

```tsx
// Skip Link Component
export function SkipToMain() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
                 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground"
    >
      Skip to main content
    </a>
  );
}

// Focus trap for modals
import { useFocusTrap } from '@/hooks/useFocusTrap';

function Modal({ isOpen, onClose, children }) {
  const ref = useFocusTrap(isOpen);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <h2 id="modal-title">Modal Title</h2>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

### ARIA Patterns

```tsx
// Live Regions
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// Accessible Button
<button
  aria-label="Close dialog"
  aria-describedby="close-description"
>
  <XIcon aria-hidden="true" />
</button>
<span id="close-description" className="sr-only">
  Press Escape or click to close
</span>

// Loading States
<button disabled={isLoading} aria-busy={isLoading}>
  {isLoading ? (
    <>
      <Spinner aria-hidden="true" />
      <span className="sr-only">Loading...</span>
    </>
  ) : (
    'Submit'
  )}
</button>

// Tabs
<div role="tablist" aria-label="Content tabs">
  <button
    role="tab"
    aria-selected={activeTab === 'tab1'}
    aria-controls="panel1"
    id="tab1"
  >
    Tab 1
  </button>
</div>
<div
  role="tabpanel"
  id="panel1"
  aria-labelledby="tab1"
  hidden={activeTab !== 'tab1'}
>
  Content
</div>
```

### Form Accessibility

```tsx
// Accessible Form Field
function FormField({ label, error, required, ...props }) {
  const id = useId();
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;

  return (
    <div>
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true">*</span>}
        {required && <span className="sr-only">(required)</span>}
      </label>

      <input
        id={id}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : descriptionId}
        {...props}
      />

      {error && (
        <p id={errorId} role="alert" className="text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
```

### Reduced Motion

```tsx
// Hook for reduced motion preference
import { useReducedMotion } from '@/hooks/useReducedMotion';

function AnimatedComponent() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={prefersReducedMotion ? {} : { scale: 1.1 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
    >
      Content
    </motion.div>
  );
}

// CSS approach
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Color Contrast

### Minimum Ratios

| Element Type       | Minimum Ratio | Example         |
| ------------------ | ------------- | --------------- |
| Normal text        | 4.5:1         | Body copy       |
| Large text (18pt+) | 3:1           | Headings        |
| UI components      | 3:1           | Buttons, inputs |
| Graphics           | 3:1           | Icons, borders  |

### Testing Contrast

```tsx
// Use design system tokens for guaranteed contrast
<p className="text-foreground bg-background">
  Primary text (verified contrast)
</p>

<p className="text-muted-foreground bg-muted">
  Secondary text (verified contrast)
</p>

// Check contrast programmatically
function getContrastRatio(color1: string, color2: string): number {
  // Implementation using relative luminance
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}
```

---

## Testing Tools

### Automated Testing

```bash
# axe-core with Playwright
npm run test:e2e -- --grep "accessibility"

# Lighthouse CI
npx lighthouse https://your-app.com --only-categories=accessibility
```

### Playwright Accessibility Tests

```typescript
// tests/e2e/accessibility/a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('should have no accessibility violations on home', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', (els) =>
      els.map((el) => ({
        level: parseInt(el.tagName[1]),
        text: el.textContent,
      }))
    );

    // Verify single h1
    const h1s = headings.filter((h) => h.level === 1);
    expect(h1s).toHaveLength(1);

    // Verify no skipped levels
    let prevLevel = 0;
    for (const heading of headings) {
      expect(heading.level - prevLevel).toBeLessThanOrEqual(1);
      prevLevel = heading.level;
    }
  });
});
```

### Browser Extensions

| Tool         | Purpose                       |
| ------------ | ----------------------------- |
| axe DevTools | Automated WCAG testing        |
| WAVE         | Visual accessibility feedback |
| Lighthouse   | Performance + accessibility   |
| HeadingsMap  | Document outline              |
| NoCoffee     | Vision simulation             |

### Manual Testing Checklist

- [ ] Navigate entire site with keyboard only
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Zoom to 200% - verify no horizontal scroll
- [ ] Test with high contrast mode
- [ ] Verify focus indicators visible
- [ ] Check form error announcements
- [ ] Test with reduced motion enabled

---

## Screen Reader Testing

### VoiceOver (macOS)

```
⌘ + F5         Toggle VoiceOver
Ctrl + Option  VO modifier
VO + ⇧ + ↓     Enter web content
VO + A         Read all
VO + →/←       Navigate elements
VO + ⌘ + H     Headings list
```

### NVDA (Windows)

```
Ctrl + Alt + N  Start NVDA
Insert          NVDA modifier
NVDA + ↓        Read all
H               Next heading
D               Next landmark
Tab             Next focusable
```

---

## Component Library Patterns

### Accessible Button

```tsx
interface ButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}

function Button({ children, loading, disabled, ariaLabel }: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      aria-label={ariaLabel}
    >
      {loading && <span className="sr-only">Loading, please wait</span>}
      <span aria-hidden={loading}>{children}</span>
    </button>
  );
}
```

### Accessible Modal

```tsx
function AccessibleModal({ isOpen, onClose, title, children }) {
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Announce to screen readers
      const liveRegion = document.getElementById('live-region');
      if (liveRegion) {
        liveRegion.textContent = `${title} dialog opened`;
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, title]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        <DialogHeader>
          <DialogTitle id={titleId}>{title}</DialogTitle>
        </DialogHeader>
        <div id={descId}>{children}</div>
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4"
        >
          <X aria-hidden="true" />
        </button>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Resources

### Guidelines

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Inclusive Components](https://inclusive-components.design/)

### Testing Tools

- [axe DevTools](https://www.deque.com/axe/)
- [WAVE](https://wave.webaim.org/)
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## Related Documentation

- [UI_COMPONENTS.md](./UI_COMPONENTS.md) - Component library
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Design tokens
- [TESTING.md](./TESTING.md) - Testing guide
