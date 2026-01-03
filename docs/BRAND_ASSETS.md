# Jules Ninja Design System - Brand Assets Documentation

> Last verified: 2025-12-09

## Overview

The Jules Ninja is the unified mascot and brand identity for the portfolio. All
ninja representations across the application use a single, consistent 16×16
pixel art design system.

## Master Pattern

The ninja design is defined in `src/components/icons/NinjaIcon.tsx` as a 16×16
grid.

### Color Palette

| Code | Color       | HSL Variable         | Hex       | Usage                        |
| ---- | ----------- | -------------------- | --------- | ---------------------------- |
| 0    | Transparent | -                    | -         | Background/empty space       |
| 1    | Cyan        | `--jules-cyan`       | `#06b6d4` | Body, mask, clothing         |
| 2    | Magenta     | `--jules-magenta`    | `#ec4899` | Eyes, accents, katana handle |
| 3    | White       | -                    | `#ffffff` | Highlights, blade            |
| 4    | Cyan 60%    | `--jules-cyan / 0.6` | -         | Glow effects                 |

### Design Structure

```
Row 0-2:   Head top (rounded)
Row 3-4:   Eyes (2×2 magenta squares each)
Row 5-7:   Face/mask transition
Row 8-10:  Torso
Row 11-12: Arms extended outward
Row 13:    Belt/waist
Row 14-15: Legs
```

## Expression Variants

Six expression variants are available, each modifying the eye region:

| Variant       | Description               | Use Case                   |
| ------------- | ------------------------- | -------------------------- |
| `default`     | Standard ninja eyes       | General use                |
| `happy`       | Curved upward eyes (^\_^) | Success states, welcome    |
| `wink`        | One eye closed            | Playful interactions       |
| `thinking`    | Raised eyebrow            | Loading, processing        |
| `coding`      | Wide intense eyes         | Active/focused states      |
| `celebrating` | Sparkle star eyes         | Achievements, celebrations |

## Component Usage

### NinjaIcon

Primary icon component for all ninja representations.

```tsx
import { NinjaIcon } from '@/components/icons/NinjaIcon';

// Basic usage
<NinjaIcon />

// With size (preset or number)
<NinjaIcon size="lg" />
<NinjaIcon size={64} />

// With expression variant
<NinjaIcon variant="happy" />

// With glow effect
<NinjaIcon showGlow />

// With katana sword
<NinjaIcon showKatana />

// Full example
<NinjaIcon
  size="xl"
  variant="coding"
  showGlow
  showKatana
  aria-label="Coding ninja with sword"
/>
```

### Size Presets

| Preset | Pixels | Use Case                     |
| ------ | ------ | ---------------------------- |
| `xs`   | 24px   | Inline icons, badges         |
| `sm`   | 32px   | Navigation, buttons          |
| `md`   | 48px   | Cards, sections              |
| `lg`   | 64px   | Headers, hero areas          |
| `xl`   | 128px  | Sticker pack, large displays |

### Props

| Prop         | Type                                             | Default        | Description            |
| ------------ | ------------------------------------------------ | -------------- | ---------------------- |
| `size`       | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number` | `'md'`         | Icon size              |
| `variant`    | `string`                                         | `'default'`    | Expression variant     |
| `className`  | `string`                                         | `''`           | Additional CSS classes |
| `showGlow`   | `boolean`                                        | `false`        | Enable glow filter     |
| `showKatana` | `boolean`                                        | `false`        | Show katana sword      |
| `aria-label` | `string`                                         | `'Ninja icon'` | Accessibility label    |

## Related Components

### NinjaMascot

Larger animated mascot with mouse-tracking eyes. Uses the same `NINJA_PATTERN`.

```tsx
import { NinjaMascot } from '@/components/NinjaMascot';

<NinjaMascot size={120} expression="happy" />;
```

### AnimatedNinja

Animated version with idle animations and effects.

```tsx
import { AnimatedNinja } from '@/components/icons/AnimatedNinja';

<AnimatedNinja size={80} />;
```

### NinjaLoader

Loading spinner using the ninja pattern.

```tsx
import { NinjaLoader } from '@/components/shared/NinjaLoader';

<NinjaLoader variant="full" text="Loading..." />;
```

### PixelNinja

Interactive roaming mascot with easter eggs. Features full-body ninja with
katana.

```tsx
import { PixelNinja } from '@/components/PixelNinja';

<PixelNinja />; // Roams the screen autonomously
```

## Favicon

The favicon is generated from the master pattern and located at:

- `public/ninja-favicon.svg` - Vector version

To regenerate, use the `getNinjaSvgString()` export:

```tsx
import { getNinjaSvgString } from '@/components/icons/NinjaIcon';

const svgString = getNinjaSvgString(64, 'default');
```

## Sticker Pack

All expression variants are showcased in the Sticker Pack page at `/stickers`.

## Design Principles

1. **Consistency**: All ninja icons derive from `NINJA_PATTERN`
2. **Scalability**: Works from 24px to 128px+
3. **Accessibility**: All icons have proper ARIA labels
4. **Performance**: Pure SVG, no external assets
5. **Themeable**: Uses CSS variables for colors

## File Locations

| File                                     | Purpose                    |
| ---------------------------------------- | -------------------------- |
| `src/components/icons/NinjaIcon.tsx`     | Master pattern & main icon |
| `src/components/icons/AnimatedNinja.tsx` | Animated variant           |
| `src/components/icons/ninja-assets.ts`   | Shared exports             |
| `src/components/NinjaMascot.tsx`         | Large interactive mascot   |
| `src/components/PixelNinja.tsx`          | Roaming easter egg mascot  |
| `src/components/shared/NinjaLoader.tsx`  | Loading component          |
| `src/pages/StickerPack.tsx`              | Expression showcase        |
| `public/ninja-favicon.svg`               | Browser favicon            |

## Adding New Expressions

1. Create a new 16×16 pattern constant in `NinjaIcon.tsx`
2. Add to `PATTERN_MAP` with a unique key
3. Update the `variant` type in `NinjaIconProps`
4. Add to Sticker Pack page for documentation

Example:

```tsx
export const NINJA_PATTERN_SLEEPY = [
  // ... 16×16 grid with closed eyes
];

const PATTERN_MAP = {
  // ... existing
  sleepy: NINJA_PATTERN_SLEEPY,
};
```

## Brand Guidelines

- **Primary color**: Cyan (`--jules-cyan`) represents technology and precision
- **Accent color**: Magenta (`--jules-magenta`) represents creativity and energy
- **Style**: Pixel art aesthetic, clean geometric forms
- **Personality**: Professional yet approachable, technical but playful

---

_Last updated: December 2024_
