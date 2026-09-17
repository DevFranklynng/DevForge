import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Braces, Lock, ChevronDown, Trash2, Pencil, Copy } from "lucide-react";
import { apisApi, projectsApi } from "@/services/api";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { MethodBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/Modal";
import { EndpointFormModal } from "@/features/apis/EndpointFormModal";
import { API_METHODS } from "@/lib/meta";
import { cn } from "@/lib/cn";

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };
  return (
    <button onClick={copy} className="inline-flex items-center gap-1 text-[10px] text-ink-muted hover:text-ink btn-focus" aria-label="Copy to clipboard">
      <Copy className="h-3 w-3" aria-hidden /> {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default Apis;
export function Apis() {
  const [methodFilter, setMethodFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const toast = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["apis", { method: methodFilter }],
    queryFn: () => apisApi.list({ method: methodFilter }),
  });

  const projectsQuery = useQuery({
    queryKey: ["projects", {}],
    queryFn: () => projectsApi.list(),
  });

  const deleteMutation = useMutation({
    mutationFn: apisApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apis"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Endpoint removed");
      setDeleting(null);
    },
    onError: (err) => toast.error(err.message || "Failed to remove endpoint"),
  });

  const endpoints = data?.endpoints ?? [];

  const grouped = useMemo(() => {
    const map = new Map();
    endpoints.forEach((e) => {
      const key = e.project?.id || "none";
      if (!map.has(key)) map.set(key, { project: e.project, items: [] });
      map.get(key).items.push(e);
    });
    return Array.from(map.values());
  }, [endpoints]);

  const projects = projectsQuery.data?.projects ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <Braces className="h-5 w-5" aria-hidden /> API documentation
          </h1>
          <p className="mt-0.5 text-xs text-ink-muted">{endpoints.length} documented endpoint{endpoints.length === 1 ? "" : "s"}</p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="h-4 w-4" aria-hidden />} onClick={() => { setEditing(null); setFormOpen(true); }}>
          Document endpoint
        </Button>
      </div>

      <div className="mt-5">
        <Select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)} aria-label="Filter by method" className="w-44">
          <option value="all">All methods</option>
          {API_METHODS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </Select>
      </div>

      {isError && (
        <Card className="mt-5 p-6 text-center">
          <p className="text-sm text-danger">{error?.message}</p>
        </Card>
      )}

      {isLoading && <p className="mt-6 text-center text-xs text-ink-muted">Loading endpoints…</p>}

      {!isError && !isLoading && endpoints.length === 0 && (
        <div className="mt-6">
          <EmptyState
            icon={Braces}
            title="No endpoints documented"
            description="Turn your API surface into living documentation."
            action={
              <Button variant="primary" leftIcon={<Plus className="h-4 w-4" aria-hidden />} onClick={() => { setEditing(null); setFormOpen(true); }}>
                Document endpoint
              </Button>
            }
          />
        </div>
      )}

      <div className="mt-5 space-y-6">
        {grouped.map(({ project, items }) => (
          <section key={project?.id || "none"}>
            <div className="mb-2 flex items-center justify-between">
              <Link to={project ? `/projects/${project.id}?tab=api` : "#"} className="text-sm font-semibold text-ink hover:text-accent">
                {project?.name || "Unattached"}
              </Link>
              <span className="text-[11px] text-ink-muted">{items.length} endpoint{items.length === 1 ? "" : "s"}</span>
            </div>

            <div className="overflow-hidden rounded-lg border border-edge bg-surface">
              {items.map((e) => {
                const isOpen = expanded === e.id;
                return (
                  <div key={e.id} className="border-b border-edge/60 last:border-b-0">
                    <div
                      className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-2"
                      onClick={() => setExpanded(isOpen ? null : e.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(ev) => ev.key === "Enter" && setExpanded(isOpen ? null : e.id)}
                    >
                      <MethodBadge method={e.method} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-mono text-sm text-ink">{e.path}</p>
                        {e.name && <p className="truncate text-[11px] text-ink-muted">{e.name}</p>}
                      </div>
                      {e.authRequired && <Lock className="h-3.5 w-3.5 text-ink-muted" aria-label="Auth required" />}
                      <span className="rounded border border-edge bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-ink-secondary">{e.statusCode}</span>
                      <ChevronDown className={cn("h-4 w-4 text-ink-muted transition-transform", isOpen && "rotate-180")} aria-hidden />
                    </div>

                    {isOpen && (
                      <div className="space-y-3 border-t border-edge/60 bg-surface-2/50 px-4 py-4">
                        {e.description && <p className="text-xs leading-relaxed text-ink-secondary">{e.description}</p>}
                        {e.parameters?.length > 0 && (
                          <div>
                            <p className="text-[11px] font-medium text-ink-secondary">Parameters</p>
                            <div className="mt-1 flex flex-wrap gap-1.5">
                              {e.parameters.map((p, i) => (
                                <span key={i} className="rounded border border-edge bg-surface-2 px-2 py-1 font-mono text-[11px] text-ink-secondary">
                                  <span className="text-accent">{p.name}</span>
                                  {p.type ? <span className="text-ink-muted">:{p.type}</span> : null}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {e.requestBody && (
                          <div>
                            <div className="flex items-center justify-between">
                              <p className="text-[11px] font-medium text-ink-secondary">Request body</p>
                              <CopyButton value={e.requestBody} />
                            </div>
                            <pre className="mt-1 overflow-x-auto rounded-md border border-edge bg-surface-3 p-3 font-mono text-[11px] leading-relaxed text-ink">{e.requestBody}</pre>
                          </div>
                        )}

                        {e.responseExample && (
                          <div>
                            <div className="flex items-center justify-between">
                              <p className="text-[11px] font-medium text-ink-secondary">Response example</p>
                              <CopyButton value={e.responseExample} />
                            </div>
                            <pre className="mt-1 overflow-x-auto rounded-md border border-edge bg-surface-3 p-3 font-mono text-[11px] leading-relaxed text-ink">{e.responseExample}</pre>
                          </div>
                        )}

                        <div className="mt-3 flex items-center gap-2 border-t border-edge pt-3">
                          <button
                            onClick={() => { setEditing(e); setFormOpen(true); }}
                            className="inline-flex items-center gap-1.5 rounded border border-edge bg-surface-2 px-2.5 py-1.5 text-[11px] text-ink-secondary transition-colors hover:border-edge-strong hover:text-ink btn-focus"
                          >
                            <Pencil className="h-3 w-3" aria-hidden /> Edit
                          </button>
                          <button
                            onClick={() => setDeleting(e)}
                            className="inline-flex items-center gap-1.5 rounded border border-edge bg-surface-2 px-2.5 py-1.5 text-[11px] text-ink-secondary transition-colors hover:border-danger/40 hover:text-danger btn-focus"
                          >
                            <Trash2 className="h-3 w-3" aria-hidden /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <EndpointFormModal open={formOpen} onClose={() => setFormOpen(false)} endpoint={editing} />
      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleteMutation.mutate(deleting.id)}
        confirmLoading={deleteMutation.isPending}
        title="Remove this endpoint?"
        message={`${deleting?.method} ${deleting?.path} will be removed from your API docs.`}
      />
    </div>
  );
}