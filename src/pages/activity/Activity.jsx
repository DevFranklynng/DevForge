import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Activity as ActivityIcon } from "lucide-react";
import { activityApi, projectsApi } from "@/services/api";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ACTIVITY_TYPES, ACTIVITY_LABELS } from "@/lib/meta";
import { dayLabel } from "@/utils/format";

const PAGE = 30;

export function Activity() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [offset, setOffset] = useState(0);
  const [items, setItems] = useState([]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["activity", { projectId: projectFilter, type: typeFilter, limit: PAGE, offset }],
    queryFn: () => activityApi.list({ projectId: projectFilter, type: typeFilter, limit: PAGE, offset }),
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (!data) return;
    setItems((prev) => {
      const merged = offset === 0 ? data.activities : [...prev, ...data.activities];
      const seen = new Set(merged.map((a) => a.id));
      return merged.filter((a) => seen.has(a.id));
    });
  }, [data, offset]);

  const projectsQuery = useQuery({
    queryKey: ["projects", {}],
    queryFn: () => projectsApi.list(),
  });

  const total = data?.total ?? 0;
  const projects = projectsQuery.data?.projects ?? [];
  const hasMore = items.length < total;

  const changeProject = (id) => {
    setProjectFilter(id);
    setOffset(0);
    setItems([]);
  };

  const changeType = (type) => {
    setTypeFilter(type);
    setOffset(0);
    setItems([]);
  };

  const loadMore = () => setOffset((o) => o + PAGE);

  const groups = items.reduce((acc, a) => {
    const label = dayLabel(a.createdAt);
    if (!acc[label]) acc[label] = [];
    acc[label].push(a);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <ActivityIcon className="h-5 w-5" aria-hidden /> Activity
          </h1>
          <p className="mt-0.5 text-xs text-ink-muted">{total} event{total === 1 ? "" : "s"} in this timeline</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Select value={projectFilter} onChange={(e) => changeProject(e.target.value)} aria-label="Filter by project" className="w-52">
          <option value="all">All projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Select>
        <Select value={typeFilter} onChange={(e) => changeType(e.target.value)} aria-label="Filter by type" className="w-56">
          <option value="all">All event types</option>
          {ACTIVITY_TYPES.map((t) => (
            <option key={t} value={t}>{ACTIVITY_LABELS[t] || t}</option>
          ))}
        </Select>
      </div>

      {isError && (
        <Card className="mt-5 p-6 text-center">
          <p className="text-sm text-danger">{error?.message}</p>
        </Card>
      )}

      {isLoading && items.length === 0 && (
        <p className="mt-8 text-center text-xs text-ink-muted">Loading activity…</p>
      )}

      {!isLoading && !isError && items.length === 0 && (
        <div className="mt-6">
          <EmptyState
            icon={ActivityIcon}
            title="No activity found"
            description={projectFilter !== "all" || typeFilter !== "all" ? "Try changing your filters." : "Your workspace timeline will appear here."}
          />
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-8">
          {Object.entries(groups).map(([label, entries]) => (
            <div key={label} className="mb-6">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">{label}</p>
              <ol className="relative ml-3 space-y-4 border-l border-edge pl-5">
                {entries.map((a) => (
                  <li key={a.id} className="relative">
                    <span className="absolute -left-[26px] top-1 h-2.5 w-2.5 rounded-full border-2 border-surface bg-accent" />
                    <p className="text-sm leading-relaxed text-ink-secondary">{a.description}</p>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-ink-muted">
                      <span className="rounded border border-edge bg-surface-2 px-1.5 py-0.5">{ACTIVITY_LABELS[a.type] || a.type}</span>
                      {a.project && (
                        <Link to={`/projects/${a.project.id}`} className="hover:text-accent">{a.project.name}</Link>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}

          {hasMore && (
            <div className="mt-2 flex justify-center">
              <Button onClick={loadMore} loading={isLoading}>
                Load more
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}