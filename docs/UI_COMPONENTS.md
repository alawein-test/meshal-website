# UI Components Reference

> Last verified: 2025-12-09

Complete documentation of UI components in the Alawein Platform.

---

## Table of Contents

1. Component Architecture
2. Shadcn UI Components
3. Custom Components
4. Design Tokens
5. Theming
6. Component Patterns

---

## Component Architecture

### Directory Structure

```
src/components/
├── ui/                 # Shadcn base components
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── shared/             # Reusable shared components
│   ├── HubHeader.tsx
│   ├── PageLayout.tsx
│   └── ...
├── charts/             # Chart components
├── dashboard/          # Dashboard components
├── resume/             # Resume components
├── auth/               # Auth components
├── icons/              # Icon components
└── portfolio/          # Portfolio components
```

### Import Pattern

```typescript
// From UI library
import { Button, Card, Badge } from '@/components/ui';

// From shared components
import { HubHeader, PageLayout, SEO } from '@/components/shared';
```

---

## Shadcn UI Components

### Button

Location: `src/components/ui/button.tsx`

```typescript
import { Button } from '@/components/ui/button';

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

### Card

Location: `src/components/ui/card.tsx`

```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Badge

Location: `src/components/ui/badge.tsx`

```typescript
import { Badge } from '@/components/ui/badge';

// Variants
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

### Dialog

Location: `src/components/ui/dialog.tsx`

```typescript
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <div>Content</div>
    <DialogFooter>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Complete Shadcn Inventory

| Component      | File                  | Description                 |
| -------------- | --------------------- | --------------------------- |
| Accordion      | `accordion.tsx`       | Expandable content sections |
| Alert          | `alert.tsx`           | Alert messages              |
| AlertDialog    | `alert-dialog.tsx`    | Confirmation dialogs        |
| AspectRatio    | `aspect-ratio.tsx`    | Maintain aspect ratios      |
| Avatar         | `avatar.tsx`          | User avatars                |
| Badge          | `badge.tsx`           | Status badges               |
| Breadcrumb     | `breadcrumb.tsx`      | Navigation breadcrumbs      |
| Button         | `button.tsx`          | Action buttons              |
| Calendar       | `calendar.tsx`        | Date picker calendar        |
| Card           | `card.tsx`            | Content cards               |
| Carousel       | `carousel.tsx`        | Image/content carousel      |
| Chart          | `chart.tsx`           | Chart container             |
| Checkbox       | `checkbox.tsx`        | Checkbox input              |
| Collapsible    | `collapsible.tsx`     | Collapsible sections        |
| Command        | `command.tsx`         | Command palette             |
| ContextMenu    | `context-menu.tsx`    | Right-click menus           |
| Dialog         | `dialog.tsx`          | Modal dialogs               |
| Drawer         | `drawer.tsx`          | Slide-out drawer            |
| DropdownMenu   | `dropdown-menu.tsx`   | Dropdown menus              |
| Form           | `form.tsx`            | Form handling with RHF      |
| HoverCard      | `hover-card.tsx`      | Hover preview cards         |
| Input          | `input.tsx`           | Text input                  |
| InputOTP       | `input-otp.tsx`       | OTP input                   |
| Label          | `label.tsx`           | Form labels                 |
| Menubar        | `menubar.tsx`         | Menu bar navigation         |
| NavigationMenu | `navigation-menu.tsx` | Navigation menus            |
| Pagination     | `pagination.tsx`      | Page navigation             |
| Popover        | `popover.tsx`         | Popover overlays            |
| Progress       | `progress.tsx`        | Progress indicators         |
| RadioGroup     | `radio-group.tsx`     | Radio button groups         |
| Resizable      | `resizable.tsx`       | Resizable panels            |
| ScrollArea     | `scroll-area.tsx`     | Custom scrollbars           |
| Select         | `select.tsx`          | Select dropdowns            |
| Separator      | `separator.tsx`       | Visual separators           |
| Sheet          | `sheet.tsx`           | Side panels                 |
| Sidebar        | `sidebar.tsx`         | App sidebar                 |
| Skeleton       | `skeleton.tsx`        | Loading skeletons           |
| Slider         | `slider.tsx`          | Range sliders               |
| Sonner         | `sonner.tsx`          | Toast notifications         |
| Switch         | `switch.tsx`          | Toggle switches             |
| Table          | `table.tsx`           | Data tables                 |
| Tabs           | `tabs.tsx`            | Tab navigation              |
| Textarea       | `textarea.tsx`        | Multi-line input            |
| Toast          | `toast.tsx`           | Toast messages              |
| Toggle         | `toggle.tsx`          | Toggle buttons              |
| ToggleGroup    | `toggle-group.tsx`    | Toggle button groups        |
| Tooltip        | `tooltip.tsx`         | Tooltips                    |

---

## Custom Components

### HubHeader

Location: `src/components/shared/HubHeader.tsx`

Consistent header for hub pages with icon, gradient title, and description.

```typescript
import { HubHeader } from '@/components/shared';
import { Sparkles } from 'lucide-react';

<HubHeader
  icon={Sparkles}
  title="Page Title"
  description="Page description text"
  size="large" // 'default' | 'large'
/>
```

### NeonCard

Location: `src/components/ui/neon-card.tsx`

Card with neon glow effect.

