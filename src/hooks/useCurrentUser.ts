// Atom Engine 4.0 - useCurrentUser Hook
// Provides synchronous access to the cached session user
// Avoids redundant supabase.auth.getUser() network calls
// AppLayout guarantees auth, so session is always available

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@/types/auth";

let cachedUser: User | null = null;

// Listen to auth state changes globally (runs once)
let listenerInitialized = false;
function initListener() {
  if (listenerInitialized) return;
  listenerInitialized = true;

  supabase.auth.onAuthStateChange((_event, session) => {
    cachedUser = session?.user ?? null;
  });

  // Seed from current session
  supabase.auth.getSession().then(({ data: { session } }) => {
    cachedUser = session?.user ?? null;
  });
}

/**
 * Returns the current authenticated user synchronously from cache.
 * Safe to use in any component rendered under AppLayout (auth guaranteed).
 * Falls back to async getUser() if cache is not yet populated.
 */
export function useCurrentUser() {
  initListener();

  const [user, setUser] = useState<User | null>(cachedUser);

  useEffect(() => {
    // If cache is already populated, use it
    if (cachedUser) {
      setUser(cachedUser);
      return;
    }

    // Fallback: wait for session (only on first render before listener fires)
    supabase.auth.getSession().then(({ data: { session } }) => {
      cachedUser = session?.user ?? null;
      setUser(cachedUser);
    });
  }, []);

  // Keep in sync with auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      cachedUser = session?.user ?? null;
      setUser(cachedUser);
    });
    return () => subscription.unsubscribe();
  }, []);

  return user;
}

/**
 * Get the current user ID synchronously. Throws if not authenticated.
 * For use in query/mutation functions where auth is guaranteed.
 */
export async function getCurrentUserId(): Promise<string> {
  if (cachedUser) return cachedUser.id;

  // Fallback to session check
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    cachedUser = session.user;
    return session.user.id;
  }

  throw new Error("User not authenticated");
}
