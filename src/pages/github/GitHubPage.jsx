import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Github, GitBranch, Star, GitFork, CircleDot, Trash2, Pencil } from "lucide-react";
import { repositoriesApi, projectsApi } from "@/services/api";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/Modal";
import { RepositoryFormModal } from "@/features/repositories/RepositoryFormModal";
import { fromNow } from "@/utils/format";

export function GitHubPage() {
  const [projectFilter, setProjectFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const toast = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["repositories", { projectId: projectFilter }],
    queryFn: () => repositoriesApi.list({ projectId: projectFilter }),
  });

  const projectsQuery = useQuery({
    queryKey: ["projects", {}],
    queryFn: () => projectsApi.list(),
  });

  const deleteMutation = useMutation({
    mutationFn: repositoriesApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repositories"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Repository removed");
      setDeleting(null);
    },
    onError: (err) => toast.error(err.message || "Failed to remove repository"),
  });

  const repos = data?.repositories ?? [];
  const projects = projectsQuery.data?.projects ?? [];
  const synced = repos.filter((r) => r.source === "github").length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <Github className="h-5 w-5" aria-hidden /> Repositories
          </h1>
          <p className="mt-0.5 text-xs text-ink-muted">
            {repos.length} tracked · {synced} synced from GitHub
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="h-4 w-4" aria-hidden />} onClick={() => { setEditing(null); setFormOpen(true); }}>
          Connect repository
        </Button>
      </div>

      <div className="mt-5">
        <Select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} aria-label="Filter by project" className="w-52">
          <option value="all">All projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Select>
      </div>

      {isError && (
        <Card className="mt-5 p-6 text-center">
          <p className="text-sm text-danger">{error?.message}</p>
        </Card>
      )}

      {isLoading && <p className="mt-6 text-center text-xs text-ink-muted">Loading repositories…</p>}

      {!isError && !isLoading && repos.length === 0 && (
        <div className="mt-6">
          <EmptyState
            icon={Github}
            title="No repositories yet"
            description="Connect a repository to keep its state visible next to the work it powers."
            action={
              <Button variant="primary" leftIcon={<Plus className="h-4 w-4" aria-hidden />} onClick={() => { setEditing(null); setFormOpen(true); }}>
                Connect repository
              </Button>
            }
          />
        </div>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {repos.map((r) => (
          <Card key={r.id} className="flex flex-col p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">
                  {r.owner && <span className="text-ink-muted">{r.owner}/</span>}{r.name}
                </p>
                <p className="mt-0.5 text-[10px] text-ink-muted">
                  {r.source === "github" ? "Synced from GitHub" : "Manually tracked"}
                </p>
              </div>
              <Badge tone={r.visibility === "public" ? "accent" : "neutral"}>{r.visibility}</Badge>
            </div>

            {r.description && <p className="mt-2 line-clamp-2 text-xs text-ink-secondary">{r.description}</p>}

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-muted">
              <span className="inline-flex items-center gap-1"><GitBranch className="h-3.5 w-3.5" aria-hidden />{r.branch}</span>
              <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5" aria-hidden />{r.stars}</span>
              <span className="inline-flex items-center gap-1"><GitFork className="h-3.5 w-3.5" aria-hidden />{r.forks}</span>
              <span className="inline-flex items-center gap-1"><CircleDot className="h-3.5 w-3.5" aria-hidden />{r.openIssues}</span>
            </div>

            {r.project && (
              <Link to={`/projects/${r.project.id}`} className="mt-3 w-fit text-[11px] font-medium text-accent hover:text-accent-strong">
                {r.project.name}
              </Link>
            )}

            <div className="mt-3 flex items-center justify-between border-t border-edge pt-3">
              <p className="text-[11px] text-ink-muted">Last commit {r.lastCommit ? fromNow(r.lastCommit) : "—"}</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setEditing(r); setFormOpen(true); }}
                  aria-label={`Edit ${r.name}`}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink btn-focus"
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden />
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
          </Card>
        ))}
      </div>

      <RepositoryFormModal open={formOpen} onClose={() => setFormOpen(false)} repository={editing} />
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