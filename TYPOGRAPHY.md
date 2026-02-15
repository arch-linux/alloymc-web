# Alloy — Design System Reference

This document is the single source of truth for visual identity across all Alloy properties (website, docs, launcher UI, social, print).

---

## Brand

| Property | Value |
|---|---|
| **Name** | Alloy |
| **Tagline** | Forged with Alloy |
| **Domain** | alloymc.net |
| **Voice** | Confident, direct, technical. First person plural ("we"). No filler, no hype. Let the work speak. |

---

## Color Palette

### Core Backgrounds (Dark → Light)

| Token | Hex | Usage |
|---|---|---|
| `obsidian-950` | `#06060a` | Page background, deepest black |
| `obsidian-900` | `#0c0c12` | Section alternates, footer bg |
| `obsidian-800` | `#14141c` | Card backgrounds, elevated surfaces |
| `obsidian-700` | `#1e1e28` | Borders, dividers, secondary surfaces |
| `obsidian-600` | `#2a2a36` | Subtle borders, hover states |
| `obsidian-500` | `#3a3a48` | Muted interactive borders |

### Text

| Token | Hex | Usage |
|---|---|---|
| `stone-100` | `#f0f0f4` | Primary headings, high-emphasis text |
| `stone-200` | `#d1d5db` | Body text, default readable content |
| `stone-300` | `#b8bfc9` | Secondary text, descriptions |
| `stone-400` | `#9ca3af` | Muted text, captions, subtitles |
| `stone-500` | `#6b7280` | Disabled text, placeholder, deemphasized headings |

### Accent

| Token | Hex | Usage |
|---|---|---|
| `ember` | `#ff6b00` | **Primary accent.** CTAs, links, highlights, active states, the brand color. |
| `ember-light` | `#ff8a33` | Hover state for ember elements |
| `ember-dark` | `#cc5500` | Pressed/active state, darker variant |
| `molten` | `#ff4400` | Destructive/warning accents, secondary glow |
| `forge-gold` | `#f0b830` | Badges, special callouts, "coming soon" indicators |

### Gradients

| Name | Definition | Usage |
|---|---|---|
| **Stat number** | `linear-gradient(135deg, #ff6b00, #f0b830)` | Step numbers, stat figures — applied as background-clip text |
| **Pipeline flow** | `linear-gradient(90deg, transparent, #ff6b00, #f0b830, #ff6b00, transparent)` | Animated connector lines between pipeline stages |
| **Ember glow** | Radial `#ff6b00` at 4–8% opacity, blurred 100–150px | Background atmosphere, hero sections |

---

## Typography

### Font Stack

| Role | Family | Weight | Source |
|---|---|---|---|
| **Headings** | Space Grotesk | 600 (semibold), 700 (bold) | Google Fonts |
| **Body** | Inter | 400 (regular), 500 (medium) | Google Fonts |
| **Code / Mono** | JetBrains Mono | 400 (regular) | Google Fonts |

### Scale

| Element | Size (mobile → desktop) | Weight | Font |
|---|---|---|---|
| Hero h1 | `text-5xl` → `text-8xl` | Bold (700) | Space Grotesk |
| Section h2 | `text-4xl` → `text-5xl` | Bold (700) | Space Grotesk |
| Card h3 | `text-xl` → `text-2xl` | Semibold (600) | Space Grotesk |
| Body | `text-base` → `text-lg` | Regular (400) | Inter |
| Small / captions | `text-xs` → `text-sm` | Regular / Medium | Inter |
| Mono labels | `text-xs` | Regular (400) | JetBrains Mono |

### Heading Style

- All headings use `font-heading` (Space Grotesk)
- Leading: tight (`leading-tight` or `leading-[0.95]` for hero)
- Tracking: tight (`tracking-tight`) for hero, default elsewhere
- Pattern: Main statement in `stone-100`, secondary clause in `stone-500` or `ember`
- Example: "One ecosystem." (white) + "Zero compromises." (ember with glow)

### Mono Labels

- Used for section tags above headings: `font-mono text-xs text-ember uppercase tracking-widest`
- Example: "THE FULL PICTURE", "DEVELOPER EXPERIENCE", "NOT INCREMENTAL"

---

## Logo

- Component: `src/components/icons/AlloyLogo.tsx`
- Shape: Anvil/ingot silhouette — a hexagonal faceted form
- Colors: Gradient from `#ff9a4a` (top) to `#f04800` (bottom), spark dot in `#f0b830`
- Sizes: `w-8 h-8` in header, `w-7 h-7` in footer
- Always paired with "Alloy" text in Space Grotesk Bold

