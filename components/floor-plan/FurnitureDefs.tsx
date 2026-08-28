export function FurnitureDefs() {
  return (
    <defs>
      <pattern id="seat-fabric" width="4" height="4" patternUnits="userSpaceOnUse">
        <rect width="4" height="4" fill="#f4ead8" />
        <path d="M0 4 L4 0" stroke="#e4d6b0" strokeWidth="0.55" />
      </pattern>
      <pattern id="tuft-cream" width="3.2" height="6" patternUnits="userSpaceOnUse">
        <rect width="3.2" height="6" fill="#f3ead6" />
        <rect x="0" width="1.35" height="6" fill="#e8dcc0" opacity="0.85" />
        <rect x="1.35" width="0.35" height="6" fill="#d4c4a0" />
      </pattern>
      <pattern id="tuft-taupe" width="3.2" height="6" patternUnits="userSpaceOnUse">
        <rect width="3.2" height="6" fill="#9a8774" />
        <rect x="0" width="1.35" height="6" fill="#8a7664" opacity="0.9" />
        <rect x="1.35" width="0.35" height="6" fill="#6e5d4d" />
      </pattern>
      <pattern id="tuft-lounge" width="4" height="7" patternUnits="userSpaceOnUse">
        <rect width="4" height="7" fill="#e8ddca" />
        <rect x="0" width="1.8" height="7" fill="#ddceb6" opacity="0.9" />
        <rect x="1.8" width="0.4" height="7" fill="#c4b295" />
      </pattern>
      <pattern id="teal-leather" width="3" height="3" patternUnits="userSpaceOnUse">
        <rect width="3" height="3" fill="#1f6b66" />
        <circle cx="1.2" cy="1.4" r="0.35" fill="#185753" />
      </pattern>
      <pattern id="terra-leather" width="3" height="3" patternUnits="userSpaceOnUse">
        <rect width="3" height="3" fill="#c0573e" />
        <circle cx="1.2" cy="1.4" r="0.35" fill="#a84630" />
      </pattern>
      <pattern id="stone-top" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="#f3eee6" />
        <path d="M1 7 L7 2" stroke="#e4ddd2" strokeWidth="0.4" />
      </pattern>
      <pattern id="marble-vanity" width="10" height="10" patternUnits="userSpaceOnUse">
        <rect width="10" height="10" fill="#f8f7f4" />
        <path d="M0 3 Q 5 1 10 4 M 2 10 Q 7 8 10 10" fill="none" stroke="#e2ddd5" strokeWidth="0.5" />
      </pattern>
      <pattern id="restroom-tile" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="#f7f5f0" />
        <path d="M 6 0 L 0 0 0 6" fill="none" stroke="#e6e1d6" strokeWidth="0.5" />
      </pattern>
      <pattern id="bar-top" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="#faebd7" />
        <path d="M 0 3 L 6 3" stroke="#ecdac2" strokeWidth="0.6" />
      </pattern>
      <pattern id="water-grid" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="#78c8e8" />
        <path d="M 6 0 L 0 0 0 6" fill="none" stroke="#5cb8de" strokeWidth="0.6" />
      </pattern>
      <linearGradient id="water-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#89d7f5" />
        <stop offset="100%" stopColor="#5bbbe0" />
      </linearGradient>
      <linearGradient id="wood-light" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ede1c7" />
        <stop offset="100%" stopColor="#d8c5a0" />
      </linearGradient>
      <linearGradient id="sofa-shade" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f6edd4" />
        <stop offset="100%" stopColor="#dcc9a0" />
      </linearGradient>
      <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0.4" dy="0.8" stdDeviation="0.7" floodOpacity="0.18" />
      </filter>
    </defs>
  );
}
