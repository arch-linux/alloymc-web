# Project Website

## What This Is

The public-facing website for a brand new, from-scratch Minecraft modding ecosystem. This is not a fork, not a reskin, not built on top of anything that came before it. Every piece — the mod loader, the modding API, the mappings pipeline, the modpack format, the launcher — is original.

The existing players in this space are complacent, stuck supporting ancient versions, drowning in technical debt, and fractured by governance drama. This project exists to make all of them obsolete.

**Domain:** alloymc.net
**Tagline:** "Forged with Alloy"
**Name:** Alloy

## Purpose of This Website

1. **Announce the project** — clearly communicate what Alloy is and why it exists
2. **Attract developers** — modders need to see that this is worth building on
3. **Provide documentation** — getting started guides, API reference (future)
4. **Distribute downloads** — launcher, installer, mod templates
5. **Build community** — links to Discord, GitHub, forums

## Tech Stack

| Tool | Choice |
|---|---|
| Framework | **Next.js** (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Hosting | **Cloudflare Pages** |
| Package manager | bun or npm |

### Cloudflare Pages Requirements

- Must use `next export` or Next.js static export mode, OR use `@cloudflare/next-on-pages` for edge SSR
- No Node.js server runtime — Cloudflare Pages runs on Workers (V8 isolates)
- Environment variables via Cloudflare dashboard, not .env in production
- Build command and output directory must be configured for Cloudflare's build system

## Design Direction

### Visual Identity

This is a Minecraft project — the design should feel like it **belongs** in that world without being childish or gimmicky.

- **Color palette:** Deep, rich tones. Think molten metal, obsidian, dark stone, warm ember glow. Not pastel, not neon, not generic SaaS blue.
- **Typography:** Clean and modern but with weight. Not a pixel font (overdone), but something that feels solid and intentional. A good sans-serif for body, potentially a bolder display font for headings.
- **Textures:** Subtle nods to Minecraft's aesthetic — very faint blocky/grid patterns, stone or metal textures in backgrounds, particle effects that feel like forge sparks or molten drops. Tasteful, not cosplay.
- **Tone:** Confident, direct, a little rebellious. This project exists because the old guard stopped innovating. The copy should reflect that without being petty or aggressive — let the work speak.

### Key Pages

1. **Home / Landing** — Hero with tagline, quick pitch (3 bullets max), call to action (download/get started), visual flair
2. **About** — What this is, why it exists, the philosophy (future-proof, developer-first, automated, no legacy baggage)
3. **Getting Started** — For modders: how to set up a dev environment, create a first mod (placeholder content initially)
4. **Downloads** — Launcher, installer, mod template downloads
5. **Docs** — API documentation, guides, tutorials (future, can be placeholder)
6. **Community** — Discord invite, GitHub link, contribution guide

### Design Principles

- **Fast.** The site itself should load instantly. No heavy frameworks, no unnecessary JS, no layout shift. Practice what we preach.
- **Responsive.** Must look great on mobile. Modders browse on phones too.
- **Accessible.** Proper contrast ratios, semantic HTML, keyboard navigation. Not optional.
- **No generic AI look.** No gradient blobs, no floating abstract shapes, no stock illustrations of people at computers. This should look like a real project with real identity, not a template.

### Visual References (Mood)

- The warmth of molten metal being poured
- Anvil sparks in a dark forge
- The deep blacks and warm oranges of Minecraft's Nether
- Clean developer documentation sites (Stripe, Vercel) but with personality
- The confidence of a project that knows it's better

## Content Tone

- First person plural ("we") — this is a team/community, not a corporation
- Direct, no filler — say what it is, say why, move on
- Technical confidence — don't dumb it down, our audience is developers
- Subtle swagger — we're not here to participate, we're here to lead

## Build & Deploy

```bash
# Development
bun install
bun run dev

# Build for Cloudflare Pages
bun run build

# Preview production build locally
bun run preview
```

**Cloudflare Pages config:**
- Build command: `bun run build`
- Build output directory: `out/` (for static export) or `.vercel/output/static` (for @cloudflare/next-on-pages)
- Node.js version: 20+

## Important Notes

- Do NOT use `next/image` with the default loader — Cloudflare Pages doesn't support Next.js image optimization. Use a custom loader or standard `<img>` tags with optimized assets.
- All API routes (if any) must be compatible with Cloudflare Workers runtime (no Node.js APIs like `fs`, `path`, etc.)
- Favor static generation (`generateStaticParams`) over dynamic rendering where possible
- Keep bundle size minimal — this site should be a showcase of performance
