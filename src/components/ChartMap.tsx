import { useRef, type CSSProperties } from 'react'
import { useInView } from 'motion/react'
import { ISLANDS } from '../data/coastline'
import { coastPath, KM_PER_LON, MAP_H, MAP_W, project } from '../lib/geo'
import { LEVELS, SITES, type StrandingSite } from '../data/strandings'
import { cn, fmt } from '../lib/utils'
import { useIsMobile } from '../lib/useMediaQuery'

interface ChartMapProps {
  selectedId: string
  onSelect: (id: string) => void
}

/** Graticule meridians / parallels, labelled in degrees-minutes. */
const GRATICULE_LON = [
  { lon: -61.75, label: '61°45′ O' },
  { lon: -61.5, label: '61°30′ O' },
  { lon: -61.25, label: '61°15′ O' },
  { lon: -61.0, label: '61°00′ O' },
]
const GRATICULE_LAT = [
  { lat: 16.5, label: '16°30′ N' },
  { lat: 16.25, label: '16°15′ N' },
  { lat: 16.0, label: '16°00′ N' },
]

/** Island names, placed at real coordinates and tracked wide like chart titling. */
const ISLAND_LABELS: Array<{ text: string; lon: number; lat: number; size: number }> = [
  { text: 'BASSE-TERRE', lon: -61.715, lat: 16.18, size: 21 },
  { text: 'GRANDE-TERRE', lon: -61.42, lat: 16.36, size: 21 },
  { text: 'MARIE-GALANTE', lon: -61.266, lat: 15.985, size: 14 },
  { text: 'LA DÉSIRADE', lon: -61.05, lat: 16.276, size: 12 },
  { text: 'LES SAINTES', lon: -61.595, lat: 15.825, size: 12 },
]

/** Coastal features, set in italic with a hairline leader to their location. */
const FEATURES: Array<{
  text: string
  lon: number
  lat: number
  to?: [number, number]
  anchor?: 'start' | 'middle' | 'end'
  rotate?: number
}> = [
  { text: 'Grand Cul-de-Sac Marin', lon: -61.61, lat: 16.4, to: [-61.55, 16.36], anchor: 'middle' },
  { text: 'Rivière Salée', lon: -61.46, lat: 16.205, to: [-61.535, 16.235], anchor: 'start' },
  {
    text: 'Pointe des Châteaux',
    lon: -61.14,
    lat: 16.205,
    to: [-61.195, 16.247],
    anchor: 'start',
  },
  { text: 'Pointe de la Grande Vigie', lon: -61.41, lat: 16.53, anchor: 'start' },
]

/** Atlantic drift: sargassum rafts arriving from the open east. */
const CURRENTS: Array<[number, number][]> = [
  [
    [-60.96, 16.42],
    [-61.08, 16.38],
    [-61.2, 16.31],
    [-61.28, 16.26],
  ],
  [
    [-60.96, 16.1],
    [-61.05, 16.12],
    [-61.14, 16.18],
    [-61.21, 16.22],
  ],
  [
    [-60.97, 15.92],
    [-61.08, 15.93],
    [-61.18, 15.95],
    [-61.26, 15.96],
  ],
]

const SOUFRIERE: [number, number] = [-61.664, 16.044]

function markerRadius(site: StrandingSite, scale = 1): number {
  if (site.level === 0) return 4.5 * scale
  return (7 + (site.volumeM3 / 480) * 15) * scale
}

function tooltipStyle(x: number, y: number): CSSProperties {
  // Sit the card beside the marker, pushed toward the open sea so it never
  // blankets the island. Clamp vertically near the chart edges.
  const toRight = x < MAP_W * 0.52
  const ty = y < MAP_H * 0.2 ? '0%' : y > MAP_H * 0.8 ? '-100%' : '-50%'
  return {
    left: `${(x / MAP_W) * 100}%`,
    top: `${(y / MAP_H) * 100}%`,
    transform: `translate(${toRight ? '20px' : 'calc(-100% - 20px)'}, ${ty})`,
  }
}

function curveD(pts: [number, number][]): string {
  const p = pts.map(([lon, lat]) => project(lon, lat))
  let d = `M ${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`
  for (let i = 1; i < p.length; i++) {
    const prev = p[i - 1]
    const cx = (prev[0] + p[i][0]) / 2
    const cy = (prev[1] + p[i][1]) / 2
    d += ` Q ${prev[0].toFixed(1)} ${prev[1].toFixed(1)}, ${cx.toFixed(1)} ${cy.toFixed(1)}`
  }
  d += ` T ${p[p.length - 1][0].toFixed(1)} ${p[p.length - 1][1].toFixed(1)}`
  return d
}

