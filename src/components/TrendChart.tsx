import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { DAILY_LABELS, DAILY_TOTALS, WEEK_DELTA_PCT } from '../data/strandings'
import { fmt } from '../lib/utils'

const W = 1160
const H = 380
const PAD = { left: 52, right: 26, top: 40, bottom: 42 }
const Y_MAX = 450
const Y_TICKS = [0, 150, 300, 450]
const THRESHOLD = 300

const INNER_W = W - PAD.left - PAD.right
const SLOT = INNER_W / DAILY_TOTALS.length
const BAR_W = SLOT * 0.54
const BASELINE = H - PAD.bottom

function yOf(v: number): number {
  return PAD.top + (1 - v / Y_MAX) * (H - PAD.top - PAD.bottom)
}
function xOf(i: number): number {
  return PAD.left + SLOT * i + (SLOT - BAR_W) / 2
}

export function TrendChart() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const lastIdx = DAILY_TOTALS.length - 1

  return (
    <div ref={ref} className="rounded-[14px] bg-card p-[7px] shadow-[0_24px_60px_-30px_oklch(0.2_0.06_233/0.7)]">
      <div className="rounded-[8px] px-2 py-4 ring-1 ring-line sm:px-5">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full"
          role="img"
          aria-label="Volume quotidien de sargasses échouées sur quatorze jours, en mètres cubes par jour. La dernière journée dépasse le seuil d'alerte."
        >
          {/* Grid + y axis */}
          <g className="font-mono" fontSize="11" fill="var(--color-ink-faint)">
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
                <text x={PAD.left - 10} y={yOf(t) + 4} textAnchor="end" className="tabular-nums">
                  {t}
                </text>
              </g>
            ))}
            <text x={PAD.left - 42} y={PAD.top - 18} fontStyle="italic">
              m³ / jour
            </text>
          </g>

          {/* Bars */}
          <g>
            {DAILY_TOTALS.map((v, i) => {
              const isLast = i === lastIdx
              const h = BASELINE - yOf(v)
              return (
                <g key={i}>
                  <motion.rect
                    x={xOf(i)}
                    y={yOf(v)}
                    width={BAR_W}
                    height={h}
                    rx="2.5"
                    fill={isLast ? 'var(--color-lvl3)' : 'var(--color-lvl1)'}
                    opacity={isLast ? 1 : 0.82}
                    style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}
                    initial={{ scaleY: 0 }}
                    animate={inView ? { scaleY: 1 } : undefined}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.05 }}
                  />
                  <motion.text
                    x={xOf(i) + BAR_W / 2}
                    y={yOf(v) - 9}
                    textAnchor="middle"
                    fontSize="11.5"
                    className="font-mono tabular-nums"
                    fill={isLast ? 'var(--color-lvl3)' : 'var(--color-ink-soft)'}
                    fontWeight={isLast ? 600 : 400}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : undefined}
                    transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                  >
                    {v}
                  </motion.text>
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
              fontSize="11"
              className="font-mono"
              fill="var(--color-lvl3)"
            >
              seuil d’alerte · {THRESHOLD} m³ / j
            </text>
          </g>

          {/* Baseline + x labels */}
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={BASELINE}
            y2={BASELINE}
            stroke="var(--color-ink)"
            strokeWidth="1.1"
          />
          <g className="font-mono" fontSize="10.5" fill="var(--color-ink-soft)">
            {DAILY_LABELS.map((label, i) => (
              <text key={label} x={xOf(i) + BAR_W / 2} y={BASELINE + 18} textAnchor="middle">
                {label}
              </text>
            ))}
          </g>
        </svg>
        <p className="mt-2 px-3 font-mono text-[10px] tracking-wide text-ink-faint">
          Volume estimé échoué par jour, ensemble de l’archipel — +{WEEK_DELTA_PCT} % sur les 7
          derniers jours, soit {fmt(DAILY_TOTALS[lastIdx])} m³ au dernier relevé.
        </p>
      </div>
    </div>
  )
}
