// Custom hook for swipe gesture detection
import { useState, useCallback, TouchEvent } from "react";

interface SwipeHandlers {
  onTouchStart: (e: TouchEvent) => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchEnd: () => void;
}

interface SwipeState {
  isSwiping: boolean;
  direction: "left" | "right" | "up" | "down" | null;
  offsetX: number;
  offsetY: number;
}

interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

interface UseSwipeResult {
  handlers: SwipeHandlers;
  swipeState: SwipeState;
}

export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
}: UseSwipeOptions): UseSwipeResult {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const [swipeState, setSwipeState] = useState<SwipeState>({
    isSwiping: false,
    direction: null,
    offsetX: 0,
    offsetY: 0,
  });

  const onTouchStart = useCallback((e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
    setSwipeState({
      isSwiping: true,
      direction: null,
      offsetX: 0,
      offsetY: 0,
    });
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStart) return;
    
    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    const offsetX = currentX - touchStart.x;
    const offsetY = currentY - touchStart.y;
    
    setTouchEnd({ x: currentX, y: currentY });
    
    // Determine direction based on offset
    const isHorizontal = Math.abs(offsetX) > Math.abs(offsetY);
    let direction: SwipeState["direction"] = null;
    
    if (isHorizontal && Math.abs(offsetX) > 10) {
      direction = offsetX > 0 ? "right" : "left";
    } else if (!isHorizontal && Math.abs(offsetY) > 10) {
      direction = offsetY > 0 ? "down" : "up";
    }
    
    setSwipeState({
      isSwiping: true,
      direction,
      offsetX,
      offsetY,
    });
  }, [touchStart]);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) {
      setSwipeState({ isSwiping: false, direction: null, offsetX: 0, offsetY: 0 });
      setTouchStart(null);
      return;
    }

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontalSwipe) {
      if (distanceX > threshold) {
        onSwipeLeft?.();
      } else if (distanceX < -threshold) {
        onSwipeRight?.();
      }
    } else {
      if (distanceY > threshold) {
        onSwipeUp?.();
      } else if (distanceY < -threshold) {
        onSwipeDown?.();
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
    setSwipeState({ isSwiping: false, direction: null, offsetX: 0, offsetY: 0 });
  }, [touchStart, touchEnd, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return {
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
    swipeState,
  };
}
