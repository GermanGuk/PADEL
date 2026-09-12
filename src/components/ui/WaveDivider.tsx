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
            <stop offset="0%" stopColor="#d9f26b" />
            <stop offset="55%" stopColor="#c2e23c" />
            <stop offset="100%" stopColor="#8fac22" />
          </radialGradient>
        </defs>
        <path
          d="M-10,45 C8,18 30,74 54,58 C76,44 56,12 92,17 C148,25 172,76 246,55 C270,48 285,42 300,45"
          fill="none"
          stroke="url(#wave-divider-grad)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <circle cx="340" cy="45" r="42" fill="url(#wave-ball-grad)" />
        <path
          d="M311,19 C325,28 325,62 311,71"
          fill="none"
          stroke="#f7f6f2"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M369,19 C355,28 355,62 369,71"
          fill="none"
          stroke="#f7f6f2"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.75"
        />
      </svg>
    </div>
  );
}
