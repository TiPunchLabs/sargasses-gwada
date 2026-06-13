# PRODUCT — Sargasses Gwada

## Register

**brand** — this is a single-page demo whose entire purpose is the impression it
leaves. The design *is* the product: an oceanographic stranding bulletin meant to
look like it was published by a real Antilles coastal-monitoring service, not a
generic dashboard template.

## Product purpose

Show, at a glance, *where* sargassum seaweed is washing ashore across the
Guadeloupe archipelago this week, *how severe* it is per site, and *which way the
trend is heading*. A weekly "bulletin d'échouage", styled after the Météo-France /
DEAL Guadeloupe surveillance bulletins. All figures are fictional but plausible
and internally consistent.

## Users

- **Primary (in-fiction):** a coastal-monitoring officer or municipal services
  agent scanning the week's strandings in broad daylight in the French Antilles —
  reads the map first, the ranking second, the trend last.
- **Real audience:** a portfolio/demo viewer judging craft. The page has to read
  as "how was this *made*", not "which AI made this".

## Brand & tone

Cartographic, scientific, warm. An engraved 19th-century marine chart crossed with
a contemporary field report. French UI copy (Antilles bulletin domain); English
code, comments and docs. Authoritative but not alarmist; the data carries the
weight, the chrome stays quiet.

## Anti-references (what it must NOT become)

- Generic SaaS dashboard (hero-metric cards, icon+title+text grids).
- A childish blob map. The Guadeloupe coastline is rendered from **real WGS84
  coordinates**; geographic realism is the signature, non-negotiable move.
- Editorial-magazine slop (display-serif + italic + ruled columns with nothing
  underneath). The editorial typography is earned by the cartography beneath it.
- Gradient text, side-stripe accent borders, em dashes, decorative glassmorphism.

## Strategic principles

1. **The map is the hero.** Every other section supports the chart; realism and
   legibility of the archipelago come first.
2. **Two worlds, one voice.** Warm paper bulletin for reading; immersive deep-sea
   blue for the chart. The wave divider is the seam between them.
3. **Hand-rolled cartography on purpose.** No map or chart library — SVG, a custom
   cos-corrected equirectangular projection, real coastlines.
4. **Quiet motion.** Compositor-only animation, orchestrated reveals, honoured
   `prefers-reduced-motion`.
