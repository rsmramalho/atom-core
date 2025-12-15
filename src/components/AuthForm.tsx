// Atom Engine 4.0 - Authentication Form
// Simple login/signup for testing the engine

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogIn, UserPlus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthFormProps {
  onSuccess: () => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({ title: "Login successful", description: "Welcome back!" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast({ title: "Account created", description: "You can now use the debug console." });
      }
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-console rounded-lg border border-console-border p-6">
        <h2 className="text-console-text font-mono text-lg font-semibold mb-4">
          {isLogin ? "Login" : "Create Account"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-console-muted font-mono text-xs mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-console-input border border-console-border rounded px-3 py-2 font-mono text-sm text-console-text placeholder:text-console-muted focus:outline-none focus:border-console-accent"
              placeholder="user@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-console-muted font-mono text-xs mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-console-input border border-console-border rounded px-3 py-2 font-mono text-sm text-console-text placeholder:text-console-muted focus:outline-none focus:border-console-accent"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-console-accent hover:bg-console-accent/90 text-black font-mono text-sm font-semibold py-2.5 rounded transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isLogin ? (
              <LogIn className="w-4 h-4" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-console-accent font-mono text-xs hover:underline"
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
