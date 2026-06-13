import { BULLETIN } from '../data/strandings'

export function Footer() {
  return (
    <footer className="border-t border-ink/15">
      <div className="mx-auto flex max-w-320 flex-col gap-4 px-6 py-9 sm:flex-row sm:items-baseline sm:justify-between">
        <div className="max-w-xl">
          <p className="font-display text-lg italic">Sargasses Gwada</p>
          <p className="mt-2 font-mono text-[10px] tracking-[0.14em] text-ink-faint uppercase">
            Données fictives à des fins de démonstration
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-pretty text-ink-soft">
            Chiffres et niveaux inspirés du format des bulletins de surveillance des sargasses
            publiés par Météo-France et la DEAL Guadeloupe. Aucune décision ne doit être prise sur
            la base de cette page.
          </p>
        </div>
        <p className="font-mono text-[11px] text-ink-faint uppercase">
          {BULLETIN.next} · {BULLETIN.week} — 2026
        </p>
      </div>
    </footer>
  )
}
