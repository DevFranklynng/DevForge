import { useQuery } from "@tanstack/react-query";
import { Activity as ActivityIcon } from "lucide-react";
import { activityApi } from "@/services/api";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { ACTIVITY_LABELS } from "@/lib/meta";
import { dayLabel } from "@/utils/format";

export function ActivityTab({ project }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["activity", { projectId: project.id }],
    queryFn: () => activityApi.list({ projectId: project.id, limit: 50 }),
  });

  if (isLoading) return <Spinner label="Loading activity" />;

  if (isError) {
    return <p className="py-10 text-center text-xs text-danger">Could not load activity.</p>;
  }

  const activities = data?.activities || [];

  if (activities.length === 0) {
    return (
      <EmptyState
        icon={ActivityIcon}
        title="No activity for this project yet"
        description="Changes to this project's tasks, repositories, and deployments will show up here."
      />
    );
  }

  const groups = activities.reduce((acc, a) => {
    const label = dayLabel(a.createdAt);
    if (!acc[label]) acc[label] = [];
    acc[label].push(a);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(groups).map(([label, items]) => (
        <div key={label} className="mb-5">
          <p className="sticky top-14 z-10 -mx-1 mb-2 rounded px-1 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
            {label}
          </p>
          <ol className="relative ml-3 space-y-4 border-l border-edge pl-5">
            {items.map((a) => (
              <li key={a.id} className="relative">
                <span className="absolute -left-[26px] top-1 h-2.5 w-2.5 rounded-full border-2 border-surface bg-accent" />
                <p className="text-[13px] leading-relaxed text-ink-secondary">{a.description}</p>
                {a.details && Object.keys(a.details).length > 0 && (
                  <p className="mt-0.5 font-mono text-[10px] text-ink-muted">{JSON.stringify(a.details)}</p>
                )}
                <p className="text-[11px] text-ink-muted">{ACTIVITY_LABELS[a.type] || a.type}</p>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}