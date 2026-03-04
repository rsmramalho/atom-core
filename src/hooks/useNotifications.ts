import { useState, useEffect, useCallback } from "react";
import { AtomItem } from "@/types/atom-engine";
import { isToday, isTomorrow, isPast, parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NotificationSettings {
  enabled: boolean;
  remindToday: boolean;
  remindTomorrow: boolean;
  remindOverdue: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  remindToday: true,
  remindTomorrow: true,
  remindOverdue: true,
};

const STORAGE_KEY = "mindmate-notification-settings";
const NOTIFIED_KEY = "mindmate-notified-items";

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [notifiedToday, setNotifiedToday] = useState<Set<string>>(new Set());

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch {
        // Use defaults
      }
    }

    // Load notified items for today
    const today = format(new Date(), "yyyy-MM-dd");
    const notifiedData = localStorage.getItem(NOTIFIED_KEY);
    if (notifiedData) {
      try {
        const parsed = JSON.parse(notifiedData);
        if (parsed.date === today) {
          setNotifiedToday(new Set(parsed.items));
        } else {
          // Clear old data
          localStorage.removeItem(NOTIFIED_KEY);
        }
      } catch {
        // Ignore
      }
    }

    // Check current permission
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Save settings to localStorage
  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      // Browser does not support notifications
      return "denied";
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  // Mark item as notified
  const markNotified = useCallback((itemId: string) => {
    setNotifiedToday(prev => {
      const updated = new Set(prev);
      updated.add(itemId);
      
      // Save to localStorage
      const today = format(new Date(), "yyyy-MM-dd");
      localStorage.setItem(NOTIFIED_KEY, JSON.stringify({
        date: today,
        items: Array.from(updated),
      }));
      
      return updated;
    });
  }, []);

  // Show a notification
  const showNotification = useCallback((title: string, body: string, tag?: string) => {
    if (permission !== "granted" || !settings.enabled) return;

    const notification = new Notification(title, {
      body,
      icon: "/pwa-icons/icon-192x192.png",
      badge: "/pwa-icons/icon-96x96.png",
      tag: tag || "mindmate-reminder",
      requireInteraction: false,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto-close after 10 seconds
    setTimeout(() => notification.close(), 10000);
  }, [permission, settings.enabled]);

  // Check items and send notifications
  const checkAndNotify = useCallback((items: AtomItem[]) => {
    if (permission !== "granted" || !settings.enabled) return;

    const now = new Date();
    const tasksToNotify: { item: AtomItem; type: "today" | "tomorrow" | "overdue" }[] = [];

    for (const item of items) {
      // Skip if already notified today
      if (notifiedToday.has(item.id)) continue;
      
      // Skip completed items
      if (item.completed) continue;
      
      // Skip items without due_date
      if (!item.due_date) continue;
      
      // Skip non-operational items (reflections, milestones)
      if (item.type === "reflection") continue;
      if (item.tags?.includes("#milestone")) continue;

      const dueDate = parseISO(item.due_date);

      if (settings.remindOverdue && isPast(dueDate) && !isToday(dueDate)) {
        tasksToNotify.push({ item, type: "overdue" });
      } else if (settings.remindToday && isToday(dueDate)) {
        tasksToNotify.push({ item, type: "today" });
      } else if (settings.remindTomorrow && isTomorrow(dueDate)) {
        tasksToNotify.push({ item, type: "tomorrow" });
      }
    }

    // Group notifications to avoid spam
    if (tasksToNotify.length === 0) return;

    const overdueCount = tasksToNotify.filter(t => t.type === "overdue").length;
    const todayCount = tasksToNotify.filter(t => t.type === "today").length;
    const tomorrowCount = tasksToNotify.filter(t => t.type === "tomorrow").length;

    // Show summary notification
    const parts: string[] = [];
    if (overdueCount > 0) parts.push(`${overdueCount} atrasada${overdueCount > 1 ? "s" : ""}`);
    if (todayCount > 0) parts.push(`${todayCount} para hoje`);
    if (tomorrowCount > 0) parts.push(`${tomorrowCount} para amanhã`);

    if (parts.length > 0) {
      showNotification(
        "🔔 MindMate - Lembretes",
        `Você tem: ${parts.join(", ")}`,
        "mindmate-daily-summary"
      );

      // Mark all as notified
      tasksToNotify.forEach(({ item }) => markNotified(item.id));
    }
  }, [permission, settings, notifiedToday, showNotification, markNotified]);

  return {
    permission,
    settings,
    updateSettings,
    requestPermission,
    showNotification,
    checkAndNotify,
    isSupported: typeof window !== "undefined" && "Notification" in window,
  };
}
