interface SargassumFrondProps {
  className?: string
  size?: number
  delay?: string
}

/**
 * A drifting sargassum frond, drawn as an engraved natural-history specimen:
 * a curved stipe, serrated blades and the round gas bladders ("berries") that
 * keep the raft afloat. Hand-built so it reads as a botanical plate, not a
 * flat vector cliché.
 */
export function SargassumFrond({ className = '', size = 200, delay = '0s' }: SargassumFrondProps) {
  return (
    <svg
      viewBox="0 0 220 280"
      width={size}
      height={(size * 280) / 220}
      className={`bob ${className}`}
      style={{ animationDelay: delay }}
      aria-hidden="true"
    >
      {/* main stipe */}
      <path
        d="M104 268 C 96 224, 110 196, 118 162 C 126 128, 118 96, 132 60 C 140 38, 158 24, 176 16"
        fill="none"
        stroke="var(--color-land-mid)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* secondary stipe */}
      <path
        d="M104 248 C 88 224, 70 208, 58 178 C 48 152, 52 128, 46 104"
        fill="none"
        stroke="var(--color-land-mid)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M118 162 C 138 158, 158 162, 176 176"
        fill="none"
        stroke="var(--color-land-mid)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* blades — serrated sargassum leaves */}
      <g fill="var(--color-land)" stroke="var(--color-land-deep)" strokeWidth="1">
        <path d="M118 162 C 102 150, 86 150, 74 160 C 86 168, 104 170, 118 162 Z" />
        <path d="M132 116 C 150 104, 168 104, 180 116 C 166 124, 146 126, 132 116 Z" />
        <path d="M96 198 C 80 190, 66 192, 56 204 C 70 210, 86 208, 96 198 Z" />
      </g>
      <g fill="var(--color-lvl2)" opacity="0.92" stroke="var(--color-lvl3)" strokeWidth="0.8">
        <path d="M126 138 C 144 130, 160 132, 172 144 C 156 150, 138 150, 126 138 Z" />
        <path d="M58 178 C 44 168, 32 168, 22 180 C 36 186, 50 186, 58 178 Z" />
        <path d="M150 78 C 166 70, 182 74, 190 86 C 174 90, 158 88, 150 78 Z" />
      </g>

      {/* gas bladders */}
      <g fill="var(--color-accent)" stroke="var(--color-land-deep)" strokeWidth="0.7">
        <circle cx="176" cy="16" r="6.5" />
        <circle cx="46" cy="104" r="6" />
        <circle cx="176" cy="176" r="5.5" />
        <circle cx="118" cy="162" r="4.5" />
        <circle cx="132" cy="60" r="5" />
        <circle cx="74" cy="160" r="4" />
        <circle cx="22" cy="180" r="4" />
      </g>
      <g fill="var(--color-lvl1)">
        <circle cx="190" cy="86" r="3.5" />
        <circle cx="56" cy="204" r="3.5" />
        <circle cx="160" cy="132" r="3" />
      </g>
    </svg>
  )
}
