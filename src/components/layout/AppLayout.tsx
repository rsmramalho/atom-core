import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AppNavigation } from "./AppNavigation";
import { CommandPalette } from "./CommandPalette";
import { EngineDebugConsole } from "@/components/EngineDebugConsole";
import { KeyboardShortcutsHelp } from "./KeyboardShortcutsHelp";
import { NotificationManager } from "@/components/notifications";
import { WelcomeModal, TourOverlay, FirstStepsChecklist } from "@/components/onboarding";
import { useDebugConsole } from "@/hooks/useDebugConsole";
import { AuthForm } from "@/components/AuthForm";
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
    // Listen for auth changes - set up BEFORE getSession
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle session expiry gracefully
      if (event === "TOKEN_REFRESHED" && !session) {
        navigate("/app");
      }
      if (event === "SIGNED_OUT") {
        // Clear query cache on logout
        setUser(null);
      }
    });

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">MindMate</h1>
            <p className="text-muted-foreground">Atom Engine 4.0</p>
          </div>
          <AuthForm />
        </div>
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

      {/* Onboarding (only for authenticated users) */}
      <WelcomeModal />
      <TourOverlay />
      <FirstStepsChecklist />

      {/* Debug Console */}
      {isOpen && <EngineDebugConsole isOpen={isOpen} onClose={() => {}} />}
    </div>
  );
}
