# 🛠️ Development — Sargasses Gwada

> How to run, lint, and build the demo locally.

## 📦 Prerequisites

- **Node.js** ≥ 20
- **pnpm** (the only supported package manager — never `npm`/`yarn`)
- **pre-commit** (Python) for the git hooks: `pipx install pre-commit` or `uv tool install pre-commit`

## 🚀 Setup

```bash
pnpm install          # install dependencies
pre-commit install    # enable git hooks (ESLint + Prettier + base checks)
```

## 💻 Running locally

```bash
pnpm dev              # Vite dev server (hot reload)
pnpm build            # tsc -b && vite build → dist/
pnpm preview          # serve the production build
pnpm lint             # eslint .
```

## ✅ Code quality

- **Linter/formatter:** ESLint 9 (flat config, `eslint.config.js`) + Prettier (`.prettierrc`).
- **Types:** TypeScript strict; `pnpm build` runs `tsc -b` before bundling.
- **Hooks:** `.pre-commit-config.yaml` runs ESLint `--fix` and Prettier on staged
  files via the project's pnpm toolchain, plus base hygiene checks
  (trailing whitespace, EOF, YAML, private-key detection).

## 🎨 Conventions

- **UI copy:** French (Antilles bulletin domain). **Code, comments, docs:** English.
- **Design tokens:** use `@theme` tokens in `src/index.css` (`text-ink-soft`,
  `bg-card`, `var(--color-lvl0..3)`) — never new hex values. See `DESIGN.md`.
- **Cartography:** all map positions derive from real lon/lat via `project()` in
  `src/lib/geo.ts`. Never hardcode pixel coordinates. Don't replace the real
  coastlines in `src/data/coastline.ts` with stylised blobs.
- **Animation:** compositor props only; respect `prefers-reduced-motion`; pause
  off-screen loops with the `anim-paused` class.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, …).

## 🔧 Troubleshooting

| Symptom | Fix |
|---------|-----|
| `pnpm dev` port already in use | Vite auto-increments; check the printed URL. |
| pre-commit hook can't find `pnpm` | Ensure pnpm is on `PATH` in the shell that runs git. |
| Map labels overflow the SVG | Positions come from `project()`; adjust the lon/lat, not the pixels. |
| Build fails on `tsc -b` | Type error — `pnpm build` surfaces the file/line. |
