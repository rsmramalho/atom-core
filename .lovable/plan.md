

# MindMate v4.0.0-alpha.25 -- Push Notifications com VAPID Keys

## Overview

Upgrade the current Web Notifications API (client-only, requires app open) to true Web Push Notifications via the Push API + Service Worker. This enables notifications even when the app is closed.

## Architecture

```text
┌─────────────┐     subscribe      ┌──────────────────┐
│  Browser SW  │◄──────────────────│  Frontend (React) │
│  (push event)│                    │  usePushNotifs()  │
└──────┬───────┘                    └────────┬──────────┘
       │ push received                       │ save subscription
       ▼                                     ▼
  Show notification              ┌───────────────────────┐
                                 │  push_subscriptions   │
                                 │  (Supabase table)     │
                                 └───────────┬───────────┘
                                             │
                                 ┌───────────▼───────────┐
                                 │  send-push-notification│
                                 │  (Edge Function)       │
                                 │  Uses web-push + VAPID │
                                 └───────────────────────┘
```

## Implementation Steps

### 1. Generate VAPID Keys & Store as Secrets
- Generate a VAPID key pair (can be done via `web-push generate-vapid-keys`)
- Store `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` as backend secrets
- Expose the public key to the frontend via an edge function or hardcode it (public keys are safe to embed)

### 2. Create `push_subscriptions` Database Table
```sql
CREATE TABLE public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  endpoint text NOT NULL,
  p256dh text NOT NULL,
  auth text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, endpoint)
);
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
-- RLS: users can only CRUD their own subscriptions
```

### 3. Create Edge Function `send-push-notification`
- `supabase/functions/send-push-notification/index.ts`
- Uses `web-push` npm package to send push messages
- Accepts `{ user_id, title, body }` payload
- Reads VAPID keys from secrets, queries user subscriptions, sends push to each
- Authenticated via service role key (called from cron or other edge functions)

### 4. Create Edge Function `check-due-tasks`
- `supabase/functions/check-due-tasks/index.ts`
- Scheduled cron job (hourly) that queries items with due dates
- Groups by user, builds notification summary (overdue/today/tomorrow)
- Calls `send-push-notification` for each user with pending reminders
- Tracks last notification sent per user to avoid spam

### 5. Add Service Worker Push Handler
- Add `push` and `notificationclick` event listeners to the SW
- vite-plugin-pwa supports custom SW code via `injectManifest` or by adding to the generated SW
- On push: show notification with icon/badge
- On click: focus/open the app

### 6. Update Frontend: `usePushNotifications` Hook
- New hook that handles:
  - Requesting push permission (reuses existing notification permission)
  - Subscribing to push via `registration.pushManager.subscribe()` with VAPID public key
  - Saving the `PushSubscription` (endpoint, keys) to `push_subscriptions` table
  - Unsubscribing (delete from table)
- Integrated into `NotificationSettings` UI with a new "Push Notifications" toggle

### 7. Update `NotificationSettings` UI
- Add a section for push notifications (separate from in-app browser notifications)
- Show subscription status
- Keep existing in-app notification settings as fallback

### 8. Update Version & Docs
- Bump to `alpha.25` in `AppNavigation.tsx`
- Update CHANGELOG, ARCHITECTURE.md, FULL_DOCUMENTATION.md

## Technical Details

- **VAPID**: Voluntary Application Server Identification -- standard for push without proprietary services
- **web-push**: npm package used in edge function (`npm:web-push`) for sending push messages
- **PushSubscription** contains: `endpoint` (browser push service URL), `keys.p256dh` and `keys.auth` (encryption keys)
- The existing `NotificationManager` + `useNotifications` remain as the in-app fallback for when push isn't available
- Service worker push events work even when the tab is closed

## Secret Requirements
Two secrets will need to be added:
- `VAPID_PUBLIC_KEY` -- embedded in frontend for subscription
- `VAPID_PRIVATE_KEY` -- used only in edge function for signing

