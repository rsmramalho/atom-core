import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AppNavigation } from "./AppNavigation";
import { CommandPalette } from "./CommandPalette";
import { EngineDebugConsole } from "@/components/EngineDebugConsole";
import { KeyboardShortcutsHelp } from "./KeyboardShortcutsHelp";
import { NotificationManager } from "@/components/notifications";
import { useDebugConsole } from "@/hooks/useDebugConsole";
import { Loader2 } from "lucide-react";
import type { User } from "@/types/auth";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const { isOpen } = useDebugConsole();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <AppNavigation />
      
      {/* Main content with top padding on mobile for fixed header */}
      <main className="flex-1 pt-14 md:pt-0 overflow-auto">
        {children}
      </main>

      {/* Command Palette - Global */}
      <CommandPalette />

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp />

      {/* Notification Manager (background checks) */}
      <NotificationManager />

      {/* Debug Console */}
      {isOpen && <EngineDebugConsole isOpen={isOpen} onClose={() => {}} />}
    </div>
  );
}
