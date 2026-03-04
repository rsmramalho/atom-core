import { useState } from "react";
import { Bell, BellOff, BellRing, Smartphone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from "@/hooks/useNotifications";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function NotificationSettings() {
  const { 
    permission, 
    settings, 
    updateSettings, 
    requestPermission,
    isSupported,
  } = useNotifications();

  const push = usePushNotifications();
  const user = useCurrentUser();
  const [isSendingTest, setIsSendingTest] = useState(false);

  const handleSendTest = async () => {
    if (!user) return;
    setIsSendingTest(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-push-notification", {
        body: {
          user_id: user.id,
          title: "🧪 Teste - MindMate",
          body: "Push notification funcionando! 🎉",
          url: "/app",
        },
      });
      if (error) throw error;
      if (data?.sent > 0) {
        toast.success("Notificação de teste enviada!");
      } else {
        toast.info("Nenhum endpoint registrado. Tente desativar e reativar o push.");
      }
    } catch (err) {
      console.error("Test push failed:", err);
      toast.error("Erro ao enviar notificação de teste.");
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleRequestPermission = async () => {
    const result = await requestPermission();
    if (result === "granted") {
      toast.success("Notificações ativadas!");
    } else if (result === "denied") {
      toast.error("Permissão negada. Ative nas configurações do navegador.");
    }
  };

  const handlePushToggle = async (enabled: boolean) => {
    if (enabled) {
      const ok = await push.subscribe();
      if (ok) {
        toast.success("Push notifications ativadas! Você receberá lembretes mesmo com o app fechado.");
      } else {
        toast.error("Não foi possível ativar push notifications.");
      }
    } else {
      await push.unsubscribe();
      toast.success("Push notifications desativadas.");
    }
  };

  if (!isSupported) {
    return null;
  }

  const getIcon = () => {
    if (permission === "denied") return <BellOff className="h-4 w-4" />;
    if (permission === "granted" && settings.enabled) return <BellRing className="h-4 w-4" />;
    return <Bell className="h-4 w-4" />;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative"
          title="Configurações de notificação"
        >
          {getIcon()}
          {permission === "granted" && settings.enabled && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <div className="space-y-4">
          <div className="font-medium">Notificações</div>
          
          {permission === "default" && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Receba lembretes de tarefas no navegador.
              </p>
              <Button 
                onClick={handleRequestPermission}
                size="sm"
                className="w-full"
              >
                <Bell className="h-4 w-4 mr-2" />
                Ativar Notificações
              </Button>
            </div>
          )}

          {permission === "denied" && (
            <p className="text-sm text-muted-foreground">
              Notificações foram bloqueadas. Para ativar, acesse as configurações 
              do seu navegador e permita notificações para este site.
            </p>
          )}

          {permission === "granted" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications-enabled" className="text-sm">
                  Ativar lembretes
                </Label>
                <Switch
                  id="notifications-enabled"
                  checked={settings.enabled}
                  onCheckedChange={(enabled) => updateSettings({ enabled })}
                />
              </div>

              {settings.enabled && (
                <>
                  <div className="h-px bg-border" />
                  
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Lembrar de tarefas
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="remind-overdue" className="text-sm font-normal">
                        Atrasadas
                      </Label>
                      <Switch
                        id="remind-overdue"
                        checked={settings.remindOverdue}
                        onCheckedChange={(remindOverdue) => updateSettings({ remindOverdue })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="remind-today" className="text-sm font-normal">
                        Para hoje
                      </Label>
                      <Switch
                        id="remind-today"
                        checked={settings.remindToday}
                        onCheckedChange={(remindToday) => updateSettings({ remindToday })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="remind-tomorrow" className="text-sm font-normal">
                        Para amanhã
                      </Label>
                      <Switch
                        id="remind-tomorrow"
                        checked={settings.remindTomorrow}
                        onCheckedChange={(remindTomorrow) => updateSettings({ remindTomorrow })}
                      />
                    </div>
                  </div>

                  {/* Push Notifications Section */}
                  {push.isSupported && (
                    <>
                      <div className="h-px bg-border" />
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-1.5">
                          <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            Push Notifications
                          </p>
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                          Receba lembretes mesmo com o app fechado.
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-enabled" className="text-sm font-normal">
                            {push.status === "subscribed" ? "Ativo" : "Ativar push"}
                          </Label>
                          <Switch
                            id="push-enabled"
                            checked={push.status === "subscribed"}
                            onCheckedChange={handlePushToggle}
                            disabled={push.isLoading || push.status === "denied"}
                          />
                        </div>

                        {push.status === "denied" && (
                          <p className="text-xs text-destructive">
                            Push bloqueado pelo navegador.
                          </p>
                        )}

                        {push.status === "subscribed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={handleSendTest}
                            disabled={isSendingTest}
                          >
                            <Send className="h-3.5 w-3.5 mr-2" />
                            {isSendingTest ? "Enviando..." : "Enviar teste"}
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
