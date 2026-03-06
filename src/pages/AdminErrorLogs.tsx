import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "@/components/shared";
import {
  AlertTriangle,
  ArrowLeft,
  Bug,
  Clock,
  Filter,
  Globe,
  Monitor,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface ErrorLog {
  id: string;
  created_at: string;
  error_message: string;
  error_type: string | null;
  error_stack: string | null;
  component_stack: string | null;
  url: string | null;
  user_agent: string | null;
  app_version: string | null;
  user_id: string | null;
  metadata: Record<string, unknown> | null;
}

export default function AdminErrorLogs() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [versionFilter, setVersionFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("7d");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [purging, setPurging] = useState(false);
  const [purgeDays, setPurgeDays] = useState<string>("30");

  const handlePurge = async () => {
    setPurging(true);
    try {
      const cutoff = new Date(Date.now() - Number(purgeDays) * 24 * 60 * 60 * 1000).toISOString();
      const { error, count } = await supabase
        .from("error_logs")
        .delete({ count: "exact" })
        .lt("created_at", cutoff);
      if (error) throw error;
      toast.success(`${count ?? 0} erros removidos com sucesso`);
      fetchLogs();
    } catch (err) {
      console.error("Purge failed:", err);
      toast.error("Falha ao limpar erros");
    } finally {
      setPurging(false);
    }
  };

  // Auth guard
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/", { replace: true });
      } else {
        setIsAuthenticated(true);
      }
      setAuthChecked(true);
    });
  }, [navigate]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("error_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);

      // Date filter
      if (dateFilter !== "all") {
        const now = new Date();
        const daysMap: Record<string, number> = {
          "1h": 1 / 24,
          "24h": 1,
          "7d": 7,
          "30d": 30,
        };
        const days = daysMap[dateFilter] || 7;
        const since = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        query = query.gte("created_at", since.toISOString());
      }

      if (typeFilter !== "all") {
        query = query.eq("error_type", typeFilter);
      }

      if (versionFilter !== "all") {
        query = query.eq("app_version", versionFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setLogs((data as ErrorLog[]) || []);
    } catch (err) {
      console.error("Failed to fetch error logs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch + realtime subscription
  useEffect(() => {
    fetchLogs();

    const channel = supabase
      .channel("error-logs-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "error_logs" },
        (payload) => {
          setLogs((prev) => [payload.new as ErrorLog, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [typeFilter, versionFilter, dateFilter]);

  // Auto-refresh every 30s
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchLogs, 30_000);
    return () => clearInterval(interval);
  }, [autoRefresh, typeFilter, versionFilter, dateFilter]);

  // Derived data
  const uniqueTypes = useMemo(
    () => [...new Set(logs.map((l) => l.error_type).filter(Boolean))] as string[],
    [logs]
  );

  const uniqueVersions = useMemo(
    () => [...new Set(logs.map((l) => l.app_version).filter(Boolean))] as string[],
    [logs]
  );

  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return logs;
    const q = searchQuery.toLowerCase();
    return logs.filter(
      (l) =>
        l.error_message.toLowerCase().includes(q) ||
        l.error_stack?.toLowerCase().includes(q) ||
        l.url?.toLowerCase().includes(q)
    );
  }, [logs, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const now = new Date();
    const last24h = logs.filter(
      (l) => new Date(l.created_at).getTime() > now.getTime() - 24 * 60 * 60 * 1000
    ).length;
    const lastHour = logs.filter(
      (l) => new Date(l.created_at).getTime() > now.getTime() - 60 * 60 * 1000
    ).length;
    return { total: logs.length, last24h, lastHour };
  }, [logs]);

  const getTypeBadgeVariant = (type: string | null) => {
    switch (type) {
      case "react_error_boundary":
        return "destructive";
      case "unhandled_rejection":
        return "outline";
      default:
        return "secondary";
    }
  };

  if (!authChecked || !isAuthenticated) {
    return <PageLoader message="Verificando autenticação..." />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/app")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Bug className="h-5 w-5 text-destructive" />
              <h1 className="text-lg font-bold">Error Logs</h1>
            </div>
            {autoRefresh && (
              <Badge variant="outline" className="gap-1 text-xs text-primary border-primary/30">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Live
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="gap-1.5 text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${autoRefresh ? "animate-spin" : ""}`} style={autoRefresh ? { animationDuration: "3s" } : {}} />
              {autoRefresh ? "Auto" : "Manual"}
            </Button>
            <Button variant="outline" size="sm" onClick={fetchLogs} className="gap-1.5 text-xs">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs text-destructive border-destructive/30 hover:bg-destructive/10">
                  <Trash2 className="h-3.5 w-3.5" />
                  Limpar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Limpar erros antigos</AlertDialogTitle>
                  <AlertDialogDescription>
                    Isso irá deletar permanentemente todos os erros mais antigos que o período selecionado.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Select value={purgeDays} onValueChange={setPurgeDays}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Mais de 1 dia</SelectItem>
                    <SelectItem value="7">Mais de 7 dias</SelectItem>
                    <SelectItem value="30">Mais de 30 dias</SelectItem>
                    <SelectItem value="90">Mais de 90 dias</SelectItem>
                  </SelectContent>
                </Select>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handlePurge} disabled={purging} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    {purging ? "Limpando..." : "Confirmar exclusão"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Spike Alert Banner */}
        <AnimatePresence>
          {stats.lastHour >= 5 && (
            <motion.div
              key="spike-alert"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3"
            >
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-destructive">
                  ⚠️ Spike de erros detectado
                </p>
                <p className="text-xs text-destructive/80">
                  {stats.lastHour} erros na última hora (limite: 5). Investigue imediatamente.
                </p>
              </div>
              <Badge variant="destructive" className="text-xs">
                {stats.lastHour} erros/h
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total no período</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.last24h}</p>
                <p className="text-xs text-muted-foreground">Últimas 24h</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Monitor className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.lastHour}</p>
                <p className="text-xs text-muted-foreground">Última hora</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filtros</span>
              </div>
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por mensagem, stack ou URL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-muted border-border"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[140px] bg-muted border-border">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Última hora</SelectItem>
                  <SelectItem value="24h">Últimas 24h</SelectItem>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  <SelectItem value="all">Todos</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px] bg-muted border-border">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {uniqueTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={versionFilter} onValueChange={setVersionFilter}>
                <SelectTrigger className="w-[160px] bg-muted border-border">
                  <SelectValue placeholder="Versão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas versões</SelectItem>
                  {uniqueVersions.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Log Entries */}
        <div className="space-y-2">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="bg-card border-border">
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))
          ) : filteredLogs.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-12 text-center">
                <Bug className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-medium">Nenhum erro encontrado</p>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  {searchQuery ? "Tente ajustar os filtros" : "Tudo limpo! 🎉"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <AnimatePresence initial={false}>
              {filteredLogs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Collapsible
                    open={expandedId === log.id}
                    onOpenChange={(open) => setExpandedId(open ? log.id : null)}
                  >
                    <Card className="bg-card border-border hover:border-destructive/30 transition-colors">
                      <CollapsibleTrigger asChild>
                        <CardContent className="p-4 cursor-pointer">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-mono truncate text-foreground">
                                {log.error_message}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <Badge variant={getTypeBadgeVariant(log.error_type)} className="text-xs">
                                  {log.error_type || "unknown"}
                                </Badge>
                                {log.app_version && (
                                  <Badge variant="outline" className="text-xs">
                                    v{log.app_version}
                                  </Badge>
                                )}
                                {log.url && (
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Globe className="h-3 w-3" />
                                    {(() => { try { return new URL(log.url).pathname; } catch { return log.url; } })()}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {format(new Date(log.created_at), "dd MMM HH:mm:ss", {
                                locale: ptBR,
                              })}
                            </span>
                          </div>
                        </CardContent>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                          {log.error_stack && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">Stack Trace</p>
                              <pre className="text-xs font-mono bg-muted p-3 rounded-md overflow-x-auto text-destructive/80 max-h-48 overflow-y-auto">
                                {log.error_stack}
                              </pre>
                            </div>
                          )}
                          {log.component_stack && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">Component Stack</p>
                              <pre className="text-xs font-mono bg-muted p-3 rounded-md overflow-x-auto text-primary/80 max-h-32 overflow-y-auto">
                                {log.component_stack}
                              </pre>
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="text-muted-foreground">User ID:</span>{" "}
                              <span className="font-mono">{log.user_id || "anon"}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">URL:</span>{" "}
                              <span className="font-mono">{log.url || "—"}</span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground">User Agent:</span>{" "}
                              <span className="font-mono text-[10px] break-all">
                                {log.user_agent || "—"}
                              </span>
                            </div>
                            {log.metadata && Object.keys(log.metadata).length > 0 && (
                              <div className="col-span-2">
                                <span className="text-muted-foreground">Metadata:</span>
                                <pre className="font-mono text-[10px] bg-muted p-2 rounded mt-1">
                                  {JSON.stringify(log.metadata, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground pb-8">
          Exibindo {filteredLogs.length} de {logs.length} registros
        </p>
      </main>
    </div>
  );
}
