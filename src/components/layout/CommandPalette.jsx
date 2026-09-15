import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, CornerDownLeft, FolderKanban, ListChecks, Braces, Activity } from "lucide-react";
import { searchApi } from "@/services/api";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/cn";
import { Kbd } from "@/components/ui/Kbd";
import { useHotkey } from "@/hooks/useHotkey";

export function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const debounced = useDebounce(query, 200);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useHotkey("escape", onClose, { enabled: open });

  const search = useQuery({
    queryKey: ["search", debounced],
    queryFn: () => searchApi.search(debounced),
    enabled: open && debounced.trim().length > 0,
  });

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const results = search.data;
  const groups = [];
  if (results) {
    if (results.projects.length)
      groups.push({ id: "projects", label: "Projects", icon: FolderKanban, items: results.projects, render: (i) => i.name });
    if (results.tasks.length)
      groups.push({ id: "tasks", label: "Tasks", icon: ListChecks, items: results.tasks, render: (i) => `${i.title}${i.projectName ? ` · ${i.projectName}` : ""}` });
    if (results.endpoints.length)
      groups.push({ id: "endpoints", label: "API endpoints", icon: Braces, items: results.endpoints, render: (i) => `${i.method} ${i.path}` });
    if (results.activities.length)
      groups.push({ id: "activities", label: "Activity", icon: Activity, items: results.activities, render: (i) => i.description });
  }

  const flattened = groups.flatMap((g) => g.items.map((item) => ({ group: g, item })));

  useEffect(() => {
    setActiveIndex(0);
  }, [debounced, open]);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, Math.max(0, flattened.length - 1)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        const target = flattened[activeIndex];
        if (target) {
          onClose();
          navigate(target.item.href);
        }
      }
    },
    [flattened, activeIndex, navigate, onClose],
  );

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Global search" className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16">
      <div className="fixed inset-0 animate-fade-in bg-black/60" onClick={onClose} aria-hidden />
      <div
        className="relative z-10 w-full max-w-xl animate-scale-in overflow-hidden rounded-lg border border-edge bg-surface-2 shadow-lg"
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-edge px-4">
          <Search className="h-4 w-4 text-ink-muted" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, tasks, endpoints, activity…"
            aria-label="Search"
            className="h-12 flex-1 bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
          />
          <Kbd>esc</Kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto py-2">
          {debounced.trim().length === 0 && (
            <p className="px-4 py-8 text-center text-xs text-ink-muted">
              Type to search across your workspace.
            </p>
          )}
          {debounced.trim().length > 0 && search.isLoading && (
            <p className="px-4 py-8 text-center text-xs text-ink-muted">Searching…</p>
          )}
          {debounced.trim().length > 0 && search.isError && (
            <p className="px-4 py-8 text-center text-xs text-danger">Search failed.</p>
          )}
          {results && flattened.length === 0 && (
            <p className="px-4 py-8 text-center text-xs text-ink-muted">
              No results for “{debounced}”.
            </p>
          )}

          {groups.map((group, gi) => {
            let groupStart = 0;
            for (let k = 0; k < gi; k++) groupStart += groups[k].items.length;

            return (
              <div key={group.id}>
                <div className="flex items-center gap-1.5 px-4 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                  <group.icon className="h-3 w-3" aria-hidden />
                  {group.label}
                  <span className="tabular text-ink-muted/60">{group.items.length}</span>
                </div>
                {group.items.map((item, ii) => {
                  const globalIndex = groupStart + ii;
                  const active = globalIndex === activeIndex;
                  return (
                    <button
                      key={item.id}
                      onMouseEnter={() => setActiveIndex(globalIndex)}
                      onClick={() => {
                        onClose();
                        navigate(item.href);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors btn-focus",
                        active ? "bg-surface-3 text-ink" : "text-ink-secondary",
                      )}
                    >
                      <span className="min-w-0 flex-1 truncate">{group.render(item)}</span>
                      {active && <CornerDownLeft className="h-3.5 w-3.5 text-ink-muted" aria-hidden />}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}