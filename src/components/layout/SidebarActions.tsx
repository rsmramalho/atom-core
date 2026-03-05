import { Terminal, Trash2, Download, Upload, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

interface SidebarActionsProps {
  onDebug: () => void;
  onClearCache: () => void;
  onExport: () => void;
  onImport: () => void;
  onLogout: () => void;
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
}

export function SidebarActions({ onDebug, onClearCache, onExport, onImport, onLogout, wrapper: Wrapper }: SidebarActionsProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  const actions = [
    { icon: isDark ? Sun : Moon, label: isDark ? "Modo Claro" : "Modo Escuro", onClick: toggleTheme, destructive: false },
    { icon: Terminal, label: "Debug Console", onClick: onDebug, destructive: false },
    { icon: Trash2, label: "Limpar Cache", onClick: onClearCache, destructive: false },
    { icon: Download, label: "Exportar Backup", onClick: onExport, destructive: false },
    { icon: Upload, label: "Importar Backup", onClick: onImport, destructive: false },
    { icon: LogOut, label: "Sair", onClick: onLogout, destructive: true },
  ];

  return (
    <>
      {actions.map((action) => {
        const button = (
          <Button
            key={action.label}
            variant="ghost"
            size="sm"
            className={`w-full justify-start gap-3 text-muted-foreground ${
              action.destructive ? 'hover:text-destructive' : 'hover:text-foreground'
            }`}
            onClick={action.onClick}
          >
            <action.icon className="h-4 w-4" />
            {action.label}
          </Button>
        );

        return Wrapper ? <Wrapper key={action.label}>{button}</Wrapper> : <div key={action.label}>{button}</div>;
      })}
    </>
  );
}
