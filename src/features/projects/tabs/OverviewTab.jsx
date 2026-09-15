import { Link } from "react-router-dom";
import { Scale, CalendarClock, ExternalLink, Github, Rocket, ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PriorityBadge, DeploymentStatusBadge, MethodBadge } from "@/components/ui/Badge";
import { titleCase, formatDate, fromNow, durationLabel, shortHash } from "@/utils/format";

export function OverviewTab({ project }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader title="What it is" />
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-ink-secondary">
            {project.description || "No description added yet. Edit the project to add one."}
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-md border border-edge bg-surface-2 p-3">
              <p className="text-[11px] text-ink-muted">Status</p>
              <p className="mt-1 text-sm font-medium text-ink">{titleCase(project.status)}</p>
            </div>
            <div className="rounded-md border border-edge bg-surface-2 p-3">
              <p className="text-[11px] text-ink-muted">Priority</p>
              <p className="mt-1"><PriorityBadge priority={project.priority} /></p>
            </div>
            <div className="rounded-md border border-edge bg-surface-2 p-3">
              <p className="text-[11px] text-ink-muted">Overdue by</p>
              <p className="mt-1 text-sm font-medium text-ink">{project.dueDate ? formatDate(project.dueDate) : "No date"}</p>
            </div>
            <div className="rounded-md border border-edge bg-surface-2 p-3">
              <p className="text-[11px] text-ink-muted">Progress</p>
              <div className="mt-1.5"><ProgressBar value={project.progress} /></div>
            </div>
          </div>

          {project.techStack?.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium text-ink-secondary">Tech stack</p>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((t) => (
                  <span key={t} className="rounded border border-edge bg-surface-2 px-2 py-1 font-mono text-[11px] text-ink-secondary">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-muted">
            <span className="inline-flex items-center gap-1.5"><Scale className="h-3.5 w-3.5" aria-hidden /> Created {fromNow(project.createdAt)}</span>
            <span className="inline-flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5" aria-hidden /> Last activity {fromNow(project.lastActivityAt)}</span>
            {(project.repositoryUrl || project.productionUrl) && (<span className="text-ink-muted">|</span>)}
            {project.repositoryUrl && (
              <a href={project.repositoryUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-accent">
                <Github className="h-3.5 w-3.5" aria-hidden /> Repository <ExternalLink className="h-3 w-3" aria-hidden />
              </a>
            )}
            {project.productionUrl && (
              <a href={project.productionUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-accent">
                <Rocket className="h-3.5 w-3.5" aria-hidden /> Live app <ExternalLink className="h-3 w-3" aria-hidden />
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader title="Task breakdown" subtitle={`${project.openTasks} open of ${project.tasks?.length || 0} tasks`} />
          <CardContent>
            {(() => {
              const tasks = project.tasks || [];
              const counts = tasks.reduce((acc, t) => {
                acc[t.status] = (acc[t.status] || 0) + 1;
                return acc;
              }, {});
              return (
                <div className="flex flex-col gap-2.5">
                  {(["todo", "in_progress", "done"]).map((s) => (
                    <div key={s} className="flex items-center gap-2 text-xs">
                      <span className="w-24 text-ink-secondary">{titleCase(s)}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-3">
                        <div
                          className={s === "done" ? "h-full bg-success" : s === "in_progress" ? "h-full bg-accent" : "h-full bg-ink-muted/50"}
                          style={{ width: `${tasks.length ? Math.round((counts[s] || 0) / tasks.length * 100) : 0}%` }}
                        />
                      </div>
                      <span className="w-6 text-right tabular text-ink-muted">{counts[s] || 0}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Recent deployments" />
          <CardContent className="p-2.5">
            <ul className="divide-y divide-edge/60">
              {(project.deployments || []).slice(0, 4).map((d) => (
                <li key={d.id} className="flex items-center gap-2 px-2 py-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs text-ink-secondary">{d.branch} · {shortHash(d.commit)}</p>
                    <p className="text-[10px] text-ink-muted">{durationLabel(d.durationMs)} · {d.environment}</p>
                  </div>
                  <DeploymentStatusBadge status={d.status} />
                </li>
              ))}
              {(project.deployments || []).length === 0 && (
                <p className="px-2 py-4 text-center text-xs text-ink-muted">No deployments yet.</p>
              )}
            </ul>
            {(project.deployments || []).length > 0 && (
              <Link to={`/projects/${project.id}?tab=deployments`} className="mt-2 flex items-center justify-center gap-1 border-t border-edge pt-2 text-[11px] font-medium text-accent hover:text-accent-strong">
                View all <ArrowUpRight className="h-3 w-3" aria-hidden />
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}