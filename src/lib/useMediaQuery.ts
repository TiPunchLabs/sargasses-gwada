import { useSyncExternalStore } from 'react'

/**
 * Subscribe to a CSS media query and re-render on changes. SSR-safe
 * (returns `false` on the server snapshot). Use Tailwind breakpoints to keep
 * JS and CSS in lockstep, e.g. `useMediaQuery('(max-width: 639.98px)')` for
 * "below `sm`".
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** True below Tailwind's `sm` breakpoint (640px) — the single-column phone layout. */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 639.98px)')
}
