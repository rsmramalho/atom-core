import { motion } from "framer-motion";

export function IOSInstallIllustration() {
  return (
    <svg
      viewBox="0 0 280 200"
      className="w-full max-w-xs mx-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* iPhone Frame */}
      <rect
        x="70"
        y="10"
        width="140"
        height="180"
        rx="20"
        className="fill-muted stroke-border"
        strokeWidth="2"
      />
      
      {/* Screen */}
      <rect
        x="78"
        y="30"
        width="124"
        height="140"
        rx="4"
        className="fill-background"
      />
      
      {/* Notch */}
      <rect
        x="115"
        y="14"
        width="50"
        height="12"
        rx="6"
        className="fill-foreground/20"
      />
      
      {/* Safari Address Bar */}
      <rect
        x="85"
        y="35"
        width="110"
        height="20"
        rx="10"
        className="fill-muted"
      />
      <text
        x="140"
        y="49"
        textAnchor="middle"
        className="fill-muted-foreground text-[8px]"
      >
        mindmate.app
      </text>
      
      {/* Share Button - Highlighted */}
      <motion.g
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <rect
          x="165"
          y="150"
          width="30"
          height="16"
          rx="4"
          className="fill-primary"
        />
        {/* Share Icon */}
        <path
          d="M180 154 L180 160 M176 157 L180 153 L184 157"
          className="stroke-primary-foreground"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="176"
          y="159"
          width="8"
          height="5"
          rx="1"
          className="stroke-primary-foreground fill-none"
          strokeWidth="1"
        />
      </motion.g>
      
      {/* Arrow pointing to share button */}
      <motion.g
        initial={{ opacity: 0.5, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
      >
        <path
          d="M210 158 L200 158"
          className="stroke-primary"
          strokeWidth="2"
          strokeLinecap="round"
          markerEnd="url(#arrowhead)"
        />
      </motion.g>
      
      {/* Popup Menu */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <rect
          x="100"
          y="80"
          width="80"
          height="70"
          rx="8"
          className="fill-card stroke-border"
          strokeWidth="1"
        />
        
        {/* Menu Items */}
        <rect x="108" y="88" width="64" height="12" rx="2" className="fill-muted" />
        <rect x="108" y="104" width="64" height="12" rx="2" className="fill-muted" />
        
        {/* Add to Home Screen - Highlighted */}
        <motion.rect
          x="108"
          y="120"
          width="64"
          height="12"
          rx="2"
          className="fill-primary/20 stroke-primary"
          strokeWidth="1"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        />
        <text
          x="140"
          y="129"
          textAnchor="middle"
          className="fill-primary text-[6px] font-medium"
        >
          Add to Home Screen
        </text>
        
        {/* Plus Icon */}
        <rect x="110" y="123" width="6" height="6" rx="1" className="fill-primary/30" />
        <path
          d="M113 124 L113 128 M111 126 L115 126"
          className="stroke-primary"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      </motion.g>
      
      {/* Arrow Definition */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="6"
          refX="0"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 6 3, 0 6" className="fill-primary" />
        </marker>
      </defs>
    </svg>
  );
}
