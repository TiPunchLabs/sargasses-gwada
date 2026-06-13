import { motion } from 'motion/react'
import { SargassumFrond } from './SargassumFrond'
import { fmt } from '../lib/utils'
import { BULLETIN, MASSIVE_COUNT, TOTAL_WEEK_M3, WEEK_DELTA_PCT } from '../data/strandings'

const reveal = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
}

export function Hero() {
  return (
    <section className="relative mx-auto max-w-320 overflow-hidden px-6 pt-14 pb-10 sm:pt-20">
      {/* Bathymetric contours + drifting frond */}
      <div className="pointer-events-none absolute -top-16 right-0 hidden w-[460px] md:block">
        <svg viewBox="0 0 460 460" className="w-full" aria-hidden="true">
          <g fill="none" stroke="var(--color-reef-1)">
            <circle cx="320" cy="150" r="60" opacity="0.5" />
            <circle cx="320" cy="150" r="108" opacity="0.34" />
            <circle cx="320" cy="150" r="160" opacity="0.22" />
            <circle cx="320" cy="150" r="214" opacity="0.13" />
          </g>
        </svg>
      </div>
      <div className="pointer-events-none absolute top-8 right-6 hidden opacity-95 lg:block">
        <SargassumFrond size={232} />
      </div>
      <div className="pointer-events-none absolute right-56 bottom-2 hidden opacity-50 lg:block">
        <SargassumFrond size={108} delay="-3.4s" />
      </div>

      <motion.p
        {...reveal}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="font-mono text-xs tracking-[0.2em] text-accent uppercase"
      >
        Bulletin d’échouage — {BULLETIN.week}, saison 2026
      </motion.p>

      <motion.h1
        {...reveal}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.08 }}
        className="mt-5 max-w-3xl font-display text-[clamp(2.9rem,8vw,6.2rem)] leading-[0.98] font-medium text-balance"
      >
        Les côtes au vent sous
        <br />
        un manteau de{' '}
        <em className="font-normal italic" style={{ color: 'var(--color-lvl3)' }}>
          sargasses
        </em>
      </motion.h1>

      <motion.p
        {...reveal}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.18 }}
        className="mt-7 max-w-xl text-[17px] leading-relaxed text-pretty text-ink-soft"
      >
        De Capesterre-Belle-Eau à La Désirade, les façades atlantiques de l’archipel connaissent
        leur plus fort épisode de la saison. Ce bulletin réunit les relevés des treize sites
        suivis : volumes estimés, niveaux d’alerte et tendance à quatorze jours.
      </motion.p>

      <motion.dl
        {...reveal}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
        className="mt-11 grid max-w-2xl grid-cols-1 divide-y divide-line border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0"
      >
        <div className="py-5 sm:pr-8">
          <dd className="font-display text-[2.7rem] leading-none tabular-nums">
            {fmt(TOTAL_WEEK_M3)} <span className="text-2xl text-ink-soft">m³</span>
          </dd>
          <dt className="mt-2.5 font-mono text-[11px] tracking-wide text-ink-soft uppercase">
            Volume estimé · 7 jours
          </dt>
        </div>
        <div className="py-5 sm:px-8">
          <dd className="font-display text-[2.7rem] leading-none tabular-nums">
            {MASSIVE_COUNT} <span className="text-2xl text-ink-soft">sites</span>
          </dd>
          <dt className="mt-2.5 font-mono text-[11px] tracking-wide text-ink-soft uppercase">
            En échouage massif
          </dt>
        </div>
        <div className="py-5 sm:pl-8">
          <dd
            className="flex items-center gap-2 font-display text-[2.7rem] leading-none tabular-nums"
            style={{ color: 'var(--color-lvl3)' }}
          >
            <span aria-hidden="true" className="text-2xl">
              ▲
            </span>
            +{WEEK_DELTA_PCT} %
          </dd>
          <dt className="mt-2.5 font-mono text-[11px] tracking-wide text-ink-soft uppercase">
            Vs semaine précédente
          </dt>
        </div>
      </motion.dl>
    </section>
  )
}
