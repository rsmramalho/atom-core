import { Bell, BellOff, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from "@/hooks/useNotifications";
import { toast } from "sonner";

export function NotificationSettings() {
  const { 
    permission, 
    settings, 
    updateSettings, 
    requestPermission,
    isSupported,
  } = useNotifications();

  const handleRequestPermission = async () => {
    const result = await requestPermission();
    if (result === "granted") {
      toast.success("Notificações ativadas!");
    } else if (result === "denied") {
      toast.error("Permissão negada. Ative nas configurações do navegador.");
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
                </>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
