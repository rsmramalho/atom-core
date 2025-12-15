import { NavLink } from "@/components/NavLink";
import { Home, FolderKanban, Inbox, Terminal, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Projetos", url: "/projects", icon: FolderKanban },
  { title: "Inbox", url: "/inbox", icon: Inbox },
];

export function AppNavigation() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logout realizado" });
    navigate("/");
  };

  const openDebug = () => {
    const event = new KeyboardEvent('keydown', {
      key: 'E',
      ctrlKey: true,
      shiftKey: true,
    });
    window.dispatchEvent(event);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border md:relative md:border-t-0 md:border-r md:h-screen md:w-64 md:flex-shrink-0">
      <div className="flex items-center justify-around py-2 md:flex-col md:items-stretch md:justify-start md:py-6 md:px-4 md:gap-2 md:h-full">
        {/* Logo - Desktop only */}
        <div className="hidden md:block mb-8">
          <h1 className="text-xl font-bold text-primary">MindMate</h1>
          <p className="text-xs text-muted-foreground">Atom Engine 4.0</p>
        </div>

        {/* Nav Items */}
        <div className="flex items-center justify-around w-full md:flex-col md:gap-1 md:flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === "/"}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors md:flex-row md:gap-3 md:justify-start md:w-full"
              activeClassName="text-primary bg-primary/10"
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs md:text-sm">{item.title}</span>
            </NavLink>
          ))}
        </div>

        {/* Bottom Actions - Desktop */}
        <div className="hidden md:flex md:flex-col md:gap-2 md:mt-auto md:pt-4 md:border-t md:border-border">
          <Button
            variant="ghost"
            size="sm"
            className="justify-start gap-3 text-muted-foreground hover:text-foreground"
            onClick={openDebug}
          >
            <Terminal className="h-4 w-4" />
            Debug Console
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>

        {/* Debug - Mobile */}
        <button
          onClick={openDebug}
          className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground hover:text-foreground md:hidden"
        >
          <Terminal className="h-5 w-5" />
          <span className="text-xs">Debug</span>
        </button>
      </div>
    </nav>
  );
}
