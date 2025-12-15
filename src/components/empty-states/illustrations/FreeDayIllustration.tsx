// Custom SVG Illustration - Free Day (Coffee & Sun)
// Cozy coffee scene with warm lighting

export function FreeDayIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="sunGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(45 93% 70%)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(35 93% 60%)" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="cupGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="steamGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Sun rays */}
      <g transform="translate(105, 30)">
        <circle r="15" fill="hsl(45 93% 65%)" opacity="0.3" />
        <circle r="10" fill="hsl(45 93% 70%)" opacity="0.5" />
        <circle r="6" fill="hsl(45 93% 75%)" opacity="0.8" />
        
        {/* Rays */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <line
            key={angle}
            x1="0"
            y1="0"
            x2={Math.cos((angle * Math.PI) / 180) * 22}
            y2={Math.sin((angle * Math.PI) / 180) * 22}
            stroke="hsl(45 93% 65%)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.4"
          >
            <animate 
              attributeName="opacity" 
              values="0.4;0.7;0.4" 
              dur={`${1.5 + i * 0.2}s`} 
              repeatCount="indefinite" 
            />
          </line>
        ))}
      </g>

      {/* Table surface */}
      <ellipse 
        cx="60" 
        cy="115" 
        rx="50" 
        ry="8" 
        fill="hsl(var(--muted))" 
        opacity="0.4"
      />

      {/* Coffee cup */}
      <g transform="translate(35, 55)">
        {/* Cup body */}
        <path
          d="M5 25 L8 55 C8 60 42 60 42 55 L45 25 C45 22 5 22 5 25Z"
          fill="url(#cupGradient)"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
        />
        
        {/* Cup handle */}
        <path
          d="M45 32 C55 32 55 48 45 48"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Coffee surface */}
        <ellipse 
          cx="25" 
          cy="30" 
          rx="16" 
          ry="4" 
          fill="hsl(25 60% 35%)"
          opacity="0.6"
        />

        {/* Steam lines */}
        <path
          d="M15 15 Q18 8 15 0"
          stroke="url(#steamGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        >
          <animate 
            attributeName="d" 
            values="M15 15 Q18 8 15 0;M15 15 Q12 8 15 0;M15 15 Q18 8 15 0" 
            dur="3s" 
            repeatCount="indefinite" 
          />
        </path>
        <path
          d="M25 12 Q28 5 25 -3"
          stroke="url(#steamGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        >
          <animate 
            attributeName="d" 
            values="M25 12 Q28 5 25 -3;M25 12 Q22 5 25 -3;M25 12 Q28 5 25 -3" 
            dur="2.5s" 
            repeatCount="indefinite" 
          />
        </path>
        <path
          d="M35 15 Q38 8 35 0"
          stroke="url(#steamGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        >
          <animate 
            attributeName="d" 
            values="M35 15 Q38 8 35 0;M35 15 Q32 8 35 0;M35 15 Q38 8 35 0" 
            dur="3.5s" 
            repeatCount="indefinite" 
          />
        </path>
      </g>

      {/* Floating sparkles */}
      <circle cx="25" cy="40" r="2" fill="hsl(45 93% 65%)" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="115" cy="70" r="1.5" fill="hsl(var(--primary))" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2.5s" repeatCount="indefinite" />
      </circle>

      {/* Cloud accent */}
      <g transform="translate(15, 25)" opacity="0.4">
        <circle cx="0" cy="5" r="6" fill="hsl(200 80% 70%)" />
        <circle cx="8" cy="3" r="7" fill="hsl(200 80% 70%)" />
        <circle cx="16" cy="5" r="5" fill="hsl(200 80% 70%)" />
      </g>
    </svg>
  );
}
