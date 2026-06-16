# DESIGN — Sargasses Gwada

Design tokens live in `src/index.css` under `@theme`. Use the token names below
(e.g. `text-ink-soft`, `bg-sea-deep`, `var(--color-lvl3)`), never raw hex.

## Color (OKLCH)

Neutrals are tinted toward the brand hues; never `#000` / `#fff`.

**Paper world** (bulletin, hero, trend card)
- `paper` `oklch(0.949 0.021 86)` — warm parchment page
- `paper-deep` `oklch(0.915 0.028 84)` · `card` `oklch(0.967 0.014 86)`
- `line` `oklch(0.842 0.03 82)` — parchment hairline
- `ink` `oklch(0.34 0.052 233)` abyssal teal-navy · `ink-soft` · `ink-faint`

**Sea world** (immersive sections, chart bathymetry)
- `sea-deep` `oklch(0.42 0.088 234)` → `sea` → `sea-mid` — deep-to-shelf gradient
- `reef-1/2/3` — turquoise shallow-water bands, lightening shoreward
- `foam` `oklch(0.965 0.014 200)` — near-white coastline stroke & on-sea text

**Land**
- `land-coast` → `land` → `land-mid` → `land-deep` `oklch(0.43 0.078 145)`
- `land-edge` — darkest, for the Soufrière summit. Basse-Terre is filled with a
  radial relief gradient centred on the volcanic massif.

**Alert levels** (stranding intensity)
- `lvl0` Nul (muted sage) · `lvl1` Faible (gold) · `lvl2` Modéré (orange) ·
  `lvl3` Massif (rust red) · `accent` warm amber (held off `lvl2`'s hue so it
  stays distinct).
- Lightness steps **down** monotonically `lvl1`→`lvl3` and chroma rises with
  severity, so the ramp also reads in greyscale / for colour-blind viewers.
  `lvl3` and `ink-faint` are tuned to clear WCAG AA (4.5:1) as text on paper.

## Typography

- **Display / map labels:** `Spectral` (serif). Big editorial headlines + the
  italic toponyms on the chart ("Océan Atlantique", island names). Replaced
  Instrument Serif (an AI-default) for a more characterful, literary voice.
- **Body / UI:** `Archivo` (humanist grotesque).
- **Mono / data / coordinates:** `Fragment Mono` — the "instrument" layer:
  graticule labels, level badges, volumes, eyebrows.
- Fluid headline scale via `clamp()`; ≥1.25 ratio between steps.

## Layout & rhythm

- `max-w-320` content column, generous fluid section padding.
- Stats are **ruled** (divided by hairlines), never boxed cards.
- The page alternates paper ↔ sea via the `WaveDivider` SVG swell.

## Motion

- Section reveals: `opacity` + `y`, ease-out, `whileInView` once.
- Chart: bars grow via `scaleY` (transform-origin bottom); coast currents drift
  via `stroke-dashoffset`; massif sites pulse a `halo`; frond `bob`s.
- Off-screen loops paused via `anim-paused`; all disabled under
  `prefers-reduced-motion`.

## Key components

- `ChartMap` — the marine chart. Real coastlines from `data/coastline.ts`,
  projected by `lib/geo.ts`. Layers: sea gradient → reef halos → land + relief →
  toponyms → graticule/compass/scale → stranding markers (concentric targets
  sized by volume) → legend cartouche. Markers have a transparent hit-circle for
  touch; selection syncs with `SiteList`.
- `SiteList` — ranked sites on a translucent sea panel; volume bars per row.
- `TrendChart` — 14-day bars on a paper card, last day red, alert-threshold line.
- `Hero` — editorial headline, ruled stats, sargassum frond + bathymetric rings.
- `BulletinBar` / `Footer` — wordmark + status pill / colophon.
