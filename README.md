# Alloy — alloymc.net

The public-facing website for [Alloy](https://alloymc.net), a from-scratch Minecraft modding ecosystem.

Alloy is not a fork, not a reskin, not built on top of anything that came before it. Every piece — the mod loader, modding API, mappings pipeline, modpack format, launcher, and dev tooling — is original. This site exists to announce the project, attract developers, and serve as the home base for everything Alloy.

## Stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Fonts | Space Grotesk, Inter, JetBrains Mono |
| Hosting | [Cloudflare Pages](https://pages.cloudflare.com) (static export) |
| Package Manager | [Bun](https://bun.sh) |

No heavy dependencies. The only runtime dependency beyond React and Next.js is `clsx` for className composition.

## Getting Started

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Production build (outputs to out/)
bun run build
```

The dev server runs at `http://localhost:3000`.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home — hero, pipeline, terminal demo, comparison
│   ├── about/              # Philosophy, core pillars, roadmap
│   ├── getting-started/    # Step-by-step mod creation guide
│   ├── downloads/          # Launcher, installer, template cards
│   ├── docs/               # Documentation category grid (placeholder)
│   ├── community/          # Discord, GitHub, contributing
│   └── not-found.tsx       # Custom 404
├── components/
│   ├── layout/             # Header, Footer
│   ├── ui/                 # Button, Card, Badge, CodeBlock, SectionHeading
│   ├── effects/            # ForgeSparks, EmberGlow, GridOverlay
│   └── icons/              # Inline SVG components (logo, icons)
└── lib/
    ├── cn.ts               # clsx wrapper
    └── constants.ts        # Site metadata, nav items, external links
```

## Design System

Full design system reference — colors, typography, components, effects — is documented in [`TYPOGRAPHY.md`](./TYPOGRAPHY.md).

The short version:

- **Palette:** Obsidian blacks + ember orange (`#ff6b00`) primary accent + forge gold highlights
- **Fonts:** Space Grotesk for headings, Inter for body, JetBrains Mono for code
- **Effects:** CSS-only forge sparks, radial ember glows, animated pipeline connectors
- **All animations** respect `prefers-reduced-motion`
- **All text** meets WCAG AA contrast requirements

## Deployment

This site is configured for **Cloudflare Pages static export**:

- Build command: `bun run build`
- Output directory: `out/`
- No server runtime required — pure static HTML/CSS/JS

The `next.config.ts` is set to `output: "export"` with `images.unoptimized: true` for Cloudflare compatibility.

## Contributing

Alloy is built in the open. If you want to contribute to the website:

1. Fork the repo
2. Create a branch
3. Make your changes
4. Verify the build passes (`bun run build`)
5. Open a PR

For design changes, reference [`TYPOGRAPHY.md`](./TYPOGRAPHY.md) to stay consistent with the established visual identity.

## License

MIT
