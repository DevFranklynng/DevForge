import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apisApi, projectsApi } from "@/services/api";
import { useToast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { API_METHODS } from "@/lib/meta";

const initial = {
  name: "",
  method: "GET",
  path: "",
  description: "",
  statusCode: "200",
  authRequired: false,
  parameters: "",
  requestBody: "",
  responseExample: "",
  projectId: "",
};

function parseParameters(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [key, ...rest] = line.split(":");
      return { name: key.trim(), type: rest.join(":").trim() || "string" };
    });
}

function parametersToText(parameters) {
  return (parameters || []).map((p) => `${p.name}:${p.type || "string"}`).join("\n");
}

export function EndpointFormModal({ open, onClose, endpoint, defaultProjectId }) {
  const isEdit = Boolean(endpoint);
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
      endpoint
        ? {
            name: endpoint.name || "",
            method: endpoint.method,
            path: endpoint.path,
            description: endpoint.description || "",
            statusCode: endpoint.statusCode,
            authRequired: endpoint.authRequired,
            parameters: parametersToText(endpoint.parameters),
            requestBody: endpoint.requestBody || "",
            responseExample: endpoint.responseExample || "",
            projectId: endpoint.projectId || "",
          }
        : { ...initial, projectId: defaultProjectId || "" },
    );
  }, [open, endpoint, defaultProjectId]);

  const mutation = useMutation({
    mutationFn: (payload) => (isEdit ? apisApi.update(endpoint.id, payload) : apisApi.create(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apis"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(isEdit ? "Endpoint updated" : "Endpoint documented");
      onClose();
    },
    onError: (err) => setError(err.message || "Failed to save endpoint"),
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    mutation.mutate({
      name: form.name.trim() || null,
      method: form.method,
      path: form.path.trim(),
      description: form.description.trim() || null,
      statusCode: form.statusCode,
      authRequired: form.authRequired,
      parameters: parseParameters(form.parameters),
      requestBody: form.requestBody.trim() || null,
      responseExample: form.responseExample.trim() || null,
      projectId: form.projectId || null,
    });
  };

  const projects = data?.projects ?? [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit endpoint" : "Document endpoint"}
      description="Describe an endpoint so your API references itself."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Method" htmlFor="e-method">
          <Select id="e-method" value={form.method} onChange={(e) => set("method", e.target.value)}>
            {API_METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </Select>
        </Field>

        <Field label="Path" htmlFor="e-path">
          <Input id="e-path" required className="font-mono" value={form.path} onChange={(e) => set("path", e.target.value)} placeholder="/api/v1/users" />
        </Field>

        <Field label="Display name" htmlFor="e-name" className="sm:col-span-2">
          <Input id="e-name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="List users" />
        </Field>

        <Field label="Description" htmlFor="e-desc" className="sm:col-span-2">
          <Textarea id="e-desc" rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="What does this endpoint do?" />
        </Field>

        <Field label="Status code" htmlFor="e-code">
          <Input id="e-code" value={form.statusCode} onChange={(e) => set("statusCode", e.target.value)} placeholder="200" />
        </Field>

        <Field label="Auth required" htmlFor="e-auth">
          <div className="flex h-9 items-center pt-1">
            <Switch checked={form.authRequired} onChange={(v) => set("authRequired", v)} aria-label="Auth required" />
          </div>
        </Field>

        {!defaultProjectId && (
          <Field label="Project" htmlFor="e-project" className="sm:col-span-2">
            <Select id="e-project" value={form.projectId} onChange={(e) => set("projectId", e.target.value)}>
              <option value="">No project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Select>
          </Field>
        )}

        <Field label="Parameters" htmlFor="e-params" hint="One per line, name:type" className="sm:col-span-2">
          <Textarea id="e-params" rows={3} className="font-mono" value={form.parameters} onChange={(e) => set("parameters", e.target.value)} placeholder={"limit:number\nuserId:string"} />
        </Field>

        <Field label="Request body (JSON)" htmlFor="e-body" className="sm:col-span-2">
          <Textarea id="e-body" rows={3} className="font-mono" value={form.requestBody} onChange={(e) => set("requestBody", e.target.value)} placeholder={'{"name": "string"}'} />
        </Field>

        <Field label="Response example (JSON)" htmlFor="e-resp" className="sm:col-span-2">
          <Textarea id="e-resp" rows={3} className="font-mono" value={form.responseExample} onChange={(e) => set("responseExample", e.target.value)} placeholder='{"ok": true}' />
        </Field>

        {error && (
          <p role="alert" className="rounded border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger sm:col-span-2">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 sm:col-span-2">
          <Button type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" loading={mutation.isPending}>
            {isEdit ? "Save changes" : "Document endpoint"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}