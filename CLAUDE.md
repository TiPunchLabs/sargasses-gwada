# Sargasses Gwada — demo dashboard

Single-page React demo showing sargassum strandings in Guadeloupe, styled as an oceanographic
bulletin (paper / ink / sargassum-amber palette).

## Project Type

Node frontend — React 19 + TypeScript + Vite 7 + Tailwind CSS 4.

## Commands

```bash
pnpm dev        # dev server
pnpm build      # tsc -b && vite build
pnpm preview    # serve production build
pnpm lint       # eslint
```

See `PRODUCT.md` (purpose, register, tone, anti-references) and `DESIGN.md` (tokens, type,
components) for the design system of record.

## Structure

- `src/data/strandings.ts` — the whole demo dataset (sites, alert levels, daily totals). All
  figures are fictional; keep them plausible and internally consistent (hero stats are derived).
- `src/data/coastline.ts` — **real** Guadeloupe coastlines as `[lon, lat]` WGS84 rings, simplified
  (Douglas-Peucker) from the official IGN/département-971 outline. The realism of the map is the
  signature move; don't replace these with stylised blobs.
- `src/lib/geo.ts` — cos(latitude)-corrected equirectangular projection (`project(lon, lat)`,
  `coastPath`) + Catmull-Rom smoothing. Map size constants `MAP_W`/`MAP_H` are derived from the
  bounds and the latitude correction; keep them consistent.
- `src/components/ChartMap.tsx` — the SVG marine chart; every position (islands, toponyms, sites)
  is computed from real lon/lat via `project()`, never hardcoded.
- `WaveDivider`, `SargassumFrond`, `Hero`, `SiteList`, `TrendChart`, `BulletinBar`, `Footer`.

## Code Style

- UI copy is French (domain: French Antilles bulletin); code, comments and docs are English.
- Theme tokens live in `src/index.css` under `@theme` — use them (`text-ink-soft`, `bg-card`,
  `var(--color-lvl0..3)`) instead of new hex values.
- Animations: compositor props only, respect `prefers-reduced-motion` (handled via
  `MotionConfig reducedMotion="user"` and the CSS media query), looping CSS animations are paused
  off-screen via the `anim-paused` class.
- No map/chart library — cartography and charts are hand-rolled SVG on purpose.
