export function WaveDivider() {
  return (
    <div aria-hidden className="pointer-events-none select-none py-3 lg:hidden">
      <svg viewBox="0 0 400 90" className="h-auto w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="wave-divider-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e3f78a" />
            <stop offset="45%" stopColor="#9fc334" />
            <stop offset="100%" stopColor="#516b1a" />
          </linearGradient>
        </defs>
        <path
          d="M-10,45 C8,18 30,74 54,58 C76,44 56,12 92,17 C148,25 172,76 246,55 C302,40 348,10 412,27"
          fill="none"
          stroke="url(#wave-divider-grad)"
          strokeWidth="12"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
