import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FolderKanban,
  ListChecks,
  Rocket,
  CheckCircle2,
  Activity as ActivityIcon,
  ArrowRight,
  Scale,
} from "lucide-react";
import { dashboardApi } from "@/services/api";
import { useAuth } from "@/features/auth/auth-context";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { ProjectStatusBadge, PriorityBadge, DeploymentStatusBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonGrid, SkeletonRow } from "@/components/ui/Skeleton";
import { greetingForHour, fromNow, formatDate, dayLabel, durationLabel, shortHash, todayString } from "@/utils/format";

function ProjectMiniCard({ project }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="card card-hover block p-4 btn-focus focus-visible:outline-2"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 truncate text-sm font-semibold text-ink">{project.name}</p>
        <ProjectStatusBadge status={project.status} />
      </div>
      <p className="mt-1 line-clamp-2 text-xs text-ink-secondary">{project.description || "No description yet."}</p>
      <div className="mt-3 flex items-center gap-2 text-[11px] text-ink-muted">
        <span className="tabular">{project.openTasks} open · {project.totalTasks} tasks</span>
        {project.techStack?.length > 0 && <span className="truncate font-mono">{project.techStack.join(" · ")}</span>}
      </div>
      <div className="mt-3">
        <ProgressBar value={project.progress} />
      </div>
      <p className="mt-2 text-[10px] text-ink-muted">Updated {fromNow(project.lastActivityAt)}</p>
    </Link>
  );
}

export function Dashboard() {
  const { user } = useAuth();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardApi.get,
  });

  const overview = data?.overview;
  const pulse = data?.pulse;
  const loading = isLoading;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs text-ink-muted">{todayString()}</p>
          <h1 className="mt-0.5 text-xl font-semibold tracking-tight">
            {greetingForHour()}, {user?.name?.split(" ")[0] || "there"}
          </h1>
        </div>
        <Link
          to="/projects"
          className="inline-flex h-9 items-center gap-2 rounded-md bg-accent-strong px-4 text-sm font-medium text-accent-contrast transition-colors hover:bg-accent/90"
        >
          New workspace views
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      {isError ? (
        <div className="mt-6">
          <Card className="p-6 text-center">
            <p className="text-sm text-danger">Could not load the dashboard.</p>
            <p className="mt-1 text-xs text-ink-secondary">{error?.message}</p>
            <button onClick={() => refetch()} className="mt-4 rounded-md border border-edge-strong px-3 py-1.5 text-xs text-ink hover:border-accent/60">
              Retry
            </button>
          </Card>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Projects" value={overview?.totalProjects ?? "—"} icon={FolderKanban} loading={loading} />
            <StatCard label="Active projects" value={overview?.activeProjects ?? "—"} icon={Scale} accent="info" loading={loading} />
            <StatCard label="Open tasks" value={overview?.openTasks ?? "—"} icon={ListChecks} accent="warning" loading={loading} />
            <StatCard label="Deploy success" value={`${pulse?.deploySuccessRate ?? "—"}%`} icon={Rocket} accent="success" loading={loading} />
          </div>

          {pulse && (
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 rounded-lg border border-edge bg-surface-2/60 px-4 py-3 text-xs text-ink-secondary">
              <span><strong className="tabular text-ink">{pulse.completedTasks30d}</strong> tasks completed · 30d</span>
              <span><strong className="tabular text-ink">{pulse.totalDeployments}</strong> total deployments</span>
              <span><strong className="tabular text-ink">{pulse.projectsInDevelopment}</strong> projects in flight</span>
            </div>
          )}

          <section className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Active projects</h2>
              <Link to="/projects" className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-strong">
                View all <ArrowRight className="h-3 w-3" aria-hidden />
              </Link>
            </div>
            {loading && <SkeletonGrid cards={3} className="mb-3" />}
            {!loading && data?.activeProjects?.length === 0 && (
              <EmptyState title="No projects yet" description="Create your first project to get started." />
            )}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data?.activeProjects?.map((p) => <ProjectMiniCard key={p.id} project={p} />)}
            </div>
          </section>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <section>
              <CardHeader title="Focus — coming due" subtitle="Highest priority tasks with due dates" />
              <Card className="lg:border-t-0">
                {loading && <SkeletonRow lines={3} className="p-5" />}
                {!loading && data?.focusTasks?.length === 0 && (
                  <p className="py-6 text-center text-xs text-ink-muted">Nothing due. Enjoy the calm.</p>
                )}
                <ul className="divide-y divide-edge/60">
                  {data?.focusTasks?.map((t) => (
                    <li key={t.id} className="flex items-center gap-3 py-2.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-ink">{t.title}</p>
                        {t.project && (
                          <Link to={`/projects/${t.project.id}`} className="text-xs text-ink-muted hover:text-accent">
                            {t.project.name}
                          </Link>
                        )}
                      </div>
                      <PriorityBadge priority={t.priority} />
                      <span className="tabular text-[11px] text-ink-muted">{formatDate(t.dueDate)}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </section>

            <section>
              <CardHeader title="Recent deployments" subtitle="Latest across all environments" />
              <Card className="lg:border-t-0">
                {loading && <SkeletonRow lines={3} className="p-5" />}
                {!loading && data?.deployments?.length === 0 && (
                  <p className="py-6 text-center text-xs text-ink-muted">No deployments yet.</p>
                )}
                <ul className="divide-y divide-edge/60">
                  {data?.deployments?.map((d) => (
                    <li key={d.id} className="flex items-center gap-3 py-2.5">
                      <div className="min-w-0 flex-1">
                        <Link to={`/projects/${d.projectId}`} className="truncate text-sm font-medium text-ink hover:text-accent">
                          {d.project?.name}
                        </Link>
                        <p className="mt-0.5 font-mono text-[11px] text-ink-muted">
                          {d.branch} · {shortHash(d.commit)} · {durationLabel(d.durationMs)}
                        </p>
                      </div>
                      <span className="text-[11px] text-ink-muted">{d.environment}</span>
                      <DeploymentStatusBadge status={d.status} />
                    </li>
                  ))}
                </ul>
              </Card>
            </section>
          </div>

          <section className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Activity</h2>
              <Link to="/activity" className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-strong">
                View all <ArrowRight className="h-3 w-3" aria-hidden />
              </Link>
            </div>
            {loading && <SkeletonRow lines={4} className="mb-3" />}
            {!loading && data?.recentActivity?.length === 0 && (
              <EmptyState icon={ActivityIcon} title="No activity yet" description="Your workspace timeline will appear here." />
            )}
            <Card>
              <ul className="divide-y divide-edge/60">
                {data?.recentActivity?.map((a) => (
                  <li key={a.id} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="relative flex h-2 w-2 shrink-0 rounded-full bg-accent" />
                    <p className="min-w-0 flex-1 truncate text-sm text-ink-secondary">{a.description}</p>
                    <span className="shrink-0 text-[11px] text-ink-muted">{dayLabel(a.createdAt)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}