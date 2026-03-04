import { useState, useEffect, useRef } from "react";
import { NavLink } from "@/components/NavLink";
import { Home, FolderKanban, Inbox, Terminal, LogOut, Menu, Command, BookOpen, Calendar, ListChecks, RefreshCw, Loader2, Trash2, Download, Upload, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getCacheTimestamp, formatCacheAge, clearLocalCache, exportCacheAsBackup, importCacheFromBackup } from "@/lib/local-cache";
import { useOfflineSyncContext } from "@/components/pwa/OfflineSyncContext";
import { PendingIndicator } from "@/components/pwa/PendingIndicator";
import { PendingOperationsModal } from "@/components/pwa/PendingOperationsModal";
import { NotificationSettings } from "@/components/notifications";
const navItems = [
  { title: "Home", url: "/app", icon: Home },
  { title: "Projetos", url: "/projects", icon: FolderKanban },
  { title: "Inbox", url: "/inbox", icon: Inbox },
  { title: "Listas", url: "/lists", icon: ListChecks },
  { title: "Calendário", url: "/calendar", icon: Calendar },
  { title: "Diário", url: "/journal", icon: BookOpen },
  { title: "Estatísticas", url: "/analytics", icon: BarChart3 },
];

export function AppNavigation() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastSync, setLastSync] = useState<string>('');
  const [showClearCacheDialog, setShowClearCacheDialog] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isOnline, isSyncing, pendingCount, syncPendingOperations, updatePendingCount } = useOfflineSyncContext();

  // Update sync time every minute
  useEffect(() => {
    const updateSyncTime = () => {
      const timestamp = getCacheTimestamp();
      setLastSync(formatCacheAge(timestamp));
    };
    
    updateSyncTime();
    const interval = setInterval(updateSyncTime, 30000); // Update every 30s
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado");
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

  const openCommandPalette = () => {
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
    });
    document.dispatchEvent(event);
  };

  const confirmClearCache = () => {
    clearLocalCache();
    setLastSync('Nunca');
    setShowClearCacheDialog(false);
    toast.success("Cache local limpo");
  };

  const handleExportBackup = () => {
    try {
      exportCacheAsBackup();
      toast.success("Backup exportado com sucesso");
    } catch {
      toast.error("Erro ao exportar backup");
    }
  };

  const handleImportBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importCacheFromBackup(file);
      const timestamp = getCacheTimestamp();
      setLastSync(formatCacheAge(timestamp));
      toast.success("Backup importado com sucesso");
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao importar backup");
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerImport = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* Mobile: Hamburger Menu Button - Fixed top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-ml-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b border-border">
                  <h1 className="text-xl font-bold text-primary">MindMate</h1>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-xs text-muted-foreground cursor-help hover:text-primary transition-colors">v4.0.0-alpha.21</p>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs">
                      <p className="font-semibold mb-1">Novidades:</p>
                      <ul className="text-xs space-y-0.5 list-disc list-inside">
                        <li>Code audit & cleanup</li>
                        <li>17 UI components removidos</li>
                        <li>6 dependências removidas</li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 p-4 space-y-1">
                  {navItems.map((item) => (
                    <SheetClose key={item.url} asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        activeClassName="text-primary bg-primary/10"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SheetClose>
                  ))}
                </nav>

                {/* Sync Status */}
                <div className="px-4 py-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <RefreshCw className="h-3 w-3" />
                      <span>Sync: {lastSync}</span>
                      {pendingCount > 0 && (
                        <button
                          onClick={() => setShowPendingModal(true)}
                          className="text-amber-500 hover:text-amber-400 hover:underline"
                        >
                          ({pendingCount})
                        </button>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => syncPendingOperations()}
                      disabled={!isOnline || isSyncing}
                    >
                      {isSyncing ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-border space-y-1">
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openDebug();
                      }}
                    >
                      <Terminal className="h-4 w-4" />
                      Debug Console
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setShowClearCacheDialog(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Limpar Cache
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleExportBackup();
                      }}
                    >
                      <Download className="h-4 w-4" />
                      Exportar Backup
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        triggerImport();
                      }}
                    >
                      <Upload className="h-4 w-4" />
                      Importar Backup
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex flex-col items-center">
            <h1 className="text-lg font-bold text-primary leading-none">MindMate</h1>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-[10px] text-muted-foreground cursor-help hover:text-primary transition-colors">v4.0.0-alpha.21</span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p className="font-semibold mb-1">Novidades:</p>
                <ul className="text-xs space-y-0.5 list-disc list-inside">
                  <li>Code audit & cleanup</li>
                  <li>17 UI components removidos</li>
                  <li>6 dependências removidas</li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-1">
            <NotificationSettings />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={openCommandPalette}
            >
              <Command className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop: Sidebar */}
      <nav className="hidden md:flex md:flex-col md:border-r md:border-border md:h-screen md:w-64 md:flex-shrink-0 md:bg-card/50">
        <div className="flex flex-col h-full py-6 px-4">
          {/* Logo */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-primary">MindMate</h1>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-xs text-muted-foreground cursor-help hover:text-primary transition-colors">v4.0.0-alpha.21</p>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="font-semibold mb-1">Novidades:</p>
                  <ul className="text-xs space-y-0.5 list-disc list-inside">
                    <li>Code audit & cleanup</li>
                    <li>17 UI components removidos</li>
                    <li>6 dependências removidas</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </div>
            <NotificationSettings />
          </div>

          {/* Command Palette Hint */}
          <button
            onClick={openCommandPalette}
            className="flex items-center gap-2 px-3 py-2 mb-4 text-sm text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted rounded-lg transition-colors"
          >
            <Command className="h-4 w-4" />
            <span className="flex-1 text-left">Buscar...</span>
            <kbd className="text-xs bg-background px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
          </button>

          {/* Nav Items */}
          <div className="flex-1 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.url}
                to={item.url}
                end={item.url === "/"}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                activeClassName="text-primary bg-primary/10"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </NavLink>
            ))}
          </div>

          {/* Sync Status */}
          <div className="mt-auto pt-4 border-t border-border">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <RefreshCw className="h-3 w-3" />
                <span>Sync: {lastSync}</span>
                {pendingCount > 0 && (
                  <button
                    onClick={() => setShowPendingModal(true)}
                    className="text-amber-500 hover:text-amber-400 hover:underline"
                  >
                    ({pendingCount})
                  </button>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => syncPendingOperations()}
                disabled={!isOnline || isSyncing}
                title={!isOnline ? 'Offline' : 'Sincronizar agora'}
              >
                {isSyncing ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-2 space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
              onClick={openDebug}
            >
              <Terminal className="h-4 w-4" />
              Debug Console
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
              onClick={() => setShowClearCacheDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
              Limpar Cache
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
              onClick={handleExportBackup}
            >
              <Download className="h-4 w-4" />
              Exportar Backup
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
              onClick={triggerImport}
            >
              <Upload className="h-4 w-4" />
              Importar Backup
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </nav>

      {/* Hidden file input for backup import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportBackup}
        accept=".json"
        className="hidden"
      />

      {/* Clear Cache Confirmation Dialog */}
      <AlertDialog open={showClearCacheDialog} onOpenChange={setShowClearCacheDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar cache local?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso removerá todos os dados salvos localmente. Os dados online não serão afetados, mas você precisará de conexão para recarregar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClearCache}>
              Limpar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pending Operations Modal */}
      <PendingOperationsModal
        open={showPendingModal}
        onOpenChange={setShowPendingModal}
        onOperationsChanged={updatePendingCount}
      />

      {/* Floating Pending Indicator */}
      <PendingIndicator onClick={() => setShowPendingModal(true)} />
    </>
  );
}
