import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Rocket, XCircle } from "lucide-react";
import { deploymentsApi } from "@/services/api";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { DeploymentStatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { DeploymentFormModal } from "@/features/deployments/DeploymentFormModal";
import { formatDateTime, fromNow, durationLabel, shortHash } from "@/utils/format";

export function DeploymentsTab({ project }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["project", project.id] });
    queryClient.invalidateQueries({ queryKey: ["deployments"] });
  };

  const cancelMutation = useMutation({
    mutationFn: deploymentsApi.cancel,
    onSuccess: invalidate,
    onError: (err) => toast.error(err.message || "Failed to cancel deployment"),
  });

  const deploys = project.deployments || [];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-ink-muted">{deploys.length} deployment{deploys.length === 1 ? "" : "s"} · newest first</p>
        <Button size="sm" variant="primary" leftIcon={<Plus className="h-4 w-4" aria-hidden />} onClick={() => setFormOpen(true)}>
          Deploy
        </Button>
      </div>

      {deploys.length === 0 && (
        <EmptyState icon={Rocket} title="No deployments yet" description="Simulate a full build lifecycle right here." />
      )}

      <ul className="divide-y divide-edge/60 rounded-lg border border-edge bg-surface">
        {deploys.map((d) => (
          <li key={d.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-ink">{d.environment}</span>
                <span className="rounded border border-edge bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-ink-secondary">{d.branch}</span>
                {d.commit && <span className="font-mono text-[10px] text-ink-muted">{shortHash(d.commit)}</span>}
                {d.commitMessage && <span className="truncate text-xs text-ink-muted">“{d.commitMessage}”</span>}
              </div>
              <p className="mt-1 text-[11px] text-ink-muted">
                {formatDateTime(d.createdAt)} · {durationLabel(d.durationMs)} · {fromNow(d.createdAt)}
              </p>
            </div>

            {(d.provider || d.url) && (
              <p className="hidden max-w-xs truncate font-mono text-[10px] text-ink-muted sm:block">
                {d.provider}·{d.url || "no url"}
              </p>
            )}

            {d.status === "building" && (
              <button
                onClick={() => cancelMutation.mutate(d.id)}
                className="inline-flex items-center gap-1 rounded border border-edge bg-surface-2 px-2 py-1 text-[11px] text-ink-secondary transition-colors hover:border-danger/40 hover:text-danger btn-focus"
              >
                <XCircle className="h-3.5 w-3.5" aria-hidden /> Cancel
              </button>
            )}
            <DeploymentStatusBadge status={d.status} />
          </li>
        ))}
      </ul>

      <DeploymentFormModal open={formOpen} onClose={() => setFormOpen(false)} defaultProjectId={project.id} />
    </div>
  );
}