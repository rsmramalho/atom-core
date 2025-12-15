// Confetti celebration component
// Triggers confetti burst animation

import { useEffect, useState, useCallback } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
  drift: number;
}

interface ConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(45 93% 60%)",    // Gold
  "hsl(142 76% 50%)",   // Green
  "hsl(200 80% 60%)",   // Blue
  "hsl(320 80% 60%)",   // Pink
  "hsl(280 80% 60%)",   // Purple
];

export function Confetti({ trigger, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isActive, setIsActive] = useState(false);

  const generatePieces = useCallback(() => {
    const newPieces: ConfettiPiece[] = [];
    const pieceCount = 60;

    for (let i = 0; i < pieceCount; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.3,
        duration: 2 + Math.random() * 1.5,
        size: 6 + Math.random() * 8,
        rotation: Math.random() * 360,
        drift: (Math.random() - 0.5) * 100,
      });
    }

    return newPieces;
  }, []);

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true);
      setPieces(generatePieces());

      // Cleanup after animation
      const timeout = setTimeout(() => {
        setIsActive(false);
        setPieces([]);
        onComplete?.();
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [trigger, isActive, generatePieces, onComplete]);

  if (!isActive || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            top: "-20px",
            width: `${piece.size}px`,
            height: `${piece.size * 0.6}px`,
            backgroundColor: piece.color,
            borderRadius: "2px",
            transform: `rotate(${piece.rotation}deg)`,
            animation: `confetti-fall ${piece.duration}s ease-out ${piece.delay}s forwards`,
            "--drift": `${piece.drift}px`,
          } as React.CSSProperties}
        />
      ))}

      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          25% {
            transform: translateY(25vh) translateX(calc(var(--drift) * 0.5)) rotate(180deg) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(50vh) translateX(var(--drift)) rotate(360deg) scale(0.9);
            opacity: 0.9;
          }
          75% {
            transform: translateY(75vh) translateX(calc(var(--drift) * 1.5)) rotate(540deg) scale(0.7);
            opacity: 0.6;
          }
          100% {
            transform: translateY(100vh) translateX(calc(var(--drift) * 2)) rotate(720deg) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
