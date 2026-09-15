import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Columns, List, CalendarClock, Pencil, Trash2 } from "lucide-react";
import { tasksApi, projectsApi } from "@/services/api";
import { useAuth } from "@/features/auth/auth-context";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { TaskStatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/Modal";
import { TaskFormModal } from "@/features/tasks/TaskFormModal";
import { TASK_STATUSES } from "@/lib/meta";
import { titleCase, formatDate, isOverdue } from "@/utils/format";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/cn";

const columnMeta = {
  todo: { label: "To do", accent: "bg-ink-muted/60" },
  in_progress: { label: "In progress", accent: "bg-accent" },
  done: { label: "Done", accent: "bg-success" },
};

export function Tasks() {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [projectFilter, setProjectFilter] = useState("all");
  const [q, setQ] = useState("");
  const [view, setView] = useState(user?.settings?.defaultProjectView || "board");
  const debouncedQ = useDebounce(q, 250);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tasks", { projectId: projectFilter, q: debouncedQ }],
    queryFn: () => tasksApi.list({ projectId: projectFilter, q: debouncedQ }),
  });

  const projectsQuery = useQuery({
    queryKey: ["projects", {}],
    queryFn: () => projectsApi.list(),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => tasksApi.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (err) => toast.error(err.message || "Failed to update task"),
  });

  const deleteMutation = useMutation({
    mutationFn: tasksApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Task deleted");
      setDeleting(null);
    },
    onError: (err) => toast.error(err.message || "Failed to delete task"),
  });

  const tasks = data?.tasks ?? [];

  const columns = useMemo(() => {
    const map = { todo: [], in_progress: [], done: [] };
    tasks.forEach((t) => {
      if (map[t.status]) map[t.status].push(t);
    });
    return map;
  }, [tasks]);

  const projects = projectsQuery.data?.projects ?? [];

  const TaskCard = ({ task }) => (
    <Card className="p-3">
      <div className="flex items-start justify-between gap-2">
        <Link to={task.projectId ? `/projects/${task.projectId}?tab=tasks` : "#"} className="min-w-0">
          <p className={cn("text-sm leading-snug text-ink", task.status === "done" && "text-ink-muted line-through")}>
            {task.title}
          </p>
        </Link>
        <PriorityBadge priority={task.priority} />
      </div>

      {task.description && <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{task.description}</p>}

      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-ink-muted">
        {task.project && (
          <Link to={`/projects/${task.project.id}`} className="truncate text-[10px] text-ink-secondary hover:text-accent">
            {task.project.name}
          </Link>
        )}
        {task.project && task.dueDate && <span>·</span>}
        {task.dueDate && (
          <span className={cn("inline-flex items-center gap-1", isOverdue(task.dueDate) && task.status !== "done" && "text-danger")}>
            <CalendarClock className="h-3 w-3" aria-hidden />
            {titleCase(isOverdue(task.dueDate) && task.status !== "done" ? "Overdue · " : "")}{formatDate(task.dueDate)}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-edge/60 pt-2.5">
        <Select
          value={task.status}
          aria-label={`Move ${task.title}`}
          className="h-7 w-[130px] text-[11px]"
          onChange={(e) => statusMutation.mutate({ id: task.id, status: e.target.value })}
        >
          {TASK_STATUSES.map((s) => (
            <option key={s} value={s}>{titleCase(s)}</option>
          ))}
        </Select>
        <div className="flex items-center gap-1">
          <button
            onClick={() => { setEditing(task); setFormOpen(true); }}
            aria-label={`Edit ${task.title}`}
            className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink btn-focus"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden />
          </button>
          <button
            onClick={() => setDeleting(task)}
            aria-label={`Delete ${task.title}`}
            className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-danger/10 hover:text-danger btn-focus"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Tasks</h1>
          <p className="mt-0.5 text-xs text-ink-muted">{tasks.length} task{tasks.length === 1 ? "" : "s"} shown</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-md border border-edge">
            <button
              onClick={() => setView("board")}
              aria-label="Board view"
              className={cn("flex h-8 w-8 items-center justify-center transition-colors btn-focus", view === "board" ? "bg-surface-3 text-ink" : "text-ink-muted hover:text-ink")}
            >
              <Columns className="h-4 w-4" aria-hidden />
            </button>
            <button
              onClick={() => setView("list")}
              aria-label="List view"
              className={cn("flex h-8 w-8 items-center justify-center transition-colors btn-focus", view === "list" ? "bg-surface-3 text-ink" : "text-ink-muted hover:text-ink")}
            >
              <List className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" aria-hidden />} onClick={() => { setEditing(null); setFormOpen(true); }}>
            New task
          </Button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden />
          <Input className="pl-9" placeholder="Search tasks…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search tasks" />
        </div>
        <Select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} aria-label="Filter by project" className="w-48">
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

      {isLoading && <p className="mt-6 text-center text-xs text-ink-muted">Loading tasks…</p>}

      {!isError && !isLoading && tasks.length === 0 && (
        <div className="mt-6">
          <EmptyState
            title="No tasks found"
            description={q || projectFilter !== "all" ? "Try changing your filters." : "Create your first task to start organizing work."}
            action={
              <Button variant="primary" leftIcon={<Plus className="h-4 w-4" aria-hidden />} onClick={() => { setEditing(null); setFormOpen(true); }}>
                New task
              </Button>
            }
          />
        </div>
      )}

      {view === "board" && tasks.length > 0 && (
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {TASK_STATUSES.map((status) => (
            <div key={status} className="rounded-lg border border-edge bg-surface-2/50 p-3">
              <div className="mb-3 flex items-center gap-2 px-1">
                <span className={cn("h-2 w-2 rounded-full", columnMeta[status].accent)} />
                <p className="text-xs font-semibold text-ink">{columnMeta[status].label}</p>
                <span className="tabular rounded bg-surface-3 px-1.5 py-px font-mono text-[10px] text-ink-muted">
                  {columns[status].length}
                </span>
              </div>
              <div className="space-y-2.5">
                {columns[status].map((task) => <TaskCard key={task.id} task={task} />)}
                {columns[status].length === 0 && (
                  <p className="pb-2 text-center text-[11px] text-ink-muted">Nothing here</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "list" && tasks.length > 0 && (
        <ul className="mt-5 divide-y divide-edge/60 rounded-lg border border-edge bg-surface">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center gap-3 px-4 py-3">
              <TaskStatusBadge status={task.status} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-ink">{task.title}</p>
                {task.project && <p className="text-[11px] text-ink-muted">{task.project.name}</p>}
              </div>
              <PriorityBadge priority={task.priority} />
              {task.dueDate && <span className="text-[11px] text-ink-muted">{formatDate(task.dueDate)}</span>}
              <Select
                value={task.status}
                aria-label={`Move ${task.title}`}
                className="h-7 w-[130px] text-[11px]"
                onChange={(e) => statusMutation.mutate({ id: task.id, status: e.target.value })}
              >
                {TASK_STATUSES.map((s) => (
                  <option key={s} value={s}>{titleCase(s)}</option>
                ))}
              </Select>
            </li>
          ))}
        </ul>
      )}

      <TaskFormModal open={formOpen} onClose={() => setFormOpen(false)} task={editing} defaultProjectId={projectFilter === "all" ? "" : projectFilter} />
      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleteMutation.mutate(deleting.id)}
        confirmLoading={deleteMutation.isPending}
        title="Delete this task?"
        message={`"${deleting?.title}" will be permanently removed.`}
      />
    </div>
  );
}