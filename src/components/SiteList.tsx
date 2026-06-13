import { LEVELS, SITES } from '../data/strandings'
import { cn, fmt } from '../lib/utils'

interface SiteListProps {
  selectedId: string
  onSelect: (id: string) => void
}

const ranked = [...SITES].sort((a, b) => b.volumeM3 - a.volumeM3)
const MAX_VOL = Math.max(...SITES.map((s) => s.volumeM3))

export function SiteList({ selectedId, onSelect }: SiteListProps) {
  return (
    <aside className="rounded-[14px] bg-[oklch(0.3_0.05_233/0.45)] p-[7px] ring-1 ring-foam/15 backdrop-blur-sm">
      <div className="rounded-[8px] px-3.5 py-3.5 ring-1 ring-foam/10">
        <div className="flex items-baseline justify-between border-b border-foam/15 pb-2 font-mono text-[10px] tracking-[0.18em] text-reef-2 uppercase">
          <span>Site</span>
          <span>Volume / 7 j</span>
        </div>
        <ol>
          {ranked.map((site, i) => {
            const level = LEVELS[site.level]
            const isSelected = site.id === selectedId
            const pct = site.volumeM3 === 0 ? 0 : Math.max(4, (site.volumeM3 / MAX_VOL) * 100)
            return (
              <li key={site.id}>
                <button
                  type="button"
                  onClick={() => onSelect(site.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    'w-full rounded-[5px] px-2 py-2 text-left transition-colors duration-150',
                    isSelected ? 'bg-foam/10' : 'hover:bg-foam/5',
                  )}
                >
                  <div className="grid grid-cols-[1.4rem_minmax(0,1fr)_auto] items-baseline gap-x-2.5">
                    <span className="font-mono text-[11px] text-reef-2 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={cn(
                          'block truncate text-[14.5px] leading-tight',
                          isSelected ? 'font-medium text-foam' : 'text-reef-3',
                        )}
                      >
                        {site.name}
                      </span>
                      <span className="mt-0.5 block truncate font-mono text-[9.5px] tracking-wide text-reef-2 uppercase">
                        {site.commune}
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="block font-mono text-[13px] text-foam tabular-nums">
                        {fmt(site.volumeM3)} <span className="text-reef-2">m³</span>
                      </span>
                      <span
                        className="mt-0.5 block font-mono text-[9.5px] uppercase"
                        style={{ color: site.level === 0 ? 'var(--color-reef-2)' : level.cssVar }}
                      >
                        {level.label}
                      </span>
                    </span>
                  </div>
                  <div
                    className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-foam/10"
                    aria-hidden="true"
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: site.level === 0 ? 'var(--color-reef-2)' : level.cssVar,
                      }}
                    />
                  </div>
                </button>
              </li>
            )
          })}
        </ol>
        <p className="mt-3 font-mono text-[9.5px] leading-relaxed text-reef-2">
          Volumes estimés sur 7 jours glissants. Sélectionnez un site pour le situer sur la carte.
        </p>
      </div>
    </aside>
  )
}
