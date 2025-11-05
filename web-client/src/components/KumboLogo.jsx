export default function KumboLogo({ size = 42 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 300 300"
      style={{
        filter: "drop-shadow(0px 4px 12px rgba(0,0,0,0.25))",
      }}
    >
      <defs>
        <linearGradient id="luxBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>

        <linearGradient id="luxGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>
      </defs>

      <circle cx="150" cy="150" r="140" fill="url(#luxBlue)" />

      <path
        d="M150 60 L210 150 L150 240 L90 150 Z"
        fill="url(#luxGold)"
        stroke="white"
        strokeWidth="8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
