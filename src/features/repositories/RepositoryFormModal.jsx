import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { repositoriesApi, projectsApi } from "@/services/api";
import { useToast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";

const initial = {
  name: "",
  owner: "",
  description: "",
  branch: "main",
  visibility: "private",
  stars: 0,
  forks: 0,
  openIssues: 0,
  lastCommit: "",
  url: "",
  projectId: "",
  sync: false,
};

export function RepositoryFormModal({ open, onClose, repository, defaultProjectId }) {
  const isEdit = Boolean(repository);
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
      repository
        ? {
            name: repository.name,
            owner: repository.owner || "",
            description: repository.description || "",
            branch: repository.branch || "main",
            visibility: repository.visibility || "private",
            stars: repository.stars ?? 0,
            forks: repository.forks ?? 0,
            openIssues: repository.openIssues ?? 0,
            lastCommit: repository.lastCommit ? new Date(repository.lastCommit).toISOString().slice(0, 10) : "",
            url: repository.url || "",
            projectId: repository.projectId || "",
            sync: false,
          }
        : { ...initial, projectId: defaultProjectId || "" },
    );
  }, [open, repository, defaultProjectId]);

  const mutation = useMutation({
    mutationFn: (payload) => (isEdit ? repositoriesApi.update(repository.id, payload) : repositoriesApi.create(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repositories"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(isEdit ? "Repository updated" : "Repository connected");
      onClose();
    },
    onError: (err) => setError(err.message || "Failed to save repository"),
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    mutation.mutate({
      ...form,
      name: form.name.trim(),
      owner: form.owner.trim(),
      description: form.description.trim() || null,
      lastCommit: form.lastCommit ? new Date(form.lastCommit).toISOString() : null,
      url: form.url.trim() || null,
      projectId: form.projectId || null,
    });
  };

  const projects = data?.projects ?? [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit repository" : "Connect repository"}
      description={isEdit ? "Update repository details." : "Track a repository in your workspace."}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        {!isEdit && (
          <div className="flex items-center justify-between rounded-md border border-edge bg-surface-2 px-3 py-2.5 sm:col-span-2">
            <div>
              <p className="text-xs font-medium text-ink">Sync metadata from GitHub</p>
              <p className="text-[11px] text-ink-muted">Fill stars, forks, issues and last commit automatically (demo).</p>
            </div>
            <Switch checked={form.sync} onChange={(v) => set("sync", v)} aria-label="Sync from GitHub" />
          </div>
        )}

        <Field label="Repository name" htmlFor="r-name" className="sm:col-span-2">
          <Input id="r-name" required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="devforge" />
        </Field>

        <Field label="Owner / organization" htmlFor="r-owner" className="sm:col-span-2">
          <Input id="r-owner" value={form.owner} onChange={(e) => set("owner", e.target.value)} placeholder="acme" />
        </Field>

        <Field label="Description" htmlFor="r-desc" className="sm:col-span-2">
          <Textarea id="r-desc" rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} />
        </Field>

        <Field label="Default branch" htmlFor="r-branch">
          <Input id="r-branch" value={form.branch} onChange={(e) => set("branch", e.target.value)} placeholder="main" />
        </Field>

        <Field label="Visibility" htmlFor="r-vis">
          <Select id="r-vis" value={form.visibility} onChange={(e) => set("visibility", e.target.value)}>
            <option value="private">Private</option>
            <option value="public">Public</option>
          </Select>
        </Field>

        <Field label="Stars" htmlFor="r-stars">
          <Input id="r-stars" type="number" min={0} value={form.stars} onChange={(e) => set("stars", e.target.value)} />
        </Field>

        <Field label="Forks" htmlFor="r-forks">
          <Input id="r-forks" type="number" min={0} value={form.forks} onChange={(e) => set("forks", e.target.value)} />
        </Field>

        <Field label="Open issues" htmlFor="r-issues">
          <Input id="r-issues" type="number" min={0} value={form.openIssues} onChange={(e) => set("openIssues", e.target.value)} />
        </Field>

        <Field label="Last commit" htmlFor="r-commit">
          <Input id="r-commit" type="date" value={form.lastCommit} onChange={(e) => set("lastCommit", e.target.value)} />
        </Field>

        <Field label="Repository URL" htmlFor="r-url" className="sm:col-span-2">
          <Input id="r-url" value={form.url} onChange={(e) => set("url", e.target.value)} placeholder="https://github.com/acme/devforge" />
        </Field>

        {!defaultProjectId && (
          <Field label="Project" htmlFor="r-project" className="sm:col-span-2">
            <Select id="r-project" value={form.projectId} onChange={(e) => set("projectId", e.target.value)}>
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
            {isEdit ? "Save changes" : "Connect repository"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}