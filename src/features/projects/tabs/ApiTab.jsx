import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Lock, ChevronDown, Trash2, Pencil, Copy } from "lucide-react";
import { apisApi } from "@/services/api";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { MethodBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/Modal";
import { EndpointFormModal } from "@/features/apis/EndpointFormModal";
import { cn } from "@/lib/cn";

function CodeBlock({ label, value }) {
  if (!value) return null;
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
    <div className="mt-2">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium text-ink-secondary">{label}</p>
        <button onClick={copy} className="inline-flex items-center gap-1 text-[10px] text-ink-muted hover:text-ink btn-focus" aria-label={`Copy ${label}`}>
          <Copy className="h-3 w-3" aria-hidden /> {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="mt-1 overflow-x-auto rounded-md border border-edge bg-surface-3 p-3 font-mono text-[11px] leading-relaxed text-ink">
        {value}
      </pre>
    </div>
  );
}

export function ApiTab({ project }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const invalidateProject = () => queryClient.invalidateQueries({ queryKey: ["project", project.id] });

  const deleteMutation = useMutation({
    mutationFn: apisApi.remove,
    onSuccess: () => {
      invalidateProject();
      toast.success("Endpoint removed");
      setDeleting(null);
    },
    onError: (err) => toast.error(err.message || "Failed to remove endpoint"),
  });

  const endpoints = project.apiEndpoints || [];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-ink-muted">{endpoints.length} documented endpoint{endpoints.length === 1 ? "" : "s"}</p>
        <Button size="sm" variant="primary" leftIcon={<Plus className="h-4 w-4" aria-hidden />} onClick={() => { setEditing(null); setFormOpen(true); }}>
          Document endpoint
        </Button>
      </div>

      {endpoints.length === 0 && (
        <EmptyState title="No endpoints documented" description="Turn your API into living, searchable documentation." />
      )}

      <div className="overflow-hidden rounded-lg border border-edge bg-surface">
        {endpoints.map((e) => {
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

                  <CodeBlock label="Request body" value={e.requestBody} />
                  <CodeBlock label="Response example" value={e.responseExample} />

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

      <EndpointFormModal open={formOpen} onClose={() => setFormOpen(false)} endpoint={editing} defaultProjectId={project.id} />
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