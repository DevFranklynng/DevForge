import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { tasksApi } from "@/services/api";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { TaskStatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/Modal";
import { TaskFormModal } from "@/features/tasks/TaskFormModal";
import { TASK_STATUSES } from "@/lib/meta";
import { titleCase, formatDate, isOverdue } from "@/utils/format";

export function TasksTab({ project }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const invalidateProject = () => queryClient.invalidateQueries({ queryKey: ["project", project.id] });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => tasksApi.update(id, { status }),
    onSuccess: invalidateProject,
    onError: (err) => toast.error(err.message || "Failed to update task"),
  });

  const deleteMutation = useMutation({
    mutationFn: tasksApi.remove,
    onSuccess: () => {
      invalidateProject();
      toast.success("Task deleted");
      setDeleting(null);
    },
    onError: (err) => toast.error(err.message || "Failed to delete task"),
  });

  const tasks = project.tasks || [];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-ink-muted">{tasks.length} task{tasks.length === 1 ? "" : "s"} · {project.openTasks} open</p>
        <Button size="sm" variant="primary" leftIcon={<Plus className="h-4 w-4" aria-hidden />} onClick={() => { setEditing(null); setFormOpen(true); }}>
          Add task
        </Button>
      </div>

      {tasks.length === 0 && (
        <EmptyState
          icon={CheckCircle2}
          title="No tasks yet"
          description="Break the project into smaller, trackable pieces of work."
        />
      )}

      <ul className="divide-y divide-edge/60 rounded-lg border border-edge bg-surface">
        {tasks.map((t) => (
          <li key={t.id} className="flex items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-sm text-ink">{t.title}</p>
                <PriorityBadge priority={t.priority} />
                {t.dueDate && (
                  <span className={`text-[11px] ${isOverdue(t.dueDate) && t.status !== "done" ? "text-danger" : "text-ink-muted"}`}>
                    {isOverdue(t.dueDate) && t.status !== "done" ? "Overdue · " : ""}{formatDate(t.dueDate)}
                  </span>
                )}
                {t.status === "done" && <TaskStatusBadge status="done" />}
              </div>
              {t.description && <p className="mt-0.5 line-clamp-1 text-xs text-ink-muted">{t.description}</p>}
            </div>
            <Select
              value={t.status}
              aria-label={`Status of ${t.title}`}
              className="h-8 w-32 text-xs"
              onChange={(e) => statusMutation.mutate({ id: t.id, status: e.target.value })}
            >
              {TASK_STATUSES.map((s) => (
                <option key={s} value={s}>{titleCase(s)}</option>
              ))}
            </Select>
            <button
              onClick={() => { setEditing(t); setFormOpen(true); }}
              aria-label={`Edit ${t.title}`}
              className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink btn-focus"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden />
            </button>
            <button
              onClick={() => setDeleting(t)}
              aria-label={`Delete ${t.title}`}
              className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-danger/10 hover:text-danger btn-focus"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
            </button>
          </li>
        ))}
      </ul>

      <TaskFormModal open={formOpen} onClose={() => setFormOpen(false)} task={editing} defaultProjectId={project.id} />
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