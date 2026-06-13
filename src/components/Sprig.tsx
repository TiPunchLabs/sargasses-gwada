interface SprigProps {
  className?: string
  size?: number
  delay?: string
}

/** A small drifting sargassum sprig — stem, leaves and gas bladders. */
export function Sprig({ className = '', size = 120, delay = '0s' }: SprigProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={`bob ${className}`}
      style={{ animationDelay: delay }}
      aria-hidden="true"
    >
      <g fill="none" stroke="#8a6d1f" strokeWidth="2.4" strokeLinecap="round">
        <path d="M18 102 C 38 86, 44 64, 52 44 S 70 16, 88 12" />
        <path d="M52 44 C 62 44, 72 50, 80 60" />
        <path d="M40 70 C 30 66, 24 58, 22 48" />
        <path d="M64 28 C 74 26, 82 28, 90 34" />
      </g>
      <g fill="#b8902c">
        <circle cx="22" cy="46" r="5" />
        <circle cx="82" cy="62" r="5.5" />
        <circle cx="92" cy="36" r="4" />
        <circle cx="90" cy="11" r="4.5" />
        <circle cx="46" cy="56" r="3.5" />
      </g>
      <g fill="none" stroke="#8a6d1f" strokeWidth="1.6" strokeLinecap="round">
        <path d="M34 80 l-8 4 M38 74 l-9 1 M44 62 l-9 -2 M56 38 l9 -6 M60 34 l-8 -5" />
      </g>
    </svg>
  )
}
