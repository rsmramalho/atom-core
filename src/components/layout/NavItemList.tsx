import { NavLink } from "@/components/NavLink";
import { Home, FolderKanban, Inbox, ListChecks, Calendar, BookOpen, BarChart3 } from "lucide-react";

export const navItems = [
  { title: "Home", url: "/app", icon: Home },
  { title: "Projetos", url: "/projects", icon: FolderKanban },
  { title: "Inbox", url: "/inbox", icon: Inbox },
  { title: "Listas", url: "/lists", icon: ListChecks },
  { title: "Calendário", url: "/calendar", icon: Calendar },
  { title: "Diário", url: "/journal", icon: BookOpen },
  { title: "Estatísticas", url: "/analytics", icon: BarChart3 },
];

interface NavItemListProps {
  onItemClick?: () => void;
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
}

export function NavItemList({ onItemClick, wrapper: Wrapper }: NavItemListProps) {
  return (
    <>
      {navItems.map((item) => {
        const link = (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === "/"}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            activeClassName="text-primary bg-primary/10"
            onClick={onItemClick}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </NavLink>
        );

        return Wrapper ? <Wrapper key={item.url}>{link}</Wrapper> : <div key={item.url}>{link}</div>;
      })}
    </>
  );
}