// Pre-projected anchors used in the markup below.
const islandPaths = ISLANDS.map((i) => ({ ...i, d: coastPath(i.ring) }))
const [souX, souY] = project(SOUFRIERE[0], SOUFRIERE[1])
const reliefCenter = project(-61.685, 16.13)
const [scaleX0] = project(-61.5, 16)
const [scaleX1] = project(-61.5 + 10 / KM_PER_LON, 16)
const SCALE_LEN = scaleX1 - scaleX0

export function ChartMap({ selectedId, onSelect }: ChartMapProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const inView = useInView(frameRef)
  const isMobile = useIsMobile()
  const selected = SITES.find((s) => s.id === selectedId)
  const selectedPt = selected ? project(selected.lon, selected.lat) : null

  // The map scales to container width, so on a phone every label/marker shrinks
  // to a few pixels. Enlarge the type, fatten markers, and drop the densest
  // instrument layers (graticule labels, scale bar, coastal-feature leaders) so
  // the chart stays legible without overcrowding the small frame.
  const k = isMobile ? 1.9 : 1 // label type multiplier
  const mk = isMobile ? 1.4 : 1 // marker radius multiplier
  const fs = (n: number) => n * k

  return (
    <div
      ref={frameRef}
      className={cn(
        'relative overflow-hidden rounded-[14px] bg-sea-deep shadow-[0_24px_60px_-28px_oklch(0.2_0.06_233/0.85)] ring-1 ring-foam/25',
        !inView && 'anim-paused',
      )}
    >
      <div className="relative m-[7px] overflow-hidden rounded-[8px] ring-1 ring-foam/20">
        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          className="block w-full"
          role="img"
          aria-label="Carte marine des sites d'échouage de sargasses de l'archipel guadeloupéen"
        >
          <defs>
            <radialGradient
              id="sea"
              cx={project(-61.45, 16.18)[0]}
              cy={project(-61.45, 16.18)[1]}
              r={MAP_W * 0.62}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="var(--color-sea-mid)" />
              <stop offset="0.55" stopColor="var(--color-sea)" />
              <stop offset="1" stopColor="var(--color-sea-deep)" />
            </radialGradient>

            <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--color-land-coast)" />
              <stop offset="1" stopColor="var(--color-land)" />
            </linearGradient>

            <radialGradient
              id="relief"
              cx={reliefCenter[0]}
              cy={reliefCenter[1]}
              r={MAP_H * 0.3}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="var(--color-land-deep)" />
              <stop offset="0.5" stopColor="var(--color-land-mid)" />
              <stop offset="1" stopColor="var(--color-land)" />
            </radialGradient>

            <marker
              id="current-arrow"
              viewBox="0 0 8 8"
              refX="6"
              refY="4"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 8 4 L 0 8 z" fill="var(--color-foam)" opacity="0.7" />
            </marker>

            <clipPath id="clip-bt">
              <path d={islandPaths.find((i) => i.id === 'basseTerre')!.d} />
            </clipPath>
          </defs>

          {/* Open sea */}
          <rect width={MAP_W} height={MAP_H} fill="url(#sea)" />

          {/* Graticule — instrument detail, dropped on phones to cut clutter */}
          <g
            className="font-mono"
            fill="var(--color-foam)"
            fontSize="11"
            opacity="0.5"
            display={isMobile ? 'none' : undefined}
          >
            {GRATICULE_LON.map(({ lon, label }) => {
              const [x] = project(lon, 16)
              return (
                <g key={label}>
                  <line
                    x1={x}
                    y1={0}
                    x2={x}
                    y2={MAP_H}
                    stroke="var(--color-foam)"
                    strokeWidth="0.6"
                    strokeDasharray="1 7"
                    opacity="0.55"
                  />
                  <text x={x + 6} y={MAP_H - 12}>
                    {label}
                  </text>
                </g>
              )
            })}
            {GRATICULE_LAT.map(({ lat, label }) => {
              const [, y] = project(-61.5, lat)
              return (
                <g key={label}>
                  <line
                    x1={0}
                    y1={y}
                    x2={MAP_W}
                    y2={y}
                    stroke="var(--color-foam)"
                    strokeWidth="0.6"
                    strokeDasharray="1 7"
                    opacity="0.55"
                  />
                  <text x={10} y={y - 7}>
                    {label}
                  </text>
                </g>
              )
            })}
          </g>

          {/* Atlantic drift currents */}
          <g>
            {CURRENTS.map((pts, i) => (
              <path
                key={i}
                d={curveD(pts)}
                fill="none"
                stroke="var(--color-foam)"
                strokeWidth="1.5"
                strokeDasharray="2 9"
                strokeLinecap="round"
                opacity="0.5"
                markerEnd="url(#current-arrow)"
                className="drift-path"
              />
            ))}
            <text
              x={project(-61.02, 16.02)[0]}
              y={project(-61.02, 16.02)[1]}
              fontSize={fs(12.5)}
              fontStyle="italic"
              fill="var(--color-foam)"
              opacity="0.78"
              textAnchor="end"
              transform={`rotate(-8 ${project(-61.02, 16.02)[0]} ${project(-61.02, 16.02)[1]})`}
              className="font-display"
            >
              dérive atlantique
            </text>
          </g>

          {/* Reef shelves + land */}
          {islandPaths.map((isl) => {
            const reef = isl.kind === 'main' ? [38, 24, 13, 5] : [16, 9, 4]
            return (
              <g key={isl.id}>
                <path d={isl.d} fill="none" stroke="var(--color-reef-1)" strokeWidth={reef[0]} strokeLinejoin="round" opacity="0.45" />
                <path d={isl.d} fill="none" stroke="var(--color-reef-2)" strokeWidth={reef[1]} strokeLinejoin="round" opacity="0.55" />
                <path d={isl.d} fill="none" stroke="var(--color-reef-3)" strokeWidth={reef[2]} strokeLinejoin="round" opacity="0.7" />
                {reef[3] && (
                  <path d={isl.d} fill="none" stroke="var(--color-foam)" strokeWidth={reef[3]} strokeLinejoin="round" opacity="0.85" />
                )}
              </g>
            )
          })}
          {islandPaths.map((isl) => (
            <path
              key={isl.id}
              d={isl.d}
              fill={isl.id === 'basseTerre' ? 'url(#relief)' : 'url(#land)'}
              stroke="var(--color-foam)"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          ))}

          {/* Basse-Terre relief — forested ridge of the volcanic spine */}
          <g clipPath="url(#clip-bt)" stroke="var(--color-land-deep)" fill="none" opacity="0.34">
            <path d={curveD([[-61.715, 16.3], [-61.7, 16.22], [-61.685, 16.13], [-61.668, 16.05], [-61.66, 15.99]])} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            <path d={curveD([[-61.735, 16.25], [-61.722, 16.17], [-61.708, 16.09], [-61.7, 16.03]])} strokeWidth="1.4" strokeLinecap="round" />
            <path d={curveD([[-61.692, 16.26], [-61.676, 16.17], [-61.657, 16.09], [-61.642, 16.02]])} strokeWidth="1.4" strokeLinecap="round" />
          </g>

          {/* Soufrière summit */}
          <g>
            <path
              d={`M ${souX} ${souY - 7} L ${souX + 6} ${souY + 4} L ${souX - 6} ${souY + 4} Z`}
              fill="var(--color-land-edge)"
              stroke="var(--color-foam)"
              strokeWidth="0.8"
            />
            <text
              x={souX + (isMobile ? 16 : 12)}
              y={souY + 4}
              fontSize={fs(11)}
              fontStyle="italic"
              fill="var(--color-foam)"
              className="font-display"
            >
              La Soufrière ▴ 1 467 m
            </text>
          </g>

          {/* Coastal feature labels — leader-lined toponyms, too dense for phones */}
          <g
            className="font-display"
            fill="var(--color-foam)"
            fontStyle="italic"
            fontSize="12"
            display={isMobile ? 'none' : undefined}
          >
            {FEATURES.map((f) => {
              const [x, y] = project(f.lon, f.lat)
              const to = f.to ? project(f.to[0], f.to[1]) : null
              return (
                <g key={f.text} opacity="0.9">
                  {to && (
                    <line
                      x1={x}
                      y1={y}
                      x2={to[0]}
                      y2={to[1]}
                      stroke="var(--color-foam)"
                      strokeWidth="0.7"
                      opacity="0.6"
                    />
                  )}
                  <text x={x} y={y} textAnchor={f.anchor ?? 'middle'}>
                    {f.text}
                  </text>
                </g>
              )
            })}
          </g>

          {/* Island names */}
          <g
            className="font-display"
            fill="var(--color-land-edge)"
            fontStyle="italic"
            textAnchor="middle"
          >
            {ISLAND_LABELS.map((l) => {
              const [x, y] = project(l.lon, l.lat)
              return (
                <text key={l.text} x={x} y={y} fontSize={fs(l.size)} letterSpacing="0.04em">
                  {l.text}
                </text>
              )
            })}
          </g>

          {/* Sea names — widely tracked; tighten spacing on phones so they fit */}
          <g
            fill="var(--color-foam)"
            fontStyle="italic"
            letterSpacing={isMobile ? '0.16em' : '0.3em'}
            textAnchor="middle"
            opacity="0.6"
            className="font-display"
          >
            <text
              x={project(-61.16, 16.5)[0]}
              y={project(-61.16, 16.5)[1]}
              fontSize={isMobile ? 26 : 18}
            >
              OCÉAN ATLANTIQUE
            </text>
            <text
              x={project(-61.73, 15.89)[0]}
              y={project(-61.73, 15.89)[1]}
              fontSize={isMobile ? 23 : 16}
            >
              MER DES CARAÏBES
            </text>
          </g>

          {/* Compass rose */}
          <g
            transform={`translate(${MAP_W - 74}, 74)`}
            stroke="var(--color-foam)"
            fill="none"
            opacity="0.85"
          >
            <circle r="26" strokeWidth="1" opacity="0.6" />
            <circle r="2" fill="var(--color-foam)" stroke="none" />
            <path d="M 0 20 L 0 -20" strokeWidth="1" />
            <path d="M 0 -20 L -5 -9 L 5 -9 Z" fill="var(--color-foam)" stroke="none" />
            <text
              y="-34"
              textAnchor="middle"
              fill="var(--color-foam)"
              stroke="none"
              fontSize={fs(13)}
              className="font-mono"
            >
              N
            </text>
          </g>

          {/* Scale bar — dropped on phones to cut clutter */}
          <g
            transform={`translate(44, ${MAP_H - 46})`}
            stroke="var(--color-foam)"
            strokeWidth="1.3"
            opacity="0.85"
            display={isMobile ? 'none' : undefined}
          >
            <line x1="0" y1="0" x2={SCALE_LEN} y2="0" />
            <line x1="0" y1="-4" x2="0" y2="4" />
            <line x1={SCALE_LEN} y1="-4" x2={SCALE_LEN} y2="4" />
            <text
              x={SCALE_LEN / 2}
              y="16"
              textAnchor="middle"
              stroke="none"
              fill="var(--color-foam)"
              fontSize="11"
              className="font-mono"
            >
              10 km
            </text>
          </g>

          {/* Stranding sites */}
          <g>
            {SITES.map((site) => {
              const [x, y] = project(site.lon, site.lat)
              const r = markerRadius(site, mk)
              const color = LEVELS[site.level].cssVar
              const isSelected = site.id === selectedId
              const hit = isMobile ? Math.max(r + 8, 30) : Math.max(r + 5, 15)
              const label = `${site.name} — niveau ${LEVELS[site.level].label}, ${fmt(site.volumeM3)} mètres cubes sur 7 jours`
              return (
                <g key={site.id} className="group">
                  {site.level === 3 && (
                    <circle cx={x} cy={y} r={r} fill={color} opacity="0.5" className="halo" />
                  )}
                  {isSelected && (
                    <circle
                      cx={x}
                      cy={y}
                      r={r + 6}
                      fill="none"
                      stroke="var(--color-foam)"
                      strokeWidth="1.1"
                      strokeDasharray="2 3"
                    />
                  )}
                  <g
                    className="transition-transform duration-150 ease-out group-hover:scale-125 group-focus-within:scale-125"
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  >
                    {site.level === 0 ? (
                      <circle
                        cx={x}
                        cy={y}
                        r={r}
                        fill="none"
                        stroke="var(--color-foam)"
                        strokeWidth="1.6"
                        strokeDasharray="2 2.5"
                      />
                    ) : (
                      <>
                        <circle cx={x} cy={y} r={r} fill={color} opacity="0.2" />
                        {/* Foam casing lifts the coloured ring off the dark water,
                            so severity reads without darkening the lvl tokens. */}
                        <circle
                          cx={x}
                          cy={y}
                          r={r * 0.66}
                          fill="none"
                          stroke="var(--color-foam)"
                          strokeWidth="3.4"
                          opacity="0.45"
                        />
                        <circle cx={x} cy={y} r={r * 0.66} fill="none" stroke={color} strokeWidth="2.2" />
                        <circle
                          cx={x}
                          cy={y}
                          r={r * 0.34}
                          fill={color}
                          stroke="var(--color-foam)"
                          strokeWidth="1.4"
                        />
                      </>
                    )}
                  </g>
                  <circle
                    cx={x}
                    cy={y}
                    r={hit}
                    fill="transparent"
                    role="button"
                    tabIndex={0}
                    aria-label={label}
                    className="cursor-pointer"
                    onClick={() => onSelect(site.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onSelect(site.id)
                      }
                    }}
                  />
                </g>
              )
            })}
          </g>
        </svg>

        {/* Legend cartouche */}
        <div className="absolute top-3 left-3 hidden max-w-64 rounded-[6px] border border-ink/15 bg-paper/92 px-4 py-3 shadow-sm backdrop-blur-[1px] sm:block">
          <p className="font-mono text-[10px] tracking-[0.18em] text-ink-soft uppercase">
            Niveau d’échouage
          </p>
          <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-1.5">
            {([3, 2, 1, 0] as const).map((lvl) => (
              <span key={lvl} className="flex items-center gap-2 font-mono text-[10px] uppercase">
                <span
                  className="inline-block size-2.5 rounded-full"
                  style={{
                    backgroundColor: lvl === 0 ? 'transparent' : LEVELS[lvl].cssVar,
                    border: `1.5px solid ${lvl === 0 ? 'var(--color-ink-faint)' : LEVELS[lvl].cssVar}`,
                  }}
                  aria-hidden="true"
                />
                {LEVELS[lvl].label}
              </span>
            ))}
          </div>
          <p className="mt-2.5 border-t border-line pt-2 font-mono text-[9.5px] leading-relaxed text-ink-faint">
            Ø du cercle ∝ volume échoué / 7 j
          </p>
        </div>

        {/* Tooltip for the selected site */}
        {selected && selectedPt && (
          <div
            className="pointer-events-none absolute z-10 hidden w-60 rounded-[6px] border border-ink/15 bg-paper/96 px-4 py-3 shadow-md sm:block"
            style={tooltipStyle(selectedPt[0], selectedPt[1])}
          >
            <p className="font-display text-lg leading-tight">{selected.name}</p>
            <p className="mt-0.5 font-mono text-[10px] text-ink-soft uppercase">{selected.commune}</p>
            <p className="mt-2 flex items-baseline gap-3 font-mono text-xs">
              <span style={{ color: LEVELS[selected.level].cssVar }} className="uppercase">
                ● {LEVELS[selected.level].label}
              </span>
              <span className="tabular-nums">{fmt(selected.volumeM3)} m³ / 7 j</span>
            </p>
            <p className="mt-2 text-[13px] leading-snug text-pretty text-ink-soft">{selected.note}</p>
          </div>
        )}
      </div>

      {/* Compact selected-site strip, small screens only */}
      <div className="px-4 pt-1 pb-3 sm:hidden">
        {selected && (
          <>
            <p className="flex items-baseline justify-between gap-3 text-foam">
              <span className="font-display text-lg leading-tight">{selected.name}</span>
              <span className="font-mono text-xs tabular-nums">
                {fmt(selected.volumeM3)} m³ / 7 j
              </span>
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase">
              <span style={{ color: LEVELS[selected.level].cssVar }}>
                ● {LEVELS[selected.level].label}
              </span>
              <span className="text-reef-2"> · {selected.commune}</span>
            </p>
          </>
        )}
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-foam/20 pt-2.5">
          {([3, 2, 1, 0] as const).map((lvl) => (
            <span
              key={lvl}
              className="flex items-center gap-1.5 font-mono text-[10px] text-foam uppercase"
            >
              <span
                className="inline-block size-2 rounded-full"
                style={{
                  backgroundColor: lvl === 0 ? 'transparent' : LEVELS[lvl].cssVar,
                  border: `1.5px solid ${lvl === 0 ? 'var(--color-foam)' : LEVELS[lvl].cssVar}`,
                }}
                aria-hidden="true"
              />
              {LEVELS[lvl].label}
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}
