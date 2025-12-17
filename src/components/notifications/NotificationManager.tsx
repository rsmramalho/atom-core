import { useEffect, useRef } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { useAtomItems } from "@/hooks/useAtomItems";

const CHECK_INTERVAL = 60 * 60 * 1000; // Check every hour

export function NotificationManager() {
  const { permission, checkAndNotify, isSupported } = useNotifications();
  const { items } = useAtomItems();
  const lastCheckRef = useRef<number>(0);

  useEffect(() => {
    if (!isSupported || permission !== "granted" || !items) return;

    // Check on mount (but not more than once per hour)
    const now = Date.now();
    if (now - lastCheckRef.current > CHECK_INTERVAL) {
      lastCheckRef.current = now;
      checkAndNotify(items);
    }

    // Set up periodic check
    const interval = setInterval(() => {
      lastCheckRef.current = Date.now();
      checkAndNotify(items);
    }, CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [isSupported, permission, items, checkAndNotify]);

  // This component doesn't render anything
  return null;
}
