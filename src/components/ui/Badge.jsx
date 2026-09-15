import { cn } from "@/lib/cn";
import { titleCase } from "@/utils/format";

const tones = {
  neutral: "bg-surface-3 text-ink-secondary border-edge",
  accent: "bg-accent/10 text-accent border-accent/25",
  success: "bg-success/10 text-success border-success/25",
  warning: "bg-warning/10 text-warning border-warning/25",
  danger: "bg-danger/10 text-danger border-danger/25",
  info: "bg-info/10 text-info border-info/25",
};

export function Badge({ tone = "neutral", className, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] font-medium leading-4 whitespace-nowrap",
        tones[tone] || tones.neutral,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

const statusTone = {
  planning: "info",
  development: "accent",
  testing: "warning",
  live: "success",
  paused: "warning",
  archived: "neutral",
};

export function ProjectStatusBadge({ status, className }) {
  return <Badge tone={statusTone[status] || "neutral"} className={className}>{titleCase(status)}</Badge>;
}

const taskStatusTone = {
  todo: "neutral",
  in_progress: "accent",
  done: "success",
};

export function TaskStatusBadge({ status, className }) {
  return <Badge tone={taskStatusTone[status] || "neutral"} className={className}>{titleCase(status)}</Badge>;
}

const priorityTone = {
  low: "neutral",
  medium: "info",
  high: "warning",
  critical: "danger",
};

export function PriorityBadge({ priority, className }) {
  return <Badge tone={priorityTone[priority] || "neutral"} className={className}>{titleCase(priority)}</Badge>;
}

export const deploymentTone = {
  success: "success",
  building: "info",
  failed: "danger",
  cancelled: "neutral",
};

export function DeploymentStatusBadge({ status, className }) {
  return (
    <Badge tone={deploymentTone[status] || "neutral"} className={className}>
      {status === "building" && <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-info opacity-60" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-info" /></span>}
      {titleCase(status)}
    </Badge>
  );
}

export function MethodBadge({ method, className }) {
  const methodTone = {
    GET: "success",
    POST: "accent",
    PUT: "info",
    PATCH: "warning",
    DELETE: "danger",
  };
  return <Badge tone={methodTone[method] || "neutral"} className={cn("font-mono", className)}>{method}</Badge>;
}