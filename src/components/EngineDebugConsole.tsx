// Atom Engine 4.0 - Engine Debug Console (God Mode)
// Floating overlay for debugging the engine

import { useState, useMemo } from "react";
import { X, Database, FileText, Terminal, Play, Trash2, RefreshCw } from "lucide-react";
import { useAtomItems } from "@/hooks/useAtomItems";
import { useEngineLogger } from "@/hooks/useEngineLogger";
import { parseInput } from "@/lib/parsing-engine";
import { cn } from "@/lib/utils";

interface EngineDebugConsoleProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "state" | "logs" | "input";

export function EngineDebugConsole({ isOpen, onClose }: EngineDebugConsoleProps) {
  const [activeTab, setActiveTab] = useState<TabType>("state");
  const [testInput, setTestInput] = useState("");
  const { items, isLoading, refetch } = useAtomItems();
  const { logs, clearLogs } = useEngineLogger();

  const parsedResult = useMemo(() => {
    if (!testInput.trim()) return null;
    return parseInput(testInput);
  }, [testInput]);

  if (!isOpen) return null;

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "state", label: "State", icon: <Database className="w-4 h-4" /> },
    { id: "logs", label: "Logs", icon: <FileText className="w-4 h-4" /> },
    { id: "input", label: "Input Test", icon: <Terminal className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-[90vw] h-[85vh] max-w-6xl bg-console rounded-lg border border-console-border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-console-border bg-console-header">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <h2 className="text-console-text font-mono text-sm font-semibold">
              ATOM ENGINE 4.0 — DEBUG CONSOLE (GOD MODE)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-console-border rounded transition-colors"
          >
            <X className="w-5 h-5 text-console-muted" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-console-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 font-mono text-sm transition-colors",
                activeTab === tab.id
                  ? "bg-console-active text-console-accent border-b-2 border-console-accent"
                  : "text-console-muted hover:text-console-text hover:bg-console-hover"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "state" && (
            <StateTab items={items} isLoading={isLoading} refetch={refetch} />
          )}
          {activeTab === "logs" && (
            <LogsTab logs={logs} onClear={clearLogs} />
          )}
          {activeTab === "input" && (
            <InputTestTab
              testInput={testInput}
              setTestInput={setTestInput}
              parsedResult={parsedResult}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-console-border bg-console-header">
          <p className="text-console-muted font-mono text-xs">
            Press <kbd className="px-1.5 py-0.5 bg-console-border rounded text-console-text">Ctrl+Shift+E</kbd> to toggle console
          </p>
        </div>
      </div>
    </div>
  );
}

// State Tab Component
function StateTab({ items, isLoading, refetch }: { 
  items: any[]; 
  isLoading: boolean;
  refetch: () => void;
}) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-console-border">
        <span className="text-console-muted font-mono text-xs">
          {items.length} items loaded
        </span>
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-2 py-1 text-xs font-mono text-console-accent hover:bg-console-hover rounded transition-colors disabled:opacity-50"
        >
          <RefreshCw className={cn("w-3 h-3", isLoading && "animate-spin")} />
          Refresh
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="text-console-muted font-mono text-sm">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-console-muted font-mono text-sm">
            No items found. Create some items to see them here.
          </div>
        ) : (
          <pre className="text-console-text font-mono text-xs leading-relaxed whitespace-pre-wrap">
            {JSON.stringify(items, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

// Logs Tab Component
function LogsTab({ logs, onClear }: { 
  logs: any[]; 
  onClear: () => void;
}) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-console-border">
        <span className="text-console-muted font-mono text-xs">
          {logs.length} log entries
        </span>
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 px-2 py-1 text-xs font-mono text-red-400 hover:bg-console-hover rounded transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {logs.length === 0 ? (
          <div className="text-console-muted font-mono text-sm">
            No logs yet. Perform actions to see engine logs.
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map((log, i) => (
              <div key={i} className="font-mono text-xs">
                <span className="text-console-muted">
                  [{new Date(log.timestamp).toLocaleTimeString()}]
                </span>{" "}
                <span className="text-console-accent">[{log.engine}]</span>{" "}
                <span className="text-console-text">{log.action}</span>
                {log.details && (
                  <span className="text-console-muted">
                    {" "}
                    {JSON.stringify(log.details)}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Input Test Tab Component
function InputTestTab({
  testInput,
  setTestInput,
  parsedResult,
}: {
  testInput: string;
  setTestInput: (value: string) => void;
  parsedResult: any;
}) {
  return (
    <div className="h-full grid grid-cols-2 divide-x divide-console-border">
      {/* Input Panel */}
      <div className="flex flex-col">
        <div className="px-4 py-2 border-b border-console-border">
          <span className="text-console-muted font-mono text-xs">
            INPUT — Type a task with tokens
          </span>
        </div>
        <div className="flex-1 p-4">
          <textarea
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="Comprar leite @amanha #mod_casa @where:mercado"
            className="w-full h-full bg-console-input border border-console-border rounded p-3 font-mono text-sm text-console-text placeholder:text-console-muted resize-none focus:outline-none focus:border-console-accent"
          />
        </div>
        <div className="px-4 py-2 border-t border-console-border">
          <div className="text-console-muted font-mono text-xs space-y-1">
            <p>Available tokens:</p>
            <p>• @hoje, @amanha — Set due date</p>
            <p>• @ritual_manha, @ritual_meio_dia, @ritual_noite — Ritual slot</p>
            <p>• @who:name, @where:place — Context tags</p>
            <p>• #tag — Custom tags</p>
            <p>• #mod_module — Set module</p>
          </div>
        </div>
      </div>

      {/* Output Panel */}
      <div className="flex flex-col">
        <div className="px-4 py-2 border-b border-console-border flex items-center gap-2">
          <Play className="w-3 h-3 text-console-accent" />
          <span className="text-console-muted font-mono text-xs">
            OUTPUT — Parsed Result
          </span>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {!parsedResult ? (
            <div className="text-console-muted font-mono text-sm">
              Type something to see the parsed output...
            </div>
          ) : (
            <pre className="text-console-text font-mono text-xs leading-relaxed whitespace-pre-wrap">
              {JSON.stringify(parsedResult, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
