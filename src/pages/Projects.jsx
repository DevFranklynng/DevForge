import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Trash2, Pencil, FolderKanban, ArrowUpRight } from "lucide-react";
import { projectsApi } from "@/services/api";
import { useToast } from "@/components/ui/Toast";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge, ProjectStatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonGrid } from "@/components/ui/Skeleton";
import { ConfirmDialog } from "@/components/ui/Modal";
import { ProjectFormModal } from "@/features/projects/ProjectFormModal";
import { PROJECT_STATUSES, PROJECT_PRIORITIES } from "@/lib/meta";
import { titleCase, formatDate } from "@/utils/format";
import { useDebounce } from "@/hooks/useDebounce";

export default Projects;
export function Projects() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("recent");
  const debouncedQ = useDebounce(q, 250);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const toast = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["projects", { q: debouncedQ, status, sort }],
    queryFn: () => projectsApi.list({ q: debouncedQ, status, sort }),
  });

  const deleteMutation = useMutation({
    mutationFn: projectsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Project deleted");
      setDeleting(null);
    },
    onError: (err) => toast.error(err.message || "Failed to delete project"),
  });

  const projects = data?.projects ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Projects</h1>
          <p className="mt-0.5 text-xs text-ink-muted">
            {data?.total ?? 0} project{data?.total === 1 ? "" : "s"} in your workspace
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="h-4 w-4" aria-hidden />} onClick={() => { setEditing(null); setFormOpen(true); }}>
          New project
        </Button>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden />
          <Input
            className="pl-9"
            placeholder="Search projects…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search projects"
          />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status" className="w-40">
          <option value="all">All statuses</option>
          {PROJECT_STATUSES.map((s) => (
            <option key={s} value={s}>{titleCase(s)}</option>
          ))}
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort projects" className="w-40">
          <option value="recent">Recently active</option>
          <option value="name">Name A–Z</option>
          <option value="progress">Progress</option>
          <option value="priority">Priority</option>
        </Select>
      </div>

      {isError && (
        <Card className="mt-5 p-6 text-center">
          <p className="text-sm text-danger">{error?.message}</p>
          <button onClick={() => refetch()} className="mt-3 rounded-md border border-edge-strong px-3 py-1.5 text-xs text-ink hover:border-accent/60">
            Retry
          </button>
        </Card>
      )}

      {!isError && isLoading && (
        <SkeletonGrid cards={6} className="mt-6" />
      )}

      {!isError && !isLoading && projects.length === 0 && (
        <div className="mt-6">
          <EmptyState
            icon={FolderKanban}
            title="No projects found"
            description={debouncedQ || status !== "all" ? "Try changing your filters." : "Create your first project to start tracking work."}
            action={
              <Button variant="primary" leftIcon={<Plus className="h-4 w-4" aria-hidden />} onClick={() => { setEditing(null); setFormOpen(true); }}>
                New project
              </Button>
            }
          />
        </div>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <Card key={p.id} className="flex flex-col p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link to={`/projects/${p.id}`} className="truncate text-sm font-semibold text-ink hover:text-accent">
                    {p.name}
                  </Link>
                  <PriorityBadge priority={p.priority} />
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-ink-secondary">{p.description || "No description yet."}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <ProjectStatusBadge status={p.status} />
              {p.dueDate && <Badge tone="neutral">{formatDate(p.dueDate)}</Badge>}
            </div>

            {(p.techStack?.length > 0) && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.techStack.slice(0, 4).map((t) => (
                  <span key={t} className="rounded border border-edge bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-ink-secondary">
                    {t}
                  </span>
                ))}
                {p.techStack.length > 4 && <span className="text-[10px] text-ink-muted">+{p.techStack.length - 4}</span>}
              </div>
            )}

            <div className="mt-3 flex items-center justify-between text-[11px] text-ink-muted">
              <span className="tabular">{p.openTasks} open / {p.totalTasks} tasks</span>
              <span className="tabular">{p.deploymentCount} deploys · {p.apiCount} endpoints</span>
            </div>

            <div className="mt-2">
              <ProgressBar value={p.progress} />
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-edge pt-3">
              <Link
                to={`/projects/${p.id}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-strong"
              >
                Open <ArrowUpRight className="h-3 w-3" aria-hidden />
              </Link>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setEditing(p); setFormOpen(true); }}
                  aria-label={`Edit ${p.name}`}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink btn-focus"
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden />
                </button>
                <button
                  onClick={() => setDeleting(p)}
                  aria-label={`Delete ${p.name}`}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-danger/10 hover:text-danger btn-focus"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <ProjectFormModal open={formOpen} onClose={() => setFormOpen(false)} project={editing} />

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleteMutation.mutate(deleting.id)}
        confirmLoading={deleteMutation.isPending}
        title={`Delete "${deleting?.name}"?`}
        message="This permanently removes the project, its tasks, deployments, repositories, documented endpoints, and activity."
      />
    </div>
  );
}