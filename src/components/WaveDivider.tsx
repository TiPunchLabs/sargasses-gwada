interface WaveDividerProps {
  /** Colour of the surface above the wave. */
  from: string
  /** Colour of the surface below the wave (the wave body). */
  to: string
}

/**
 * A soft swell marking the boundary between two surfaces — the paper bulletin
 * giving way to the open sea, and back again.
 */
export function WaveDivider({ from, to }: WaveDividerProps) {
  return (
    <div aria-hidden="true" className="-mb-px leading-none" style={{ background: from }}>
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className="block h-[clamp(44px,6vw,90px)] w-full"
      >
        <path
          d="M0,90 V52 C200,18 380,74 620,50 C840,28 1020,8 1240,40 C1330,53 1390,49 1440,42 V90 Z"
          fill={to}
        />
      </svg>
    </div>
  )
}
