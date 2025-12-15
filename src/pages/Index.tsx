// Atom Engine 4.0 - Main Entry Point
// Debug-focused interface for engine validation

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Terminal, LogOut, User, Inbox } from "lucide-react";
import { EngineDebugConsole } from "@/components/EngineDebugConsole";
import { AuthForm } from "@/components/AuthForm";
import { useDebugConsole } from "@/hooks/useDebugConsole";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const Index = () => {
  const navigate = useNavigate();
  const { isOpen, open, close } = useDebugConsole();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-console-muted font-mono text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-console-border bg-console-header">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-console-accent flex items-center justify-center">
              <Terminal className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-console-text font-mono font-bold text-lg">
                MindMate
              </h1>
              <p className="text-console-muted font-mono text-xs">
                Atom Engine 4.0
              </p>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-console-muted font-mono text-xs">
                <User className="w-4 h-4" />
                {user.email}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-console-muted hover:text-console-text hover:bg-console-hover rounded transition-colors"
              >
                <LogOut className="w-3 h-3" />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        {!user ? (
          <div className="w-full max-w-lg">
            <div className="text-center mb-8">
              <h2 className="text-console-text font-mono text-2xl font-bold mb-2">
                Engine Debug Mode
              </h2>
              <p className="text-console-muted font-mono text-sm">
                Authenticate to access the debug console
              </p>
            </div>
            <AuthForm onSuccess={() => {}} />
          </div>
        ) : (
          <div className="text-center max-w-lg">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-console border border-console-border flex items-center justify-center">
                <Terminal className="w-10 h-10 text-console-accent" />
              </div>
              <h2 className="text-console-text font-mono text-2xl font-bold mb-2">
                Atom Engine 4.0
              </h2>
              <p className="text-console-muted font-mono text-sm">
                Core Engine ready for validation
              </p>
            </div>

            <button
              onClick={open}
              className="inline-flex items-center gap-3 px-6 py-4 bg-console-accent hover:bg-console-accent/90 text-black font-mono font-semibold rounded-lg transition-all hover:scale-105 shadow-lg shadow-console-accent/20"
            >
              <Terminal className="w-5 h-5" />
              Open Debug Console
            </button>

            <button
              onClick={() => navigate("/inbox")}
              className="ml-4 inline-flex items-center gap-3 px-6 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-mono font-semibold rounded-lg transition-all hover:scale-105 shadow-lg shadow-primary/20"
            >
              <Inbox className="w-5 h-5" />
              Abrir Inbox
            </button>

            <div className="mt-6 p-4 bg-console rounded-lg border border-console-border">
              <p className="text-console-muted font-mono text-xs">
                Keyboard shortcut:{" "}
                <kbd className="px-2 py-1 bg-console-border rounded text-console-text">
                  Ctrl+Shift+E
                </kbd>{" "}
                or{" "}
                <kbd className="px-2 py-1 bg-console-border rounded text-console-text">
                  Cmd+Shift+E
                </kbd>
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 text-left">
              <div className="p-4 bg-console rounded-lg border border-console-border">
                <h3 className="text-console-accent font-mono text-xs font-semibold mb-1">
                  State
                </h3>
                <p className="text-console-muted font-mono text-xs">
                  View all items as raw JSON
                </p>
              </div>
              <div className="p-4 bg-console rounded-lg border border-console-border">
                <h3 className="text-console-accent font-mono text-xs font-semibold mb-1">
                  Logs
                </h3>
                <p className="text-console-muted font-mono text-xs">
                  Engine action logs
                </p>
              </div>
              <div className="p-4 bg-console rounded-lg border border-console-border">
                <h3 className="text-console-accent font-mono text-xs font-semibold mb-1">
                  Input Test
                </h3>
                <p className="text-console-muted font-mono text-xs">
                  Test the ParsingEngine
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Debug Console Overlay */}
      <EngineDebugConsole isOpen={isOpen} onClose={close} />
    </main>
  );
};

export default Index;
