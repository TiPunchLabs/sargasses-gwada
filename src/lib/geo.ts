/**
 * Equirectangular projection of the Guadeloupe archipelago onto SVG space,
 * with a cos(latitude) correction so the islands keep their true proportions
 * (a plain lon/lat mapping would stretch the archipelago east-west).
 *
 * Catmull-Rom smoothing turns the decimated coastline vertices into the soft,
 * hand-engraved curves of an old marine chart.
 */

import type { Pt } from '../data/coastline'

export type { Pt }

// Framing bounds for the archipelago, with a margin of open sea on every side.
const LON_MIN = -61.86
const LON_MAX = -60.95
const LAT_MIN = 15.8
const LAT_MAX = 16.56

const LAT_MID = (LAT_MIN + LAT_MAX) / 2
const COS_LAT = Math.cos((LAT_MID * Math.PI) / 180)

export const MAP_H = 900
export const MAP_W = Math.round((MAP_H * ((LON_MAX - LON_MIN) * COS_LAT)) / (LAT_MAX - LAT_MIN))

/** Project [lon, lat] to SVG [x, y]. */
export function project(lon: number, lat: number): Pt {
  const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * MAP_W
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * MAP_H
  return [x, y]
}

/** Kilometres-per-degree-longitude at this latitude, for the scale bar. */
export const KM_PER_LON = 111.32 * COS_LAT

function catmullSegment(p0: Pt, p1: Pt, p2: Pt, p3: Pt): string {
  const c1x = p1[0] + (p2[0] - p0[0]) / 6
  const c1y = p1[1] + (p2[1] - p0[1]) / 6
  const c2x = p2[0] - (p3[0] - p1[0]) / 6
  const c2y = p2[1] - (p3[1] - p1[1]) / 6
  return ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
}

/** Closed smooth path through projected points (coastlines). */
export function smoothClosedPath(pts: Pt[]): string {
  const n = pts.length
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 0; i < n; i++) {
    d += catmullSegment(pts[(i - 1 + n) % n], pts[i], pts[(i + 1) % n], pts[(i + 2) % n])
  }
  return d + ' Z'
}

/** Open smooth path through points (currents, annotations). */
export function smoothOpenPath(pts: Pt[]): string {
  const n = pts.length
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)]
    const p3 = pts[Math.min(i + 2, n - 1)]
    d += catmullSegment(p0, pts[i], pts[i + 1], p3)
  }
  return d
}

/** Project a coastline ring (lon/lat) and return its smoothed SVG path. */
export function coastPath(ring: Pt[]): string {
  return smoothClosedPath(ring.map(([lon, lat]) => project(lon, lat)))
}
