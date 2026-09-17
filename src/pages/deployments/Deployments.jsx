import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Rocket, XCircle, Filter } from "lucide-react";
import { deploymentsApi, projectsApi } from "@/services/api";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { DeploymentStatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { DeploymentFormModal } from "@/features/deployments/DeploymentFormModal";
import { DEPLOYMENT_ENVIRONMENTS, DEPLOYMENT_STATUSES } from "@/lib/meta";
import { titleCase, formatDateTime, durationLabel, shortHash } from "@/utils/format";

export default Deployments;
export function Deployments() {
  const [projectFilter, setProjectFilter] = useState("all");
  const [envFilter, setEnvFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);

  const toast = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["deployments", { projectId: projectFilter, environment: envFilter, status: statusFilter }],
    queryFn: () => deploymentsApi.list({ projectId: projectFilter, environment: envFilter, status: statusFilter }),
    refetchInterval: (query) => {
      const deploys = query.state.data?.deployments || [];
      return deploys.some((d) => d.status === "building") ? 2500 : false;
    },
  });

  const projectsQuery = useQuery({
    queryKey: ["projects", {}],
    queryFn: () => projectsApi.list(),
  });

  const cancelMutation = useMutation({
    mutationFn: deploymentsApi.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deployments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Deployment cancelled");
    },
    onError: (err) => toast.error(err.message || "Failed to cancel deployment"),
  });

  const deployments = data?.deployments ?? [];
  const projects = projectsQuery.data?.projects ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Deployments</h1>
          <p className="mt-0.5 text-xs text-ink-muted">Simulated build lifecycle · polling follows live builds</p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="h-4 w-4" aria-hidden />} onClick={() => setFormOpen(true)}>
          New deployment
        </Button>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border border-edge bg-surface-2/50 px-3 py-2.5 rounded-lg">
        <Filter className="h-3.5 w-3.5 text-ink-muted" aria-hidden />
        <Select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} aria-label="Filter by project" className="w-48 h-8 text-xs">
          <option value="all">All projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Select>
        <Select value={envFilter} onChange={(e) => setEnvFilter(e.target.value)} aria-label="Filter by environment" className="w-40 h-8 text-xs">
          <option value="all">All environments</option>
          {DEPLOYMENT_ENVIRONMENTS.map((e) => (
            <option key={e} value={e}>{titleCase(e)}</option>
          ))}
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status" className="w-40 h-8 text-xs">
          <option value="all">All statuses</option>
          {DEPLOYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>{titleCase(s)}</option>
          ))}
        </Select>
      </div>

      {isError && (
        <Card className="mt-5 p-6 text-center">
          <p className="text-sm text-danger">{error?.message}</p>
        </Card>
      )}

      {isLoading && <p className="mt-6 text-center text-xs text-ink-muted">Loading deployments…</p>}

      {!isError && !isLoading && deployments.length === 0 && (
        <div className="mt-6">
          <EmptyState
            icon={Rocket}
            title="No deployments yet"
            description="Kick off a simulated deployment to see the full build lifecycle."
            action={
              <Button variant="primary" leftIcon={<Plus className="h-4 w-4" aria-hidden />} onClick={() => setFormOpen(true)}>
                Deploy
              </Button>
            }
          />
        </div>
      )}

      {deployments.length > 0 && (
        <ul className="mt-5 divide-y divide-edge/60 rounded-lg border border-edge bg-surface">
          {deployments.map((d) => (
            <li key={d.id} className="flex flex-wrap items-center gap-3 px-4 py-3.5">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link to={`/projects/${d.projectId}`} className="text-sm font-medium text-ink hover:text-accent">
                    {d.project?.name}
                  </Link>
                  <span className="rounded border border-edge bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] uppercase text-ink-secondary">{d.environment}</span>
                  <span className="rounded border border-edge bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-ink-secondary">{d.branch}</span>
                  {d.commit && <span className="font-mono text-[10px] text-ink-muted">{shortHash(d.commit)}</span>}
                </div>
                {d.commitMessage && <p className="mt-1 truncate text-xs text-ink-muted">“{d.commitMessage}”</p>}
                <p className="mt-0.5 text-[11px] text-ink-muted">
                  {formatDateTime(d.createdAt)} · {durationLabel(d.durationMs)} · {d.provider || "simulated"}
                </p>
              </div>

              {d.status === "building" && (
                <button
                  onClick={() => cancelMutation.mutate(d.id)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-edge bg-surface-2 px-2.5 py-1.5 text-[11px] text-ink-secondary transition-colors hover:border-danger/40 hover:text-danger btn-focus"
                >
                  <XCircle className="h-3.5 w-3.5" aria-hidden /> Cancel build
                </button>
              )}

              {d.url && (
                <a href={d.url} target="_blank" rel="noreferrer" className="font-mono text-[11px] text-accent hover:text-accent-strong">
                  {d.url.replace(/^https?:\/\//, "")}
                </a>
              )}

              <DeploymentStatusBadge status={d.status} />
            </li>
          ))}
        </ul>
      )}

      <DeploymentFormModal open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}