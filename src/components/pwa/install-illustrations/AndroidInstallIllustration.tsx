import { motion } from "framer-motion";

export function AndroidInstallIllustration() {
  return (
    <svg
      viewBox="0 0 280 200"
      className="w-full max-w-xs mx-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Android Phone Frame */}
      <rect
        x="70"
        y="10"
        width="140"
        height="180"
        rx="16"
        className="fill-muted stroke-border"
        strokeWidth="2"
      />
      
      {/* Screen */}
      <rect
        x="76"
        y="16"
        width="128"
        height="168"
        rx="12"
        className="fill-background"
      />
      
      {/* Status Bar */}
      <rect x="76" y="16" width="128" height="16" rx="12" className="fill-muted/50" />
      
      {/* Chrome Address Bar */}
      <rect
        x="82"
        y="36"
        width="116"
        height="24"
        rx="4"
        className="fill-muted"
      />
      <text
        x="120"
        y="52"
        textAnchor="middle"
        className="fill-muted-foreground text-[7px]"
      >
        mindmate.app
      </text>
      
      {/* Three Dots Menu - Highlighted */}
      <motion.g
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <rect
          x="175"
          y="38"
          width="20"
          height="20"
          rx="4"
          className="fill-primary"
        />
        <circle cx="185" cy="44" r="1.5" className="fill-primary-foreground" />
        <circle cx="185" cy="48" r="1.5" className="fill-primary-foreground" />
        <circle cx="185" cy="52" r="1.5" className="fill-primary-foreground" />
      </motion.g>
      
      {/* Arrow pointing to menu */}
      <motion.g
        initial={{ opacity: 0.5, x: 5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
      >
        <path
          d="M210 48 L200 48"
          className="stroke-primary"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M202 45 L199 48 L202 51"
          className="stroke-primary"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.g>
      
      {/* Dropdown Menu */}
      <motion.g
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <rect
          x="120"
          y="62"
          width="75"
          height="90"
          rx="6"
          className="fill-card"
          filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
        />
        
        {/* Menu Items */}
        <rect x="126" y="68" width="63" height="10" rx="2" className="fill-muted" />
        <rect x="126" y="82" width="63" height="10" rx="2" className="fill-muted" />
        <rect x="126" y="96" width="63" height="10" rx="2" className="fill-muted" />
        
        {/* Install App - Highlighted */}
        <motion.g
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        >
          <rect
            x="126"
            y="110"
            width="63"
            height="14"
            rx="2"
            className="fill-primary/20 stroke-primary"
            strokeWidth="1"
          />
          
          {/* Install Icon */}
          <rect x="129" y="113" width="8" height="8" rx="2" className="fill-primary/30" />
          <path
            d="M133 115 L133 118 M131 117 L133 119 L135 117"
            className="stroke-primary"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          <text
            x="160"
            y="120"
            textAnchor="middle"
            className="fill-primary text-[6px] font-medium"
          >
            Install app
          </text>
        </motion.g>
        
        <rect x="126" y="128" width="63" height="10" rx="2" className="fill-muted" />
        <rect x="126" y="142" width="63" height="6" rx="2" className="fill-muted" />
      </motion.g>
      
      {/* Content placeholder lines */}
      <rect x="90" y="100" width="100" height="8" rx="2" className="fill-muted/30" />
      <rect x="90" y="115" width="80" height="6" rx="2" className="fill-muted/30" />
      <rect x="90" y="128" width="90" height="6" rx="2" className="fill-muted/30" />
    </svg>
  );
}
