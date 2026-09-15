import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "@/services/api";
import { useToast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { PROJECT_PRIORITIES, PROJECT_STATUSES } from "@/lib/meta";
import { titleCase } from "@/utils/format";

const initial = {
  name: "",
  description: "",
  status: "planning",
  priority: "medium",
  progress: 0,
  techStack: "",
  repositoryUrl: "",
  productionUrl: "",
  dueDate: "",
};

export function ProjectFormModal({ open, onClose, project }) {
  const isEdit = Boolean(project);
  const toast = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    setForm(
      project
        ? {
            name: project.name,
            description: project.description || "",
            status: project.status,
            priority: project.priority,
            progress: project.progress ?? 0,
            techStack: (project.techStack || []).join(", "),
            repositoryUrl: project.repositoryUrl || "",
            productionUrl: project.productionUrl || "",
            dueDate: project.dueDate ? new Date(project.dueDate).toISOString().slice(0, 10) : "",
          }
        : initial,
    );
  }, [open, project]);

  const mutation = useMutation({
    mutationFn: (payload) =>
      isEdit ? projectsApi.update(project.id, payload) : projectsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(isEdit ? "Project updated" : "Project created");
      onClose();
    },
    onError: (err) => setError(err.message || "Failed to save project"),
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    mutation.mutate({
      ...form,
      name: form.name.trim(),
      description: form.description.trim() || null,
      techStack: form.techStack.split(",").map((s) => s.trim()).filter(Boolean),
      repositoryUrl: form.repositoryUrl.trim() || null,
      productionUrl: form.productionUrl.trim() || null,
      progress: Number(form.progress),
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit project" : "New project"}
      description={isEdit ? "Update the project's details." : "Give your project a home in the workspace."}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="p-name" className="sm:col-span-2">
          <Input id="p-name" required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="CampusNest" />
        </Field>

        <Field label="Description" htmlFor="p-desc" className="sm:col-span-2">
          <Textarea
            id="p-desc"
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="What does this project do?"
          />
        </Field>

        <Field label="Status" htmlFor="p-status">
          <Select id="p-status" value={form.status} onChange={(e) => set("status", e.target.value)}>
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>{titleCase(s)}</option>
            ))}
          </Select>
        </Field>

        <Field label="Priority" htmlFor="p-priority">
          <Select id="p-priority" value={form.priority} onChange={(e) => set("priority", e.target.value)}>
            {PROJECT_PRIORITIES.map((p) => (
              <option key={p} value={p}>{titleCase(p)}</option>
            ))}
          </Select>
        </Field>

        <Field label="Progress (%)" htmlFor="p-progress">
          <Input
            id="p-progress"
            type="number"
            min={0}
            max={100}
            value={form.progress}
            onChange={(e) => set("progress", e.target.value)}
          />
        </Field>

        <Field label="Due date" htmlFor="p-due">
          <Input id="p-due" type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
        </Field>

        <Field label="Tech stack (comma-separated)" htmlFor="p-stack" className="sm:col-span-2">
          <Input
            id="p-stack"
            value={form.techStack}
            onChange={(e) => set("techStack", e.target.value)}
            placeholder="React, Express, Prisma"
          />
        </Field>

        <Field label="Repository URL" htmlFor="p-repo">
          <Input id="p-repo" value={form.repositoryUrl} onChange={(e) => set("repositoryUrl", e.target.value)} placeholder="https://github.com/…" />
        </Field>

        <Field label="Production URL" htmlFor="p-prod">
          <Input id="p-prod" value={form.productionUrl} onChange={(e) => set("productionUrl", e.target.value)} placeholder="https://…" />
        </Field>

        {error && (
          <p role="alert" className="rounded border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger sm:col-span-2">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 sm:col-span-2">
          <Button type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" loading={mutation.isPending}>
            {isEdit ? "Save changes" : "Create project"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}