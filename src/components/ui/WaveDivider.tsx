export function WaveDivider() {
  return (
    <div aria-hidden className="pointer-events-none select-none overflow-hidden py-3 lg:hidden">
      <svg
        viewBox="0 0 420 90"
        className="h-auto w-[78%] max-w-[360px]"
        preserveAspectRatio="xMinYMid meet"
      >
        <defs>
          <linearGradient id="wave-divider-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e3f78a" />
            <stop offset="45%" stopColor="#9fc334" />
            <stop offset="100%" stopColor="#516b1a" />
          </linearGradient>
          <radialGradient id="wave-ball-grad" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#fff6b0" />
            <stop offset="55%" stopColor="#e8d94a" />
            <stop offset="100%" stopColor="#a98f1a" />
          </radialGradient>
        </defs>
        <path
          d="M-10,45 C8,18 30,74 54,58 C76,44 56,12 92,17 C148,25 172,76 246,55 C296,42 330,22 352,34"
          fill="none"
          stroke="url(#wave-divider-grad)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <circle cx="358" cy="32" r="16" fill="url(#wave-ball-grad)" />
        <path
          d="M347,22 C353,26 353,38 347,42"
          fill="none"
          stroke="#f7f6f2"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M369,22 C363,26 363,38 369,42"
          fill="none"
          stroke="#f7f6f2"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.75"
        />
      </svg>
    </div>
  );
}
