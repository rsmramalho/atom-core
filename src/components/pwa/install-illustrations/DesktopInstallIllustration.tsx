import { motion } from "framer-motion";

export function DesktopInstallIllustration() {
  return (
    <svg
      viewBox="0 0 320 200"
      className="w-full max-w-sm mx-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Browser Window */}
      <rect
        x="20"
        y="20"
        width="280"
        height="160"
        rx="8"
        className="fill-muted stroke-border"
        strokeWidth="2"
      />
      
      {/* Title Bar */}
      <rect
        x="20"
        y="20"
        width="280"
        height="28"
        rx="8"
        className="fill-card"
      />
      <rect
        x="20"
        y="40"
        width="280"
        height="8"
        className="fill-card"
      />
      
      {/* Window Controls */}
      <circle cx="36" cy="34" r="5" className="fill-destructive/60" />
      <circle cx="52" cy="34" r="5" className="fill-yellow-500/60" />
      <circle cx="68" cy="34" r="5" className="fill-green-500/60" />
      
      {/* Address Bar */}
      <rect
        x="90"
        y="28"
        width="170"
        height="18"
        rx="4"
        className="fill-muted"
      />
      <text
        x="175"
        y="40"
        textAnchor="middle"
        className="fill-muted-foreground text-[8px]"
      >
        🔒 mindmate.app
      </text>
      
      {/* Install Button in Address Bar - Highlighted */}
      <motion.g
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <rect
          x="265"
          y="28"
          width="24"
          height="18"
          rx="4"
          className="fill-primary"
        />
        {/* Install Icon (download with plus) */}
        <path
          d="M277 32 L277 38 M274 36 L277 39 L280 36"
          className="stroke-primary-foreground"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="274"
          y="40"
          width="6"
          height="2"
          rx="0.5"
          className="fill-primary-foreground"
        />
      </motion.g>
      
      {/* Arrow pointing to install button */}
      <motion.g
        initial={{ opacity: 0.5, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
      >
        <path
          d="M277 12 L277 22"
          className="stroke-primary"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M274 19 L277 23 L280 19"
          className="stroke-primary"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.g>
      
      {/* Browser Content */}
      <rect x="20" y="48" width="280" height="132" className="fill-background" />
      
      {/* MindMate Logo/Icon placeholder */}
      <circle cx="160" cy="95" r="20" className="fill-primary/20" />
      <circle cx="160" cy="95" r="12" className="fill-primary/40" />
      <circle cx="160" cy="95" r="5" className="fill-primary" />
      
      {/* Orbit rings */}
      <ellipse cx="160" cy="95" rx="18" ry="6" className="stroke-primary/40 fill-none" strokeWidth="1" />
      <ellipse cx="160" cy="95" rx="6" ry="18" className="stroke-primary/40 fill-none" strokeWidth="1" />
      
      {/* Install Popup */}
      <motion.g
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <rect
          x="90"
          y="125"
          width="140"
          height="45"
          rx="6"
          className="fill-card"
          filter="drop-shadow(0 4px 12px rgba(0,0,0,0.15))"
        />
        
        {/* Popup Content */}
        <text
          x="160"
          y="140"
          textAnchor="middle"
          className="fill-foreground text-[8px] font-medium"
        >
          Install MindMate?
        </text>
        
        <text
          x="160"
          y="152"
          textAnchor="middle"
          className="fill-muted-foreground text-[6px]"
        >
          Add to your applications
        </text>
        
        {/* Install Button */}
        <motion.rect
          x="130"
          y="157"
          width="60"
          height="10"
          rx="5"
          className="fill-primary"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        />
        <text
          x="160"
          y="165"
          textAnchor="middle"
          className="fill-primary-foreground text-[6px] font-medium"
        >
          Install
        </text>
      </motion.g>
      
      {/* Content Lines */}
      <rect x="50" y="130" width="30" height="4" rx="1" className="fill-muted/30" />
      <rect x="240" y="130" width="30" height="4" rx="1" className="fill-muted/30" />
    </svg>
  );
}
