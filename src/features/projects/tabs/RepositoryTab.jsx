import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Github, Trash2, GitBranch, Star, GitFork, CircleDot } from "lucide-react";
import { repositoriesApi } from "@/services/api";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/Modal";
import { RepositoryFormModal } from "@/features/repositories/RepositoryFormModal";
import { fromNow } from "@/utils/format";

export function RepositoryTab({ project }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const invalidateProject = () => queryClient.invalidateQueries({ queryKey: ["project", project.id] });

  const deleteMutation = useMutation({
    mutationFn: repositoriesApi.remove,
    onSuccess: () => {
      invalidateProject();
      toast.success("Repository removed");
      setDeleting(null);
    },
    onError: (err) => toast.error(err.message || "Failed to remove repository"),
  });

  const repos = project.repositories || [];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-ink-muted">{repos.length} connected repository{repos.length === 1 ? "" : "ies"}</p>
        <Button size="sm" variant="primary" leftIcon={<Plus className="h-4 w-4" aria-hidden />} onClick={() => { setEditing(null); setFormOpen(true); }}>
          Connect
        </Button>
      </div>

      {repos.length === 0 && (
        <EmptyState icon={Github} title="No repositories connected" description="Track GitHub repositories next to the work they power." />
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {repos.map((r) => (
          <div key={r.id} className="rounded-lg border border-edge bg-surface p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">
                  {r.owner && <span className="text-ink-muted">{r.owner}/</span>}{r.name}
                </p>
                {r.description && <p className="mt-1 line-clamp-2 text-xs text-ink-secondary">{r.description}</p>}
              </div>
              <Badge tone={r.visibility === "public" ? "accent" : "neutral"}>{r.visibility}</Badge>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-ink-muted">
              <span className="inline-flex items-center gap-1"><GitBranch className="h-3.5 w-3.5" aria-hidden />{r.branch}</span>
              <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5" aria-hidden />{r.stars}</span>
              <span className="inline-flex items-center gap-1"><GitFork className="h-3.5 w-3.5" aria-hidden />{r.forks}</span>
              <span className="inline-flex items-center gap-1"><CircleDot className="h-3.5 w-3.5" aria-hidden />{r.openIssues} issues</span>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-edge pt-3">
              <p className="text-[11px] text-ink-muted">
                {r.source === "github" ? "Synced from GitHub" : "Manual entry"} · last commit {r.lastCommit ? fromNow(r.lastCommit) : "—"}
              </p>
              <div className="flex items-center gap-1">
                {r.url && (
                  <a href={r.url} target="_blank" rel="noreferrer" className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink" aria-label="Open repository">
                    <Github className="h-4 w-4" aria-hidden />
                  </a>
                )}
                <button
                  onClick={() => { setEditing(r); setFormOpen(true); }}
                  aria-label={`Edit ${r.name}`}
                  className="rounded-md px-2 py-1 text-[11px] font-medium text-ink-secondary transition-colors hover:bg-surface-2 hover:text-ink btn-focus"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleting(r)}
                  aria-label={`Remove ${r.name}`}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-danger/10 hover:text-danger btn-focus"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <RepositoryFormModal open={formOpen} onClose={() => setFormOpen(false)} repository={editing} defaultProjectId={project.id} />
      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleteMutation.mutate(deleting.id)}
        confirmLoading={deleteMutation.isPending}
        title="Remove this repository?"
        message={`${deleting?.owner ? `${deleting.owner}/` : ""}${deleting?.name} will be disconnected from this workspace.`}
      />
    </div>
  );
}