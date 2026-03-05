import { useState, useEffect, useRef } from "react";
import { Menu, Command } from "lucide-react";
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
import { NavItemList } from "./NavItemList";
import { SyncStatus } from "./SyncStatus";
import { SidebarActions } from "./SidebarActions";

const VERSION = "v4.0.0-beta.1";
const VERSION_NOTES = [
  "Trigger de perfil auto-criado corrigido",
  "Error boundaries por rota",
  "Proteção contra double-submit em formulários",
  "Timeout no reset de senha",
  "Validação Zod em todos os inputs",
  "Acessibilidade (aria-labels, landmarks, zoom)",
];

function VersionTooltip({ children }: { children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs">
        <p className="font-semibold mb-1">Novidades:</p>
        <ul className="text-xs space-y-0.5 list-disc list-inside">
          {VERSION_NOTES.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </TooltipContent>
    </Tooltip>
  );
}

export function AppNavigation() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastSync, setLastSync] = useState('');
  const [showClearCacheDialog, setShowClearCacheDialog] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isOnline, isSyncing, pendingCount, syncPendingOperations, updatePendingCount } = useOfflineSyncContext();

  useEffect(() => {
    const updateSyncTime = () => {
      const timestamp = getCacheTimestamp();
      setLastSync(formatCacheAge(timestamp));
    };
    updateSyncTime();
    const interval = setInterval(updateSyncTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado");
    navigate("/");
  };

  const openDebug = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'E', ctrlKey: true, shiftKey: true }));
  };

  const openCommandPalette = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerImport = () => fileInputRef.current?.click();

  const closeMobileAndDo = (fn: () => void) => () => {
    setMobileMenuOpen(false);
    fn();
  };

  const MobileSheetClose = ({ children }: { children: React.ReactNode }) => (
    <SheetClose asChild>{children}</SheetClose>
  );

  const syncProps = {
    lastSync,
    pendingCount,
    isOnline,
    isSyncing,
    onSync: () => syncPendingOperations(),
    onShowPending: () => setShowPendingModal(true),
  };

  const actionProps = {
    onDebug: openDebug,
    onClearCache: () => setShowClearCacheDialog(true),
    onExport: handleExportBackup,
    onImport: triggerImport,
    onLogout: handleLogout,
  };

  return (
    <>
      {/* Mobile: Fixed top bar */}
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
                <div className="p-6 border-b border-border">
                  <h1 className="text-xl font-bold text-primary">MindMate</h1>
                  <VersionTooltip>
                    <p className="text-xs text-muted-foreground cursor-help hover:text-primary transition-colors">{VERSION}</p>
                  </VersionTooltip>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                  <NavItemList onItemClick={() => setMobileMenuOpen(false)} wrapper={MobileSheetClose} />
                </nav>

                <div className="px-4 py-2 border-t border-border">
                  <SyncStatus {...syncProps} />
                </div>

                <div className="p-4 border-t border-border space-y-1">
                  <SidebarActions
                    {...{
                      ...actionProps,
                      onDebug: closeMobileAndDo(openDebug),
                      onClearCache: closeMobileAndDo(() => setShowClearCacheDialog(true)),
                      onExport: closeMobileAndDo(handleExportBackup),
                      onImport: closeMobileAndDo(triggerImport),
                      onLogout: closeMobileAndDo(handleLogout),
                    }}
                    wrapper={MobileSheetClose}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex flex-col items-center">
            <h1 className="text-lg font-bold text-primary leading-none">MindMate</h1>
            <VersionTooltip>
              <span className="text-[10px] text-muted-foreground cursor-help hover:text-primary transition-colors">{VERSION}</span>
            </VersionTooltip>
          </div>

          <div className="flex items-center gap-1">
            <NotificationSettings />
            <Button variant="ghost" size="icon" onClick={openCommandPalette}>
              <Command className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop: Sidebar */}
      <nav className="hidden md:flex md:flex-col md:border-r md:border-border md:h-screen md:w-64 md:flex-shrink-0 md:bg-card/50">
        <div className="flex flex-col h-full py-6 px-4">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-primary">MindMate</h1>
              <VersionTooltip>
                <p className="text-xs text-muted-foreground cursor-help hover:text-primary transition-colors">{VERSION}</p>
              </VersionTooltip>
            </div>
            <NotificationSettings />
          </div>

          <button
            onClick={openCommandPalette}
            className="flex items-center gap-2 px-3 py-2 mb-4 text-sm text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted rounded-lg transition-colors"
          >
            <Command className="h-4 w-4" />
            <span className="flex-1 text-left">Buscar...</span>
            <kbd className="text-xs bg-background px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
          </button>

          <div className="flex-1 space-y-1">
            <NavItemList />
          </div>

          <div className="mt-auto pt-4 border-t border-border">
            <SyncStatus {...syncProps} />
          </div>

          <div className="pt-2 space-y-1">
            <SidebarActions {...actionProps} />
          </div>
        </div>
      </nav>

      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} onChange={handleImportBackup} accept=".json" className="hidden" />

      {/* Clear Cache Dialog */}
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
            <AlertDialogAction onClick={confirmClearCache}>Limpar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pending Operations Modal */}
      <PendingOperationsModal open={showPendingModal} onOpenChange={setShowPendingModal} onOperationsChanged={updatePendingCount} />

      {/* Floating Pending Indicator */}
      <PendingIndicator onClick={() => setShowPendingModal(true)} />
    </>
  );
}
