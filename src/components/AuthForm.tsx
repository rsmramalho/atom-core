// Atom Engine 4.0 - Authentication Form
// Simple login/signup for testing the engine

import { useState, forwardRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogIn, UserPlus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AuthError } from "@/types/auth";

interface AuthFormProps {
  onSuccess?: () => void;
}

export const AuthForm = forwardRef<HTMLDivElement, AuthFormProps>(function AuthForm({ onSuccess }, ref) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { toast } = useToast();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Informe o e-mail", description: "Digite seu e-mail para recuperar a senha.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast({ title: "E-mail enviado", description: "Verifique sua caixa de entrada para redefinir a senha." });
      setIsForgotPassword(false);
    } catch (error) {
      const authError = error as AuthError;
      toast({ title: "Erro", description: authError.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

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
        toast({ title: "Login realizado", description: "Bem-vindo de volta!" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast({ title: "Conta criada", description: "Você já pode usar o sistema." });
      }
      onSuccess?.();
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Error",
        description: authError.message,
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
          {isForgotPassword ? "Recuperar Senha" : isLogin ? "Entrar" : "Criar Conta"}
        </h2>
        
        <form onSubmit={isForgotPassword ? handleForgotPassword : handleSubmit} className="space-y-4">
          <div>
              <label className="block text-console-muted font-mono text-xs mb-1">
              E-mail
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
              Senha
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
            {isLogin ? "Entrar" : "Cadastrar"}
          </button>
        </form>

        <div className="mt-4 text-center space-y-2">
          {isLogin && !isForgotPassword && (
            <button
              type="button"
              onClick={() => setIsForgotPassword(true)}
              className="text-console-muted font-mono text-xs hover:text-console-accent hover:underline block mx-auto"
            >
              Esqueceu a senha?
            </button>
          )}
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setIsForgotPassword(false); }}
            className="text-console-accent font-mono text-xs hover:underline"
          >
            {isForgotPassword ? "Voltar ao login" : isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
          </button>
        </div>
      </div>
    </div>
  );
});
