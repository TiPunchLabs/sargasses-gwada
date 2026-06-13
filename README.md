# 🌊 Sargasses Gwada

Demo dashboard tracking **sargassum strandings** on the coastlines of the Guadeloupe archipelago.

A single-page React app styled as an oceanographic surveillance bulletin: a hand-projected SVG
nautical chart of the archipelago with interactive stranding sites, a ranked site list, and a
14-day trend chart.

> ⚠️ **Warning**: all figures are fictional, generated for demo purposes. They mimic the format of
> the Météo-France / DEAL Guadeloupe sargassum surveillance bulletins.

## 🛠️ Stack

- React 19 + TypeScript + Vite 7
- Tailwind CSS 4 (`@tailwindcss/vite`)
- Motion (`motion/react`) for entrance animations
- Custom SVG cartography — no map or chart library

## 📝 Getting Started

```bash
pnpm install
pnpm dev        # start dev server
pnpm build      # type-check + production build
pnpm preview    # serve the production build
pnpm lint       # eslint
```

## 🏗️ Structure

```
src/
├── data/strandings.ts     # demo dataset: sites, levels, daily series
├── lib/geo.ts             # equirectangular projection + island outlines
├── lib/utils.ts           # cn() class merge, number formatting
└── components/
    ├── BulletinBar.tsx    # top bulletin strip
    ├── Hero.tsx           # editorial header + key figures
    ├── ChartMap.tsx       # interactive nautical chart (SVG)
    ├── SiteList.tsx       # ranked stranding sites
    ├── TrendChart.tsx     # 14-day daily volume series
    └── Footer.tsx
```

## 📚 License

MIT
