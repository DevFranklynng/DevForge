import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";

const Landing = lazy(() => import("@/pages/Landing"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Projects = lazy(() => import("@/pages/Projects"));
const ProjectDetail = lazy(() => import("@/pages/projects/ProjectDetail"));
const Tasks = lazy(() => import("@/pages/tasks/Tasks"));
const Deployments = lazy(() => import("@/pages/deployments/Deployments"));
const GitHubPage = lazy(() => import("@/pages/github/GitHubPage"));
const Apis = lazy(() => import("@/pages/apis/Apis"));
const Activity = lazy(() => import("@/pages/activity/Activity"));
const Ai = lazy(() => import("@/pages/ai/Ai"));
const Settings = lazy(() => import("@/pages/settings/Settings"));
const NotFound = lazy(() => import("@/pages/NotFound"));

/** Fallback for top-level lazy pages that have no persistent shell behind them. */
function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas text-sm text-ink-secondary">
      <span
        role="status"
        aria-label="Loading"
        className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent"
      />
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<PageFallback />}>
            <Landing />
          </Suspense>
        }
      />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/deployments" element={<Deployments />} />
        <Route path="/github" element={<GitHubPage />} />
        <Route path="/apis" element={<Apis />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/ai" element={<Ai />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route
        path="/404"
        element={
          <Suspense fallback={<PageFallback />}>
            <NotFound />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}