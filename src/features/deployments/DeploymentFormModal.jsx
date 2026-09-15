import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deploymentsApi, projectsApi } from "@/services/api";
import { useToast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { DEPLOYMENT_ENVIRONMENTS } from "@/lib/meta";

const initial = {
  projectId: "",
  environment: "production",
  branch: "main",
  commit: "",
  commitMessage: "",
  url: "",
};

export function DeploymentFormModal({ open, onClose, defaultProjectId }) {
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
    setForm({ ...initial, projectId: defaultProjectId || "" });
  }, [open, defaultProjectId]);

  const mutation = useMutation({
    mutationFn: deploymentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deployments"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Deployment started");
      onClose();
    },
    onError: (err) => setError(err.message || "Failed to start deployment"),
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    mutation.mutate({
      ...form,
      projectId: form.projectId,
      branch: form.branch || "main",
      commit: form.commit.trim() || null,
      commitMessage: form.commitMessage.trim() || null,
      url: form.url.trim() || null,
    });
  };

  const projects = data?.projects ?? [];

  return (
    <Modal open={open} onClose={onClose} title="New deployment" description="Simulates a full build lifecycle (queued → building → done).">
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Project" htmlFor="d-project" className="sm:col-span-2">
          <Select id="d-project" required value={form.projectId} onChange={(e) => set("projectId", e.target.value)}>
            <option value="" disabled>Select a project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Select>
        </Field>

        <Field label="Environment" htmlFor="d-env">
          <Select id="d-env" value={form.environment} onChange={(e) => set("environment", e.target.value)}>
            {DEPLOYMENT_ENVIRONMENTS.map((env) => (
              <option key={env} value={env}>{env}</option>
            ))}
          </Select>
        </Field>

        <Field label="Branch" htmlFor="d-branch">
          <Input id="d-branch" value={form.branch} onChange={(e) => set("branch", e.target.value)} placeholder="main" />
        </Field>

        <Field label="Commit SHA" htmlFor="d-commit">
          <Input id="d-commit" value={form.commit} onChange={(e) => set("commit", e.target.value)} placeholder="e4c2a9d" />
        </Field>

        <Field label="Commit message" htmlFor="d-msg">
          <Input id="d-msg" value={form.commitMessage} onChange={(e) => set("commitMessage", e.target.value)} placeholder="Fix retry loop" />
        </Field>

        <Field label="Deploy URL" htmlFor="d-url" className="sm:col-span-2">
          <Input id="d-url" value={form.url} onChange={(e) => set("url", e.target.value)} placeholder="https://…" />
        </Field>

        {error && (
          <p role="alert" className="rounded border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger sm:col-span-2">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 sm:col-span-2">
          <Button type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" loading={mutation.isPending}>
            Deploy
          </Button>
        </div>
      </form>
    </Modal>
  );
}