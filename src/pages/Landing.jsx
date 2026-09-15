import { Link } from "react-router-dom";
import {
  Hammer,
  FolderKanban,
  ListChecks,
  Github,
  Rocket,
  Braces,
  Bell,
  Sparkles,
  Activity,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";

const features = [
  { icon: FolderKanban, title: "Project command", text: "Track every project's status, priority, and progress from one place, with task-derived completion metrics." },
  { icon: ListChecks, title: "Task flow", text: "A kanban board and list view with priorities, due dates, and per-project progress recomputation." },
  { icon: Github, title: "Repository summary", text: "Connect and summarize GitHub repositories with branches, visibility, stars, and open issues." },
  { icon: Rocket, title: "Deployment monitoring", text: "Simulate and monitor production, staging, and preview deployments with live build status." },
  { icon: Braces, title: "Living API docs", text: "Document endpoints method-by-method with parameters, request bodies, and response examples." },
  { icon: Bell, title: "Smart notifications", text: "Recurring reconciliation surfaces failing deployments, due tasks, and stale projects." },
  { icon: Activity, title: "Activity feed", text: "Every meaningful action is captured in a searchable timeline across all your projects." },
  { icon: Sparkles, title: "DevForge AI", text: "A data-driven workspace assistant that answers what to work on next, blockers, and summaries." },
];

export function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="sticky top-0 z-30 border-b border-edge bg-canvas/85 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-edge-strong bg-surface-2">
              <Hammer className="h-4 w-4 text-accent" aria-hidden />
            </div>
            <p className="text-sm font-semibold tracking-tight">DevForge</p>
          </div>
          <nav className="flex items-center gap-2">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex h-9 items-center gap-2 rounded-md bg-accent-strong px-4 text-sm font-medium text-white transition-colors hover:bg-accent/90"
              >
                Open dashboard
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : (
              <>
                <Link to="/login" className="inline-flex h-9 items-center rounded-md px-4 text-sm font-medium text-ink-secondary transition-colors hover:bg-surface-2 hover:text-ink">
                  Sign in
                </Link>
                <Link to="/register" className="inline-flex h-9 items-center rounded-md bg-accent-strong px-4 text-sm font-medium text-white transition-colors hover:bg-accent/90">
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-medium text-accent">
              <Sparkles className="h-3 w-3" aria-hidden />
              Your developer command center
            </span>
            <h1 className="mt-5 text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Plan, ship, and monitor your work —{" "}
              <span className="text-accent">without the tool sprawl.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-ink-secondary">
              DevForge brings projects, tasks, repositories, deployments, API docs, and an AI
              workspace assistant into a single focused interface.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {user ? (
                <Link
                  to="/dashboard"
                  className="inline-flex h-11 items-center gap-2 rounded-md bg-accent-strong px-6 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                >
                  Go to your workspace
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex h-11 items-center rounded-md bg-accent-strong px-6 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                  >
                    Create free account
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex h-11 items-center rounded-md border border-edge-strong px-6 text-sm font-medium text-ink transition-colors hover:border-accent/60"
                  >
                    Try the demo
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="card p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-md border border-accent/25 bg-accent/10 text-accent">
                  <f.icon className="h-4 w-4" aria-hidden />
                </div>
                <h3 className="mt-3 text-sm font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-secondary">{f.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-edge">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
          <p className="text-[11px] text-ink-muted">DevForge — simplifying software delivery, one screen at a time.</p>
          <p className="font-mono text-[11px] text-ink-muted">React · Tailwind · Express · Prisma</p>
        </div>
      </footer>
    </div>
  );
}