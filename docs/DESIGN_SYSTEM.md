# Design System

> Last verified: 2025-12-09

## Overview

Alawein Platform uses a token-based design system defined in `src/index.css` and
extended in `tailwind.config.ts`.

**Golden Rule**: Never use raw colors. Always use semantic tokens.

```tsx
// ❌ WRONG
<div className="bg-purple-500 text-white">

// ✅ CORRECT
<div className="bg-primary text-primary-foreground">
```

---

## Core Tokens

### Background & Foreground

```css
--background: 240 40% 10%; /* Main app background */
--foreground: 0 0% 100%; /* Main text color */
--card: 240 40% 12%; /* Card backgrounds */
--card-foreground: 0 0% 100%; /* Card text */
--popover: 240 40% 12%; /* Popover/dropdown bg */
--popover-foreground: 0 0% 100%;
```

### Brand Colors

```css
--primary: 271 91% 65%; /* Quantum purple - main brand */
--primary-foreground: 0 0% 100%;
--secondary: 245 45% 20%; /* Dark purple */
--secondary-foreground: 0 0% 100%;
--accent: 330 81% 60%; /* Plasma pink */
--accent-foreground: 0 0% 100%;
```

### UI Colors

```css
--muted: 245 30% 25%; /* Muted backgrounds */
--muted-foreground: 240 20% 75%; /* Muted text */
--border: 0 0% 100% / 0.08; /* Borders */
--input: 0 0% 100% / 0.08; /* Input backgrounds */
--ring: 271 91% 65%; /* Focus rings */
```

### Status Colors

```css
--success: 160 84% 39%; /* Green */
--warning: 38 92% 50%; /* Orange */
--error: 0 84% 60%; /* Red */
--info: 193 85% 62%; /* Cyan */
--destructive: 0 84% 60%; /* Same as error */
```

---

## Design Palettes

### Quantum Spectrum (Default)

```css
--quantum-purple: 271 91% 65%;
--plasma-pink: 330 81% 60%;
--electron-cyan: 193 85% 62%;
--void-start: 240 40% 10%;
--void-mid: 245 45% 17%;
--void-end: 260 50% 20%;
```

### Jules/Cyberpunk

```css
--jules-dark: 240 30% 6%;
--jules-surface: 240 25% 10%;
--jules-purple: 270 80% 60%;
--jules-cyan: 180 100% 50%;
--jules-magenta: 320 100% 60%;
--jules-yellow: 50 100% 55%;
--jules-green: 140 70% 50%;
```

### Vaporwave

```css
--vaporwave-pink: 319 100% 72%;
--vaporwave-blue: 188 99% 50%;
--vaporwave-purple: 270 100% 70%;
--vaporwave-teal: 157 100% 51%;
--vaporwave-orange: 54 100% 79%;
```

### Swiss Minimalist

```css
--swiss-red: 0 100% 50%;
--swiss-black: 0 0% 0%;
--swiss-white: 0 0% 100%;
--swiss-accent: 240 100% 50%;
```

### Soft Pastel

```css
--pastel-rose: 350 80% 85%;
--pastel-lavender: 270 67% 85%;
--pastel-sky: 200 80% 85%;
--pastel-mint: 160 60% 85%;
--pastel-peach: 25 80% 85%;
--pastel-lilac: 280 60% 85%;
```

---

## Tailwind Usage

### Colors

```tsx
// Semantic colors (always preferred)
<div className="bg-background text-foreground" />
<div className="bg-primary text-primary-foreground" />
<div className="bg-card text-card-foreground" />

// Design palette colors
<div className="text-quantum-purple" />
<div className="bg-jules-dark text-jules-cyan" />
<div className="text-vaporwave-pink" />
```

### Spacing & Typography

```tsx
// Font families
<p className="font-sans">Inter text</p>
<code className="font-mono">JetBrains Mono code</code>

// Standard Tailwind spacing
<div className="p-4 m-2 gap-6" />
```

### Animations

```tsx
// Built-in animations
<div className="animate-fade-in" />
<div className="animate-fade-in-up" />
<div className="animate-scale-in" />
<div className="animate-shimmer" />
```

---

## Component Patterns

### Cards

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>;
```

### Buttons

```tsx
import { Button } from '@/components/ui/button';

// Available variants
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
```

### Forms

```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

<div className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" />
  </div>
  <Button type="submit">Submit</Button>
</div>;
```

---

## Themes

The platform supports 4 theme variations:

### 1. Quantum (Default)

- Space-like dark blue background
- Purple/cyan accent colors
- Glow effects and orbital animations

### 2. Glassmorphism

- Frosted glass effects
- Backdrop blur
- Semi-transparent surfaces

### 3. Dark

- High contrast
- Pure blacks and bright whites
- Minimal effects

### 4. Light

- Clean white backgrounds
- Dark text
- Soft shadows

Theme switching is handled via `ThemeContext`:

```tsx
import { useTheme } from '@/context/ThemeContext';

function Component() {
  const { theme, setTheme } = useTheme();

  return <button onClick={() => setTheme('dark')}>Switch to Dark</button>;
}
```

---

## Best Practices

1. **Always use semantic tokens** - Never hardcode colors
2. **Use Shadcn components** - Located in `src/components/ui/`
3. **Follow spacing scale** - Use Tailwind's spacing utilities
4. **Maintain contrast** - Ensure text is readable on all backgrounds
5. **Support all themes** - Test components in all 4 themes
