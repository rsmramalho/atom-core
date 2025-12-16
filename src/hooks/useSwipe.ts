// Custom hook for swipe gesture detection with haptic feedback
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
  enableHaptics?: boolean;
}

interface UseSwipeResult {
  handlers: SwipeHandlers;
  swipeState: SwipeState;
}

/**
 * Trigger haptic feedback using Web Vibration API
 * @param pattern - Vibration pattern in ms (single number or array)
 */
function triggerHaptic(pattern: number | number[] = 15) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Silently fail if vibration not supported
    }
  }
}

export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  enableHaptics = true,
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
    let swipeTriggered = false;

    if (isHorizontalSwipe) {
      if (distanceX > threshold) {
        onSwipeLeft?.();
        swipeTriggered = true;
      } else if (distanceX < -threshold) {
        onSwipeRight?.();
        swipeTriggered = true;
      }
    } else {
      if (distanceY > threshold) {
        onSwipeUp?.();
        swipeTriggered = true;
      } else if (distanceY < -threshold) {
        onSwipeDown?.();
        swipeTriggered = true;
      }
    }

    // Haptic feedback on successful swipe
    if (swipeTriggered && enableHaptics) {
      triggerHaptic(20); // Short vibration (20ms) for success
    }

    setTouchStart(null);
    setTouchEnd(null);
    setSwipeState({ isSwiping: false, direction: null, offsetX: 0, offsetY: 0 });
  }, [touchStart, touchEnd, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, enableHaptics]);

  return {
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
    swipeState,
  };
}
