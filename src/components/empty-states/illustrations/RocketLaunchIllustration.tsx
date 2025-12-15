// Custom SVG Illustration - Rocket Launch (New Project)
// Dynamic rocket with trajectory and stars

export function RocketLaunchIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="flame" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(35 93% 60%)" />
          <stop offset="50%" stopColor="hsl(25 93% 55%)" />
          <stop offset="100%" stopColor="hsl(15 93% 50%)" stopOpacity="0.3" />
        </linearGradient>
        <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(45 93% 70%)" stopOpacity="1" />
          <stop offset="100%" stopColor="hsl(45 93% 70%)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background stars */}
      <circle cx="15" cy="20" r="1.5" fill="hsl(var(--muted-foreground))" opacity="0.4" />
      <circle cx="105" cy="15" r="1" fill="hsl(var(--muted-foreground))" opacity="0.3" />
      <circle cx="95" cy="45" r="1.5" fill="hsl(var(--muted-foreground))" opacity="0.4" />
      <circle cx="20" cy="50" r="1" fill="hsl(var(--muted-foreground))" opacity="0.3" />
      <circle cx="110" cy="80" r="1" fill="hsl(var(--muted-foreground))" opacity="0.3" />

      {/* Trajectory trail */}
      <g opacity="0.4">
        <circle cx="75" cy="95" r="2" fill="hsl(var(--primary))" opacity="0.2" />
        <circle cx="70" cy="100" r="2.5" fill="hsl(var(--primary))" opacity="0.3" />
        <circle cx="65" cy="105" r="3" fill="hsl(var(--primary))" opacity="0.4" />
        <circle cx="58" cy="110" r="4" fill="hsl(var(--primary))" opacity="0.5" />
      </g>

      {/* Rocket group */}
      <g transform="translate(60, 55) rotate(-35)">
        {/* Flame */}
        <path
          d="M-5 25 Q0 40 5 25 Q0 35 -5 25"
          fill="url(#flame)"
        >
          <animate 
            attributeName="d" 
            values="M-5 25 Q0 40 5 25 Q0 35 -5 25;M-5 25 Q0 45 5 25 Q0 38 -5 25;M-5 25 Q0 40 5 25 Q0 35 -5 25" 
            dur="0.3s" 
            repeatCount="indefinite" 
          />
        </path>
        <path
          d="M-3 25 Q0 32 3 25 Q0 30 -3 25"
          fill="hsl(45 93% 70%)"
        >
          <animate 
            attributeName="d" 
            values="M-3 25 Q0 32 3 25 Q0 30 -3 25;M-3 25 Q0 36 3 25 Q0 33 -3 25;M-3 25 Q0 32 3 25 Q0 30 -3 25" 
            dur="0.25s" 
            repeatCount="indefinite" 
          />
        </path>

        {/* Rocket body */}
        <path
          d="M0 -25 
             C8 -20 10 0 10 20 
             L10 25 L5 20 L0 25 L-5 20 L-10 25 
             L-10 20 C-10 0 -8 -20 0 -25Z"
          fill="url(#rocketBody)"
          stroke="hsl(var(--primary))"
          strokeWidth="0.5"
        />

        {/* Window */}
        <circle 
          cx="0" 
          cy="-5" 
          r="5" 
          fill="hsl(var(--background))"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
        />
        <circle 
          cx="0" 
          cy="-5" 
          r="3" 
          fill="hsl(200 80% 60%)"
          opacity="0.6"
        />

        {/* Fins */}
        <path
          d="M-10 15 L-18 25 L-10 22"
          fill="hsl(var(--primary))"
          opacity="0.7"
        />
        <path
          d="M10 15 L18 25 L10 22"
          fill="hsl(var(--primary))"
          opacity="0.7"
        />
      </g>

      {/* Bright star */}
      <g transform="translate(95, 25)">
        <circle r="4" fill="url(#starGlow)" />
        <circle r="2" fill="hsl(45 93% 75%)">
          <animate attributeName="opacity" values="1;0.6;1" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Flag at destination */}
      <g transform="translate(20, 95)">
        <line 
          x1="0" y1="0" x2="0" y2="-20" 
          stroke="hsl(var(--muted-foreground))" 
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M0 -20 L12 -15 L0 -10"
          fill="hsl(142 76% 50%)"
          opacity="0.8"
        >
          <animate 
            attributeName="d" 
            values="M0 -20 L12 -15 L0 -10;M0 -20 L14 -14 L0 -9;M0 -20 L12 -15 L0 -10" 
            dur="2s" 
            repeatCount="indefinite" 
          />
        </path>
      </g>
    </svg>
  );
}
