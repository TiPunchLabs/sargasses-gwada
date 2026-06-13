# 🏗️ Architecture — Sargasses Gwada

> Single-page React demo rendering a hand-rolled SVG marine chart of sargassum
> strandings across the Guadeloupe archipelago. No map or chart library: the
> cartography is the signature move.

## 🧠 Mental Model

```
real WGS84 coords ──► projection ──► SVG paths ──► React components ──► page
 (coastline.ts)       (geo.ts)       (ChartMap)     (App composition)

  paper world  ┌───────────────┐  wave   ┌───────────────┐  paper world
  (bulletin) ──┤ BulletinBar    │ divider │ ChartMap +    │── Footer
               │ Hero           ├────────►│ SiteList      │
               └───────────────┘         │ TrendChart    │
                                          └───────────────┘
                                            sea world (immersive blue)
```

The page alternates between two visual "worlds" — a warm paper bulletin for
reading and an immersive deep-sea blue section for the chart — joined by a
`WaveDivider` SVG swell.

## 📐 Module structure

| Path | Responsibility |
|------|----------------|
| `src/data/coastline.ts` | **Real** Guadeloupe coastlines as `[lon, lat]` WGS84 rings, Douglas-Peucker simplified from the official IGN/dépt-971 outline. |
| `src/data/strandings.ts` | The whole demo dataset (sites, alert levels, daily totals). Fictional but internally consistent; hero stats are derived. |
| `src/lib/geo.ts` | cos(latitude)-corrected equirectangular projection (`project`, `coastPath`) + Catmull-Rom smoothing. `MAP_W`/`MAP_H` derived from bounds. |
| `src/components/ChartMap.tsx` | The SVG marine chart. Every position is computed from real lon/lat via `project()`, never hardcoded. |
| `src/components/SiteList.tsx` | Ranked sites on a translucent sea panel; selection syncs with the map. |
| `src/components/TrendChart.tsx` | 14-day bar chart on a paper card with an alert-threshold line. |
| `src/components/Hero.tsx` | Editorial headline, ruled stats, sargassum frond. |
| `src/components/{BulletinBar,WaveDivider,SargassumFrond,Footer}.tsx` | Chrome, section seam, botanical motif, colophon. |
| `src/App.tsx` | Composition + orchestrated `whileInView` reveals. |
| `src/index.css` | `@theme` design tokens (OKLCH), keyframes, reduced-motion rules. |

## 🎯 Key design decisions

| Decision | Rationale |
|----------|-----------|
| Hand-rolled SVG cartography (no library) | Geographic realism from real coordinates is the portfolio signature; libraries would flatten it to a generic basemap. |
| cos(latitude) projection correction | Keeps the archipelago's proportions truthful at ~16°N. |
| OKLCH tokens, tinted neutrals | Perceptually even palette; never `#000`/`#fff`. See `DESIGN.md`. |
| Compositor-only animation | `transform`/`opacity`/`stroke-dashoffset` only; honours `prefers-reduced-motion`. |
| French UI / English code | Domain is a French Antilles bulletin; codebase stays English. |

See `PRODUCT.md` (purpose, register, tone) and `DESIGN.md` (tokens, type,
components) for the design system of record.

## 🔐 Security considerations

Static frontend demo: no backend, no authentication, no secrets, no environment
variables. All data is bundled and fictional. Nothing sensitive ships in the
build.
