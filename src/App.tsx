import { useState } from 'react'
import { motion } from 'motion/react'
import { BulletinBar } from './components/BulletinBar'
import { Hero } from './components/Hero'
import { ChartMap } from './components/ChartMap'
import { SiteList } from './components/SiteList'
import { TrendChart } from './components/TrendChart'
import { Footer } from './components/Footer'
import { WaveDivider } from './components/WaveDivider'

function SectionHeading({
  figure,
  title,
  onSea = false,
}: {
  figure: string
  title: string
  onSea?: boolean
}) {
  return (
    <div className="mb-7 max-w-3xl">
      <p
        className={`font-mono text-[11px] tracking-[0.2em] uppercase ${onSea ? 'text-reef-2' : 'text-ink-faint'}`}
      >
        {figure}
      </p>
      <h2
        className={`mt-2 font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] text-balance ${onSea ? 'text-foam' : 'text-ink'}`}
      >
        {title}
      </h2>
    </div>
  )
}

const revealSection = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.6, ease: 'easeOut' },
} as const

export default function App() {
  const [selectedId, setSelectedId] = useState('capesterre-be')

  return (
    <div className="min-h-dvh">
      <BulletinBar />
      <main>
        <Hero />

        <WaveDivider from="var(--color-paper)" to="var(--color-sea-deep)" />

        <div className="relative bg-sea-deep text-foam">
          <motion.section className="mx-auto max-w-320 px-6 pt-10 pb-4" {...revealSection}>
            <SectionHeading
              figure="Fig. 1 — Carte de situation"
              title="Treize sites suivis, du Moule aux Saintes"
              onSea
            />
            <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_344px]">
              <ChartMap selectedId={selectedId} onSelect={setSelectedId} />
              <SiteList selectedId={selectedId} onSelect={setSelectedId} />
            </div>
          </motion.section>

          <motion.section className="mx-auto max-w-320 px-6 pt-16 pb-12" {...revealSection}>
            <SectionHeading
              figure="Fig. 2 — Série quotidienne sur quatorze jours"
              title="Le volume quotidien ne cesse de monter"
              onSea
            />
            <TrendChart />
          </motion.section>
        </div>

        <WaveDivider from="var(--color-sea-deep)" to="var(--color-paper)" />
      </main>
      <Footer />
    </div>
  )
}
