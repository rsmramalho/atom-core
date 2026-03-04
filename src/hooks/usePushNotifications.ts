import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";

// VAPID public key (safe to embed in frontend)
const VAPID_PUBLIC_KEY =
  "BESVF1ls_FyeD64bktnNLgJY3lAuvODe4IlXT8oLPmYUlYsiYSC6m5AmqEY4EzTY9VvcmAt4o8YW98c7rIQRQT0";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export type PushStatus = "unsupported" | "default" | "denied" | "subscribed" | "unsubscribed";

export function usePushNotifications() {
  const user = useCurrentUser();
  const [status, setStatus] = useState<PushStatus>("unsupported");
  const [isLoading, setIsLoading] = useState(false);

  const isSupported =
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window;

  // Check current subscription status
  useEffect(() => {
    if (!isSupported) {
      setStatus("unsupported");
      return;
    }

    (async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (Notification.permission === "denied") {
          setStatus("denied");
        } else if (subscription) {
          setStatus("subscribed");
        } else {
          setStatus("unsubscribed");
        }
      } catch {
        setStatus("unsubscribed");
      }
    })();
  }, [isSupported]);

  const subscribe = useCallback(async () => {
    if (!isSupported || !user) return false;
    setIsLoading(true);

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        setIsLoading(false);
        return false;
      }

      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      });

      const json = subscription.toJSON();
      const endpoint = json.endpoint!;
      const p256dh = json.keys!.p256dh!;
      const auth = json.keys!.auth!;

      // Save to database
      const { error } = await supabase.from("push_subscriptions").upsert(
        {
          user_id: user.id,
          endpoint,
          p256dh,
          auth,
        },
        { onConflict: "user_id,endpoint" }
      );

      if (error) {
        console.error("Failed to save push subscription:", error);
        setIsLoading(false);
        return false;
      }

      setStatus("subscribed");
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error("Push subscription failed:", err);
      setIsLoading(false);
      return false;
    }
  }, [isSupported, user]);

  const unsubscribe = useCallback(async () => {
    if (!isSupported || !user) return false;
    setIsLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        const endpoint = subscription.endpoint;
        await subscription.unsubscribe();

        // Remove from database
        await supabase
          .from("push_subscriptions")
          .delete()
          .eq("user_id", user.id)
          .eq("endpoint", endpoint);
      }

      setStatus("unsubscribed");
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error("Push unsubscribe failed:", err);
      setIsLoading(false);
      return false;
    }
  }, [isSupported, user]);

  return {
    status,
    isSupported,
    isLoading,
    subscribe,
    unsubscribe,
  };
}
