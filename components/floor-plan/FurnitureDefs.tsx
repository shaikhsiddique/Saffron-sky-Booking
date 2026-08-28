export function FurnitureDefs() {
  return (
    <defs>
      <pattern id="seat-fabric" width="4" height="4" patternUnits="userSpaceOnUse">
        <rect width="4" height="4" fill="#f7f0de" />
        <path d="M0 4 L4 0" stroke="#e4d6b0" strokeWidth="0.7" />
        <circle cx="1" cy="1.2" r="0.35" fill="#d9c89a" />
      </pattern>
      <pattern id="sofa-fabric" width="5" height="5" patternUnits="userSpaceOnUse">
        <rect width="5" height="5" fill="#efe4c4" />
        <path d="M0 5 L5 0" stroke="#dcc896" strokeWidth="0.8" />
        <path d="M-1 2 L2 -1" stroke="#e8d8a8" strokeWidth="0.5" />
      </pattern>
      <linearGradient id="sofa-shade" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f6edd4" />
        <stop offset="100%" stopColor="#e2d09a" />
      </linearGradient>
    </defs>
  );
}
