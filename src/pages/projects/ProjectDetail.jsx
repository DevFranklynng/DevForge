import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Pencil, Trash2, Hammer } from "lucide-react";
import { projectsApi } from "@/services/api";
import { useToast } from "@/components/ui/Toast";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { ProjectStatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/Modal";
import { ProjectFormModal } from "@/features/projects/ProjectFormModal";
import { OverviewTab } from "@/features/projects/tabs/OverviewTab";
import { TasksTab } from "@/features/projects/tabs/TasksTab";
import { RepositoryTab } from "@/features/projects/tabs/RepositoryTab";
import { DeploymentsTab } from "@/features/projects/tabs/DeploymentsTab";
import { ApiTab } from "@/features/projects/tabs/ApiTab";
import { ActivityTab } from "@/features/projects/tabs/ActivityTab";

const tabItems = [
  { value: "overview", label: "Overview" },
  { value: "tasks", label: "Tasks" },
  { value: "repository", label: "Repository" },
  { value: "deployments", label: "Deployments" },
  { value: "api", label: "API docs" },
  { value: "activity", label: "Activity" },
];

export default ProjectDetail;
export function ProjectDetail() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "overview";
  const toast = useToast();
  const queryClient = useQueryClient();

  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["project", id],
    queryFn: () => projectsApi.get(id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => projectsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Project deleted");
      setDeleting(false);
      window.location.href = "/projects";
    },
    onError: (err) => toast.error(err.message || "Failed to delete project"),
  });

  const project = data?.project;

  const onTabChange = (value) => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", value);
    setSearchParams(next);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-xs text-ink-muted">
        Loading project…
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Card className="p-8 text-center">
          <p className="text-sm font-medium text-danger">{error?.message || "Project not found"}</p>
          <Link to="/projects" className="mt-4 inline-flex h-9 items-center rounded-md border border-edge-strong px-4 text-sm text-ink hover:border-accent/60">
            Back to projects
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <Link to="/projects" className="inline-flex items-center gap-1.5 text-xs text-ink-muted transition-colors hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Projects
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-edge-strong bg-surface-2">
              <Hammer className="h-4 w-4 text-accent" aria-hidden />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">{project.name}</h1>
            <ProjectStatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
          </div>
          {project.description && (
            <p className="mt-1.5 max-w-2xl text-sm text-ink-secondary">{project.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFormOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-edge bg-surface-2 px-3 text-sm text-ink transition-colors hover:border-edge-strong btn-focus"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden /> Edit
          </button>
          <button
            onClick={() => setDeleting(true)}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-danger/40 px-3 text-sm text-danger transition-colors hover:bg-danger/10 btn-focus"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden /> Delete
          </button>
        </div>
      </div>

      <div className="mt-6">
        <Tabs
          items={tabItems.map((t) => ({
            ...t,
            count: t.value === "tasks" ? project.openTasks : undefined,
          }))}
          value={tabItems.some((t) => t.value === tab) ? tab : "overview"}
          onChange={onTabChange}
          aria-label="Project sections"
        />
      </div>

      <div className="mt-5 pb-16">
        {tab === "overview" && <OverviewTab project={project} />}
        {tab === "tasks" && <TasksTab project={project} />}
        {tab === "repository" && <RepositoryTab project={project} />}
        {tab === "deployments" && <DeploymentsTab project={project} />}
        {tab === "api" && <ApiTab project={project} />}
        {tab === "activity" && <ActivityTab project={project} />}
      </div>

      <ProjectFormModal open={formOpen} onClose={() => setFormOpen(false)} project={project} />

      <ConfirmDialog
        open={deleting}
        onClose={() => setDeleting(false)}
        onConfirm={deleteMutation.mutate}
        confirmLoading={deleteMutation.isPending}
        title={`Delete "${project.name}"?`}
        message="This permanently removes the project and everything tied to it."
      />
    </div>
  );
}