```typescript
import { NeonCard } from '@/components/ui/neon-card';

<NeonCard
  color="purple" // 'purple' | 'cyan' | 'green' | 'orange'
  glow={true}
>
  Content
</NeonCard>
```

### SkillBadge

Location: `src/components/ui/skill-badge.tsx`

Skill display with proficiency level.

```typescript
import { SkillBadge } from '@/components/ui/skill-badge';

<SkillBadge
  name="React"
  level="expert" // 'beginner' | 'intermediate' | 'advanced' | 'expert'
/>
```

### SectionHeader

Location: `src/components/ui/section-header.tsx`

Consistent section headers.

```typescript
import { SectionHeader } from '@/components/ui/section-header';

<SectionHeader
  title="Section Title"
  subtitle="Optional subtitle"
  align="center" // 'left' | 'center' | 'right'
/>
```

### BrandCTA

Location: `src/components/ui/brand-cta.tsx`

Brand call-to-action button.

```typescript
import { BrandCTA } from '@/components/ui/brand-cta';

<BrandCTA
  href="/contact"
  variant="primary" // 'primary' | 'secondary'
>
  Get Started
</BrandCTA>
```

### Kbd

Location: `src/components/ui/kbd.tsx`

Keyboard shortcut display.

```typescript
import { Kbd } from '@/components/ui/kbd';

<Kbd>⌘</Kbd><Kbd>K</Kbd>
```

---

## Design Tokens

### Color Tokens

All colors are defined as HSL in `src/index.css`:

```css
:root {
  --background: 240 40% 10%;
  --foreground: 0 0% 100%;
  --primary: 271 91% 65%;
  --primary-foreground: 0 0% 100%;
  --secondary: 240 30% 20%;
  --secondary-foreground: 0 0% 100%;
  --muted: 240 20% 25%;
  --muted-foreground: 240 10% 65%;
  --accent: 271 91% 65%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;
  --border: 240 20% 25%;
  --ring: 271 91% 65%;
}
```

### Usage in Components

```typescript
// ✅ Correct - Use semantic tokens
<div className="bg-background text-foreground">
<div className="bg-primary text-primary-foreground">
<div className="border-border">

// ❌ Wrong - Don't use raw colors
<div className="bg-purple-500 text-white">
<div className="bg-slate-900">
```

### Extended Tokens

```css
:root {
  /* Gradients */
  --gradient-primary: linear-gradient(
    135deg,
    hsl(var(--primary)),
    hsl(var(--accent))
  );

  /* Shadows */
  --shadow-glow: 0 0 40px hsl(var(--primary) / 0.3);

  /* Animations */
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## Theming

### Available Themes

| Theme           | Description        | Key Colors              |
| --------------- | ------------------ | ----------------------- |
| `quantum`       | Default dark theme | Purple/Violet primary   |
| `glassmorphism` | Glass effect theme | Translucent backgrounds |
| `dark`          | Pure dark theme    | Neutral grays           |
| `light`         | Light theme        | Light backgrounds       |

### Theme Switching

```typescript
import { useTheme } from '@/context/ThemeContext';

const Component = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme('dark')}>
      Dark Mode
    </button>
  );
};
```

### Theme Classes

```css
/* Theme-specific styles */
.theme-quantum {
  --primary: 271 91% 65%;
}

.theme-dark {
  --primary: 240 10% 50%;
}

.theme-light {
  --background: 0 0% 100%;
  --foreground: 240 10% 10%;
}
```

---

## Component Patterns

### Compound Components

```typescript
// Card with compound pattern
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Polymorphic Components

```typescript
// Button as link
<Button asChild>
  <a href="/link">Link Button</a>
</Button>
```

### Forwarded Refs

```typescript
// All UI components forward refs
const buttonRef = useRef<HTMLButtonElement>(null);
<Button ref={buttonRef}>Click</Button>
```

### Variant Props with CVA

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva('base-classes', {
  variants: {
    variant: {
      default: 'default-classes',
      outline: 'outline-classes',
    },
    size: {
      default: 'h-10 px-4',
      sm: 'h-9 px-3',
      lg: 'h-11 px-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

interface ButtonProps extends VariantProps<typeof buttonVariants> {}
```

### Responsive Design

```typescript
// Mobile-first responsive classes
<div className="
  grid grid-cols-1
  md:grid-cols-2
  lg:grid-cols-3
  gap-4
">
```

### Animation with Framer Motion

```typescript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
  Animated content
</motion.div>
```

---

## Accessibility

### Focus Management

```typescript
// Visible focus rings
<Button className="focus-visible:ring-2 focus-visible:ring-ring">
```

### Screen Reader Support

```typescript
// Accessible labels
<Button aria-label="Close dialog">
  <X className="h-4 w-4" />
</Button>

// Screen reader only text
<span className="sr-only">Loading...</span>
```

### Keyboard Navigation

```typescript
// Keyboard shortcuts
import { useKeyboardShortcuts } from '@/hooks';

useKeyboardShortcuts({
  'mod+k': () => openCommandPalette(),
});
```

### Reduced Motion

```typescript
import { useReducedMotion } from '@/hooks';

const prefersReducedMotion = useReducedMotion();

<motion.div
  animate={prefersReducedMotion ? {} : { scale: 1.1 }}
>
```
