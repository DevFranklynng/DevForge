import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tasksApi, projectsApi } from "@/services/api";
import { useToast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/lib/meta";
import { titleCase } from "@/utils/format";

const initial = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
  projectId: "",
};

export function TaskFormModal({ open, onClose, task, defaultProjectId }) {
  const isEdit = Boolean(task);
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["projects", {}],
    queryFn: () => projectsApi.list(),
  });

  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    setForm(
      task
        ? {
            title: task.title,
            description: task.description || "",
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : "",
            projectId: task.projectId || "",
          }
        : { ...initial, projectId: defaultProjectId || "" },
    );
  }, [open, task, defaultProjectId]);

  const mutation = useMutation({
    mutationFn: (payload) => (isEdit ? tasksApi.update(task.id, payload) : tasksApi.create(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      if (defaultProjectId) queryClient.invalidateQueries({ queryKey: ["tasks", { projectId: defaultProjectId }] });
      toast.success(isEdit ? "Task updated" : "Task created");
      onClose();
    },
    onError: (err) => setError(err.message || "Failed to save task"),
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    mutation.mutate({
      title: form.title.trim(),
      description: form.description.trim() || null,
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      projectId: form.projectId || null,
    });
  };

  const projects = data?.projects ?? [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit task" : "New task"}
      description={isEdit ? "Update this task." : "Capture a piece of work."}
    >
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" htmlFor="t-title" className="sm:col-span-2">
          <Input id="t-title" required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Fix login redirect loop" />
        </Field>

        <Field label="Description" htmlFor="t-desc" className="sm:col-span-2">
          <Textarea id="t-desc" rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Acceptance criteria, links, notes…" />
        </Field>

        <Field label="Status" htmlFor="t-status">
          <Select id="t-status" value={form.status} onChange={(e) => set("status", e.target.value)}>
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>{titleCase(s)}</option>
            ))}
          </Select>
        </Field>

        <Field label="Priority" htmlFor="t-priority">
          <Select id="t-priority" value={form.priority} onChange={(e) => set("priority", e.target.value)}>
            {TASK_PRIORITIES.map((p) => (
              <option key={p} value={p}>{titleCase(p)}</option>
            ))}
          </Select>
        </Field>

        <Field label="Due date" htmlFor="t-due">
          <Input id="t-due" type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
        </Field>

        {!defaultProjectId && (
          <Field label="Project" htmlFor="t-project">
            <Select id="t-project" value={form.projectId} onChange={(e) => set("projectId", e.target.value)}>
              <option value="">No project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Select>
          </Field>
        )}

        {error && (
          <p role="alert" className="rounded border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger sm:col-span-2">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 sm:col-span-2">
          <Button type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" loading={mutation.isPending}>
            {isEdit ? "Save changes" : "Create task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}