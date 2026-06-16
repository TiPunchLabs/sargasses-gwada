import { motion } from 'motion/react'
import { fmt } from '../lib/utils'
import { BULLETIN, MASSIVE_COUNT, TOTAL_WEEK_M3, WEEK_DELTA_PCT } from '../data/strandings'

const reveal = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
}

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Full-bleed sargassum photo (optimised WebP, JPEG fallback) */}
      <div
        className="pointer-events-none absolute inset-0 -z-30 bg-cover bg-center"
        style={{
          backgroundImage:
            'image-set(url(/sargasse.webp) type("image/webp"), url(/sargasse-fallback.jpg) type("image/jpeg"))',
        }}
        aria-hidden="true"
      />
      {/* Readability scrim — darkens the text column (left) and top edge so foam
          text clears 4.5:1 over the sunlit water, while the open sea stays visible. */}
      <div
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            'linear-gradient(96deg, color-mix(in oklab, var(--color-ink) 82%, transparent) 0%, color-mix(in oklab, var(--color-ink) 46%, transparent) 38%, transparent 66%), linear-gradient(to bottom, color-mix(in oklab, var(--color-ink) 50%, transparent) 0%, transparent 26%)',
        }}
        aria-hidden="true"
      />
      {/* Lower edge dissolves into the sea so the wave reads as one continuous swell */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(to bottom, transparent 55%, color-mix(in oklab, var(--color-sea) 70%, transparent) 80%, var(--color-sea) 100%)',
        }}
        aria-hidden="true"
      />

      <div
        className="relative mx-auto max-w-320 px-6 pt-14 pb-10 sm:pt-20"
        style={{ textShadow: '0 1px 10px color-mix(in oklab, var(--color-ink) 45%, transparent)' }}
      >
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
          className="mt-5 max-w-3xl font-display text-[clamp(2.9rem,8vw,6.2rem)] leading-[0.98] font-medium text-balance text-foam"
        >
          Les côtes au vent sous
          <br />
          un manteau de{' '}
          <em className="font-normal italic" style={{ color: 'var(--color-lvl2)' }}>
            sargasses
          </em>
        </motion.h1>

        <motion.p
          {...reveal}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.18 }}
          className="mt-7 max-w-xl text-[17px] leading-relaxed text-pretty text-reef-3"
        >
          De Capesterre-Belle-Eau à La Désirade, les façades atlantiques de l’archipel connaissent
          leur plus fort épisode de la saison. Ce bulletin réunit les relevés des treize sites
          suivis : volumes estimés, niveaux d’alerte et tendance à quatorze jours.
        </motion.p>

        <motion.dl
          {...reveal}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
          className="mt-11 grid max-w-2xl grid-cols-1 divide-y divide-foam/25 border-y border-foam/25 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
        >
          <div className="py-5 sm:pr-8">
            <dd className="font-display text-[2.7rem] leading-none tabular-nums text-foam">
              {fmt(TOTAL_WEEK_M3)} <span className="text-2xl text-reef-3">m³</span>
            </dd>
            <dt className="mt-2.5 font-mono text-[11px] tracking-wide text-reef-3 uppercase">
              Volume estimé · 7 jours
            </dt>
          </div>
          <div className="py-5 sm:px-8">
            <dd className="font-display text-[2.7rem] leading-none tabular-nums text-foam">
              {MASSIVE_COUNT} <span className="text-2xl text-reef-3">sites</span>
            </dd>
            <dt className="mt-2.5 font-mono text-[11px] tracking-wide text-reef-3 uppercase">
              En échouage massif
            </dt>
          </div>
          <div className="py-5 sm:pl-8">
            <dd
              className="flex items-center gap-2 font-display text-[2.7rem] leading-none tabular-nums text-foam"
            >
              <span aria-hidden="true" className="text-2xl" style={{ color: 'var(--color-lvl2)' }}>
                ▲
              </span>
              +{WEEK_DELTA_PCT} %
            </dd>
            <dt className="mt-2.5 font-mono text-[11px] tracking-wide text-reef-3 uppercase">
              Vs semaine précédente
            </dt>
          </div>
        </motion.dl>
      </div>
    </section>
  )
}
