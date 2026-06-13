import { BULLETIN } from '../data/strandings'

export function BulletinBar() {
  return (
    <header className="border-b border-ink/15">
      <div className="mx-auto flex max-w-320 flex-wrap items-center gap-x-5 gap-y-1.5 px-6 py-3">
        <span className="font-display text-xl leading-none italic">Sargasses Gwada</span>
        <span className="hidden font-mono text-[11px] tracking-[0.12em] text-ink-soft uppercase sm:inline">
          Bulletin n° {BULLETIN.number} · {BULLETIN.date}
        </span>
        <span className="ml-auto flex items-center gap-2 rounded-full border border-lvl3/45 px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-lvl3 uppercase">
          <span
            className="inline-block size-1.5 animate-pulse rounded-full"
            style={{ backgroundColor: 'var(--color-lvl3)' }}
            aria-hidden="true"
          />
          Échouage massif en cours
        </span>
      </div>
    </header>
  )
}
