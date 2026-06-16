import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { DAILY_LABELS, DAILY_TOTALS, WEEK_DELTA_PCT } from '../data/strandings'
import { fmt } from '../lib/utils'
import { useIsMobile } from '../lib/useMediaQuery'

const Y_MAX = 450
const Y_TICKS = [0, 150, 300, 450]
const THRESHOLD = 300

/**
 * Geometry + type sizing for the two layouts. Because the SVG scales to its
 * container width, on-screen text size depends on `fontSize / W`: the phone
 * layout uses a narrower viewBox (and so larger relative type) plus a taller
 * frame and sparser labels, so nothing collapses to sub-pixel text.
 */
const DESKTOP = {
  W: 1160,
  H: 380,
  PAD: { left: 52, right: 26, top: 40, bottom: 42 },
  barRatio: 0.54,
  fs: { axis: 11, title: 11, threshold: 11, value: 11.5, day: 10.5 },
  everyValue: 1,
  everyDay: 1,
} as const
const MOBILE = {
  W: 540,
  H: 430,
  PAD: { left: 44, right: 16, top: 46, bottom: 52 },
  barRatio: 0.6,
  fs: { axis: 20, title: 18, threshold: 19, value: 23, day: 19 },
  everyValue: 0, // peak + endpoints only
  everyDay: 3,
} as const

export function TrendChart() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const isMobile = useIsMobile()
  const c = isMobile ? MOBILE : DESKTOP

  const { W, H, PAD } = c
  const innerW = W - PAD.left - PAD.right
  const slot = innerW / DAILY_TOTALS.length
  const barW = slot * c.barRatio
  const baseline = H - PAD.bottom
  const lastIdx = DAILY_TOTALS.length - 1
  const peakIdx = DAILY_TOTALS.indexOf(Math.max(...DAILY_TOTALS))

  const yOf = (v: number) => PAD.top + (1 - v / Y_MAX) * (H - PAD.top - PAD.bottom)
  const xOf = (i: number) => PAD.left + slot * i + (slot - barW) / 2

  // On phones only key bars are labelled (peak + first/last); every Nth day shown.
  const showValue = (i: number) =>
    c.everyValue ? i % c.everyValue === 0 : i === 0 || i === lastIdx || i === peakIdx
  // Always anchor the last day; drop a regular tick that would collide with it.
  const showDay = (i: number) =>
    i === lastIdx || (i % c.everyDay === 0 && lastIdx - i >= 2)

  return (
    <div
      ref={ref}
      className="rounded-[14px] bg-card p-[7px] shadow-[0_24px_60px_-30px_oklch(0.2_0.06_233/0.7)]"
    >
      <div className="rounded-[8px] px-2 py-4 ring-1 ring-line sm:px-5">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full"
          role="img"
          aria-label="Volume quotidien de sargasses échouées sur quatorze jours, en mètres cubes par jour. La dernière journée dépasse le seuil d'alerte."
        >
          {/* Grid + y axis */}
          <g className="font-mono" fontSize={c.fs.axis} fill="var(--color-ink-faint)">
            {Y_TICKS.map((t) => (
              <g key={t}>
                <line
                  x1={PAD.left}
                  x2={W - PAD.right}
                  y1={yOf(t)}
                  y2={yOf(t)}
                  stroke="var(--color-line)"
                  strokeWidth="0.9"
                />
                <text
                  x={PAD.left - 10}
                  y={yOf(t) + c.fs.axis * 0.35}
                  textAnchor="end"
                  className="tabular-nums"
                >
                  {t}
                </text>
              </g>
            ))}
            <text x={PAD.left - (isMobile ? 36 : 42)} y={PAD.top - 18} fontStyle="italic">
              m³ / jour
            </text>
          </g>

          {/* Bars */}
          <g>
            {DAILY_TOTALS.map((v, i) => {
              const isLast = i === lastIdx
              const h = baseline - yOf(v)
              return (
                <g key={i}>
                  <motion.rect
                    x={xOf(i)}
                    y={yOf(v)}
                    width={barW}
                    height={h}
                    rx="2.5"
                    fill={isLast ? 'var(--color-lvl3)' : 'var(--color-lvl1)'}
                    opacity={isLast ? 1 : 0.9}
                    stroke="var(--color-ink)"
                    strokeWidth="0.6"
                    strokeOpacity="0.18"
                    style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}
                    initial={{ scaleY: 0 }}
                    animate={inView ? { scaleY: 1 } : undefined}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.05 }}
                  />
                  {showValue(i) && (
                    <motion.text
                      x={xOf(i) + barW / 2}
                      y={yOf(v) - 9}
                      textAnchor="middle"
                      fontSize={c.fs.value}
                      className="font-mono tabular-nums"
                      fill={isLast ? 'var(--color-lvl3)' : 'var(--color-ink-soft)'}
                      fontWeight={isLast ? 600 : 400}
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : undefined}
                      transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                    >
                      {v}
                    </motion.text>
                  )}
                </g>
              )
            })}
          </g>

          {/* Alert threshold */}
          <g>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={yOf(THRESHOLD)}
              y2={yOf(THRESHOLD)}
              stroke="var(--color-lvl3)"
              strokeWidth="1.2"
              strokeDasharray="5 4"
              opacity="0.7"
            />
            <text
              x={PAD.left + 6}
              y={yOf(THRESHOLD) - 8}
              textAnchor="start"
              fontSize={c.fs.threshold}
              className="font-mono"
              fill="var(--color-lvl3)"
            >
              {isMobile ? `seuil · ${THRESHOLD}` : `seuil d’alerte · ${THRESHOLD} m³ / j`}
            </text>
          </g>

          {/* Baseline + x labels */}
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={baseline}
            y2={baseline}
            stroke="var(--color-ink)"
            strokeWidth="1.1"
          />
          <g className="font-mono" fontSize={c.fs.day} fill="var(--color-ink-soft)">
            {DAILY_LABELS.map((label, i) =>
              showDay(i) ? (
                <text
                  key={label}
                  x={xOf(i) + barW / 2}
                  y={baseline + c.fs.day + 6}
                  textAnchor="middle"
                >
                  {label}
                </text>
              ) : null,
            )}
          </g>
        </svg>
        <p className="mt-2 px-3 font-mono text-[11px] leading-relaxed tracking-wide text-ink-faint sm:text-[10px]">
          Volume estimé échoué par jour, ensemble de l’archipel — +{WEEK_DELTA_PCT} % sur les 7
          derniers jours, soit {fmt(DAILY_TOTALS[lastIdx])} m³ au dernier relevé.
        </p>
      </div>
    </div>
  )
}
