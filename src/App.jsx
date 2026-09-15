import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Landing } from "@/pages/Landing";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { Dashboard } from "@/pages/Dashboard";
import { Projects } from "@/pages/Projects";
import { ProjectDetail } from "@/pages/projects/ProjectDetail";
import { Tasks } from "@/pages/tasks/Tasks";
import { Deployments } from "@/pages/deployments/Deployments";
import { GitHubPage } from "@/pages/github/GitHubPage";
import { Apis } from "@/pages/apis/Apis";
import { Activity } from "@/pages/activity/Activity";
import { Ai } from "@/pages/ai/Ai";
import { Settings } from "@/pages/settings/Settings";
import { NotFound } from "@/pages/NotFound";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

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

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}