// Custom SVG Illustration - Target Focus
// Minimalist target with focus ring effect

export function TargetFocusIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient id="focusGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer glow */}
      <circle cx="50" cy="50" r="45" fill="url(#focusGlow)" />

      {/* Outer ring with pulse */}
      <circle 
        cx="50" 
        cy="50" 
        r="38" 
        stroke="hsl(var(--primary))" 
        strokeWidth="1"
        strokeOpacity="0.2"
        fill="none"
      >
        <animate 
          attributeName="r" 
          values="38;42;38" 
          dur="3s" 
          repeatCount="indefinite" 
        />
        <animate 
          attributeName="stroke-opacity" 
          values="0.2;0.1;0.2" 
          dur="3s" 
          repeatCount="indefinite" 
        />
      </circle>

      {/* Concentric circles */}
      <circle 
        cx="50" 
        cy="50" 
        r="30" 
        stroke="hsl(var(--primary))" 
        strokeWidth="1.5"
        strokeOpacity="0.3"
        fill="none"
      />
      <circle 
        cx="50" 
        cy="50" 
        r="20" 
        stroke="hsl(var(--primary))" 
        strokeWidth="1.5"
        strokeOpacity="0.4"
        fill="none"
      />
      <circle 
        cx="50" 
        cy="50" 
        r="10" 
        stroke="hsl(var(--primary))" 
        strokeWidth="1.5"
        strokeOpacity="0.6"
        fill="none"
      />

      {/* Center dot */}
      <circle 
        cx="50" 
        cy="50" 
        r="4" 
        fill="hsl(var(--primary))"
        opacity="0.8"
      >
        <animate 
          attributeName="opacity" 
          values="0.8;1;0.8" 
          dur="2s" 
          repeatCount="indefinite" 
        />
      </circle>

      {/* Crosshairs */}
      <line 
        x1="50" y1="15" x2="50" y2="35" 
        stroke="hsl(var(--primary))" 
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      <line 
        x1="50" y1="65" x2="50" y2="85" 
        stroke="hsl(var(--primary))" 
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      <line 
        x1="15" y1="50" x2="35" y2="50" 
        stroke="hsl(var(--primary))" 
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      <line 
        x1="65" y1="50" x2="85" y2="50" 
        stroke="hsl(var(--primary))" 
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* Sparkle accent */}
      <g transform="translate(78, 22)">
        <path
          d="M0 -4 L0 4 M-4 0 L4 0"
          stroke="hsl(45 93% 65%)"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.5s" repeatCount="indefinite" />
        </path>
      </g>
    </svg>
  );
}
