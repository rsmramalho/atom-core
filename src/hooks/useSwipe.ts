// Custom hook for swipe gesture detection with haptic feedback
import { useState, useCallback, useRef, TouchEvent } from "react";

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
  passedThreshold: boolean;
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
 * Haptic feedback patterns using Web Vibration API
 */
const HAPTIC_PATTERNS = {
  dragStart: 10,        // Light vibration when starting drag
  passThreshold: 15,    // Medium vibration when passing threshold
  swipeComplete: [20, 10, 20] as number[], // Strong double-tap vibration on complete
};

/**
 * Trigger haptic feedback using Web Vibration API
 */
function triggerHaptic(pattern: number | number[]) {
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
    passedThreshold: false,
  });
  
  // Track if threshold haptic has been triggered (to avoid repeated vibrations)
  const thresholdHapticTriggered = useRef(false);

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
      passedThreshold: false,
    });
    thresholdHapticTriggered.current = false;
    
    // Light haptic on drag start
    if (enableHaptics) {
      triggerHaptic(HAPTIC_PATTERNS.dragStart);
    }
  }, [enableHaptics]);

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
    
    // Check if threshold is passed
    const passedThreshold = isHorizontal 
      ? Math.abs(offsetX) > threshold 
      : Math.abs(offsetY) > threshold;
    
    // Medium haptic when first passing threshold
    if (passedThreshold && !thresholdHapticTriggered.current && enableHaptics) {
      triggerHaptic(HAPTIC_PATTERNS.passThreshold);
      thresholdHapticTriggered.current = true;
    }
    
    setSwipeState({
      isSwiping: true,
      direction,
      offsetX,
      offsetY,
      passedThreshold,
    });
  }, [touchStart, threshold, enableHaptics]);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) {
      setSwipeState({ isSwiping: false, direction: null, offsetX: 0, offsetY: 0, passedThreshold: false });
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

    // Strong haptic feedback on successful swipe completion
    if (swipeTriggered && enableHaptics) {
      triggerHaptic(HAPTIC_PATTERNS.swipeComplete);
    }

    setTouchStart(null);
    setTouchEnd(null);
    setSwipeState({ isSwiping: false, direction: null, offsetX: 0, offsetY: 0, passedThreshold: false });
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