---

## Component Patterns

### Buttons

| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| **Primary** | `ember` | `obsidian-950` | none | `ember-light`, shadow glow |
| **Secondary** | `obsidian-700` | `stone-100` | `obsidian-600` | `obsidian-600`, border → `ember/40` |
| **Ghost** | transparent | `stone-300` | none | text → `ember`, bg → `obsidian-800` |

- Sizes: `sm` (px-4 py-2), `md` (px-6 py-3), `lg` (px-8 py-4)
- Border radius: `rounded-lg`
- Always include focus-visible outline in ember

### Cards

- Background: `obsidian-800` or `obsidian-900/40`
- Border: `obsidian-700/50` or `obsidian-600`
- Border radius: `rounded-xl` or `rounded-2xl` for larger cards
- Glow variant: on hover, border → `ember/20–50`, shadow → `ember/10`

### Terminal / Code Blocks

- Use the `.terminal` class from globals.css
- Title bar: three macOS dots (`#ff5f57`, `#febc2e`, `#28c840`), filename in mono
- Body: `font-mono text-sm`, `stone-200` for code, `stone-500` for output/comments
- Prompt character `$` in ember, command text in `stone-200`
- Success checkmarks in `stone-500`, highlight output in `forge-gold`
- Background: gradient from `#111118` to `#0a0a10`
- Border: `rgba(255,255,255,0.06)`
- Shadow: layered — tight black + deep drop + faint ember glow

### Badges

| Variant | Background | Text | Border |
|---|---|---|---|
| **Default** | `obsidian-700` | `stone-300` | `obsidian-600` |
| **Ember** | `ember/15` | `ember` | `ember/30` |
| **Gold** | `forge-gold/15` | `forge-gold` | `forge-gold/30` |

---

## Effects & Atmosphere

### Forge Sparks

- 30 particles, mix of `ember` and `forge-gold`
- Sizes: 1.5–6px, rise animation with fade-out
- Staggered delays and durations for organic feel
- `pointer-events-none`, `aria-hidden="true"`

### Ember Glow

- 2–3 radial blurs per instance, `blur-[100px]` to `blur-[150px]`
- Opacity: 4–8% of accent colors
- Pulsing animation on 4s cycle
- Used behind hero sections and CTAs

### Grid Overlay

- 40px grid, lines at `rgba(255,255,255,0.015)`
- Used as background texture on alternating sections

### Pipeline Flow

- Animated gradient line connecting pipeline stage indicators
- `background-size: 200%`, linear animation 3s

---

## Layout

| Property | Value |
|---|---|
| Max content width | `max-w-7xl` (1280px) for wide sections, `max-w-6xl` for stacks, `max-w-3xl` for prose |
| Page padding | `px-6` (24px) |
| Section spacing | `py-32` (128px) between major sections |
| Header | Sticky, `bg-obsidian-950/80 backdrop-blur-xl`, border-bottom `obsidian-700/50` |
| Footer | `bg-obsidian-900`, 4-column grid on desktop |

---

## Accessibility

- All text meets **WCAG AA** contrast on dark backgrounds
- `prefers-reduced-motion`: all animations disabled (duration → 0.01ms)
- Skip-nav link on every page
- Semantic landmarks: `<header>`, `<main>`, `<footer>`, `<nav>`
- All decorative elements: `aria-hidden="true"`, `pointer-events-none`
- Focus-visible outlines in ember on all interactive elements
- Minimum touch target: 44px

---

## File Reference

| File | Purpose |
|---|---|
| `src/app/globals.css` | All theme tokens, animations, utility classes |
| `src/components/icons/AlloyLogo.tsx` | Brand logo SVG |
| `src/components/icons/index.tsx` | All icon components |
| `src/components/ui/Button.tsx` | Button variants |
| `src/components/ui/Card.tsx` | Card component |
| `src/components/ui/Badge.tsx` | Badge variants |
| `src/components/ui/CodeBlock.tsx` | Terminal-style code blocks |
| `src/components/ui/SectionHeading.tsx` | Centered section headings |
| `src/components/effects/ForgeSparks.tsx` | Particle effect |
| `src/components/effects/EmberGlow.tsx` | Radial glow backgrounds |
| `src/components/effects/GridOverlay.tsx` | Grid texture overlay |
| `src/lib/constants.ts` | Site metadata, nav items, external links |
