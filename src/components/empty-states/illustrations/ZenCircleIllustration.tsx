// Custom SVG Illustration - Inbox Zero (Zen Circle)
// Artistic zen circle with floating particles

export function ZenCircleIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background glow */}
      <defs>
        <radialGradient id="zenGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
          <stop offset="70%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="zenRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
          <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Outer glow */}
      <circle cx="60" cy="60" r="50" fill="url(#zenGlow)" />

      {/* Zen circle (enso) */}
      <path
        d="M60 20
           C82 20 100 38 100 60
           C100 82 82 100 60 100
           C38 100 20 82 20 60
           C20 45 28 32 42 25"
        stroke="url(#zenRing)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        className="animate-[spin_20s_linear_infinite]"
        style={{ transformOrigin: "center" }}
      />

      {/* Inner peaceful circle */}
      <circle 
        cx="60" 
        cy="60" 
        r="25" 
        fill="hsl(var(--primary))" 
        fillOpacity="0.15"
      />

      {/* Checkmark */}
      <path
        d="M48 60 L56 68 L72 52"
        stroke="hsl(var(--primary))"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Floating particles */}
      <circle cx="25" cy="35" r="2" fill="hsl(142 76% 50%)" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="95" cy="30" r="2.5" fill="hsl(45 93% 60%)" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="90" cy="85" r="1.5" fill="hsl(var(--primary))" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.2;0.5" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="30" cy="80" r="1.5" fill="hsl(142 76% 50%)" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.2s" repeatCount="indefinite" />
      </circle>

      {/* Small leaf accent */}
      <path
        d="M22 75 Q28 68 26 78 Q24 82 22 75"
        fill="hsl(142 76% 50%)"
        opacity="0.6"
      />

      {/* Sparkle */}
      <g transform="translate(92, 25)">
        <path
          d="M0 -5 L0 5 M-5 0 L5 0"
          stroke="hsl(45 93% 60%)"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
        </path>
      </g>
    </svg>
  );
}
