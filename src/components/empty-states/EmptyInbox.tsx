// Empty State - Inbox Zero
// Zen-like illustration conveying peace of mind

import { ZenCircleIllustration } from "./illustrations";

export function EmptyInbox() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      {/* Custom SVG Illustration */}
      <ZenCircleIllustration className="w-28 h-28 mb-6" />

      {/* Text */}
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Inbox Zero 🧘
      </h3>
      <p className="text-muted-foreground text-center max-w-xs">
        Sua mente está organizada. Capture novos pensamentos quando surgirem.
      </p>

      {/* Subtle hint */}
      <p className="text-xs text-muted-foreground/60 mt-6">
        Use o campo acima para capturar ideias rapidamente
      </p>
    </div>
  );
}
